import requests
from environs import Env
from datetime import date, timedelta, datetime
import pandas as pd
import holidays

from data_mapping import cost_ticker

env = Env()
env.read_env("../.env")
ALGOPACK_API_KEY = env("ALGOPACK_API_KEY")


class FetchMoexData:
    def __fetch_json_from_moex(self, ticker, from_data, till_date):
        _min_date = date(2007, 1, 1)
        try:
            _from = datetime.fromisoformat(from_data).date()
        except ValueError:
            _from = date.today()
        try:
            _till = datetime.fromisoformat(till_date).date()
        except ValueError:
            _till = date.today()
        from_data = _min_date.isoformat() if _from <= _min_date else _from.isoformat()
        till_date = _min_date.isoformat() if _till <= _min_date else _till.isoformat()

        moex_api_base_url = "https://apim.moex.com"
        headers = {'Authorization': f'Bearer {ALGOPACK_API_KEY}'}

        start = datetime.fromisoformat(from_data)
        end = datetime.fromisoformat(till_date)

        numbers_data = []
        costs_data = []
        numbers_cols = None
        costs_cols = None

        cur = start
        while cur <= end:
            chunk_end = min(cur + timedelta(days=365), end)
            cur_from = cur.date().isoformat()
            cur_till = chunk_end.date().isoformat()

            url_numbers = f"{moex_api_base_url}/iss/analyticalproducts/futoi/securities/{ticker}.json?from={cur_from}&till={cur_till}&latest=1"
            url_costs = f"{moex_api_base_url}/iss/engines/stock/markets/shares/boards/tqbr/securities/{cost_ticker[ticker]}/candles.json?from={cur_from}&till={cur_till}&interval=24"

            resp_numbers = requests.get(url_numbers, headers=headers).json()
            resp_costs = requests.get(url_costs, headers=headers).json()

            if numbers_cols is None:
                numbers_cols = resp_numbers['futoi']['columns']
            if costs_cols is None:
                costs_cols = resp_costs['candles']['columns']

            numbers_data.extend(resp_numbers['futoi']['data'])
            costs_data.extend(resp_costs['candles']['data'])

            cur = chunk_end + timedelta(days=1)

        return {'columns': numbers_cols, 'data': numbers_data}, {'columns': costs_cols, 'data': costs_data}

    def __build_dataframes_from_json(self, response_numbers, response_costs):
        df_main = pd.DataFrame(response_numbers["data"], columns=response_numbers["columns"])
        df_costs = pd.DataFrame(response_costs['data'], columns=response_costs['columns'])[
            ['close', 'begin']]
        df_costs.columns = ['cost', 'tradedate']
        df_costs['tradedate'] = pd.to_datetime(df_costs['tradedate']).dt.date
        df_main['tradedate'] = pd.to_datetime(df_main['tradedate']).dt.date

        df_main = df_main.sort_values(by='tradedate', ascending=True)
        df_costs = df_costs.sort_values(by='tradedate', ascending=True)

        return df_main, df_costs

    def __add_open_interest_column(self, data_types, df_main):
        if data_types == "Number of contracts":
            open_interest_per_date = df_main.groupby('tradedate')['pos_long'].sum()
            df_main['open_interest'] = df_main['tradedate'].map(open_interest_per_date)
        return df_main

    def __filter_by_participant_type(self, participant_type, df_main):
        if participant_type:
            return df_main[df_main['clgroup'] == participant_type]
        return df_main

    def __filter_by_data_types(self, data_types, df_main):
        if data_types == "Number of contracts":
            return df_main.drop(columns=['pos_long_num', 'pos_short_num'])
        else:
            return df_main.drop(columns=['pos', 'pos_long', 'pos_short'])

    def __merge_all_dataframes(self, df_main, df_costs):
        return df_main.merge(df_costs[['tradedate', 'cost']], on='tradedate', how='left')

    def __drop_nans_and_holidays(self, df_main):
        try:
            df_main = df_main[df_main['cost'].notna()].reset_index(drop=True)
            start_year = df_main['tradedate'].min().year
            end_year = df_main['tradedate'].max().year
            ru_holidays = holidays.country_holidays("RU", years=range(start_year, end_year + 1))
            return df_main[df_main['tradedate'].apply(lambda d: d.weekday() < 5 and d not in ru_holidays)].reset_index(
                drop=True)
        except Exception:
            return df_main

    def __add_pos_column(self, df_main):
        if 'pos_long_num' in df_main.columns and 'pos_short_num' in df_main.columns:
            df_main['pos_num'] = df_main['pos_long_num'].abs() - df_main['pos_short_num'].abs()
        return df_main

    def __add_oscillator_column(self, participant_type, df_main, number_of_weeks, data_types):
        pos_col = 'pos' if data_types == "Number of contracts" else 'pos_num'
        window_str = f"{number_of_weeks * 7}D"

        groups = [participant_type] if participant_type else ['YUR', 'FIZ']

        for grp in groups:
            df_main[f"oscillator_{grp}"] = None
            mask = df_main['clgroup'] == grp

            idx = pd.to_datetime(df_main.loc[mask, 'tradedate'])
            vals = pd.Series(df_main.loc[mask, pos_col].values, index=idx).sort_index()

            if vals.empty:
                df_main.loc[mask, f"oscillator_{grp}"] = None
                continue

            rolling_min = vals.rolling(window=window_str, min_periods=1).min()
            rolling_max = vals.rolling(window=window_str, min_periods=1).max()

            denom = rolling_max - rolling_min

            osc = ((vals - rolling_min) / denom * 100).where(denom != 0, pd.NA).round()

            perdate = osc.groupby(osc.index.date).last()

            mapping = perdate.to_dict()

            df_main.loc[mask, f"oscillator_{grp}"] = df_main.loc[mask, 'tradedate'].map(mapping)

            min_available_date_for_group = vals.index.min().date()
            valid_oscillator_start_date = min_available_date_for_group + timedelta(weeks=number_of_weeks)

            df_main.loc[mask & (df_main['tradedate'] < valid_oscillator_start_date), f"oscillator_{grp}"] = None

        return df_main

    def _sanitize_dataframe(self, df: pd.DataFrame):
        df = df.where(pd.notna(df), None)
        return df

    def __calculate_date_by_weeks(self, number_of_weeks):
        today = date.today()
        start = today - timedelta(weeks=int(number_of_weeks))
        return start.isoformat(), today.isoformat()

    def fetchFutoiData(self, ticker, participant_type="", data_types="", from_data=str(date.today().isoformat()),
                       till_date=str(date.today().isoformat())):
        response_numbers, response_costs = self.__fetch_json_from_moex(ticker, from_data, till_date)

        if not response_numbers['columns'] or response_numbers['data'] == [] or not response_costs['columns'] or \
                response_costs['data'] == []:
            return pd.DataFrame(columns=[])

        df_main, df_costs = self.__build_dataframes_from_json(response_numbers, response_costs)

        df_main = self.__add_open_interest_column(data_types, df_main)

        print(df_main.head(5).to_string())

        df_main = self.__filter_by_participant_type(participant_type, df_main)

        df_main = self.__filter_by_data_types(data_types, df_main)

        df_main = self.__merge_all_dataframes(df_main, df_costs)

        df_main = self.__drop_nans_and_holidays(df_main)

        df_main = self.__add_pos_column(df_main)

        df_main = self._sanitize_dataframe(df_main)

        return df_main

    def fetchOscillatorData(self, ticker,
                            participant_type="",
                            data_types="",
                            from_data=str(date.today().isoformat()),
                            till_date=str(date.today().isoformat()),
                            number_of_weeks=0):

        try:
            requested_from_date = date.fromisoformat(from_data)
        except ValueError:
            requested_from_date = date.today()

        api_start_date = (requested_from_date - timedelta(weeks=number_of_weeks)).isoformat()

        response_numbers, response_costs = self.__fetch_json_from_moex(ticker, api_start_date, till_date)

        if not response_numbers['columns'] or response_numbers['data'] == [] or not response_costs['columns'] or \
                response_costs['data'] == []:
            return pd.DataFrame(columns=[])

        df_main, df_costs = self.__build_dataframes_from_json(response_numbers, response_costs)

        df_main = self.__filter_by_participant_type(participant_type, df_main)

        df_main = self.__filter_by_data_types(data_types, df_main)

        df_main = self.__merge_all_dataframes(df_main, df_costs)

        df_main = self.__drop_nans_and_holidays(df_main)

        df_main = self.__add_pos_column(df_main)

        df_main = self.__add_oscillator_column(participant_type, df_main, number_of_weeks=number_of_weeks,
                                               data_types=data_types)

        try:
            requested_till_date = date.fromisoformat(till_date)
        except ValueError:
            requested_till_date = date.today()

        mask_return = (df_main['tradedate'] >= requested_from_date) & (df_main['tradedate'] <= requested_till_date)
        df_main = df_main.loc[mask_return].reset_index(drop=True)

        df_main = self._sanitize_dataframe(df_main)

        return df_main

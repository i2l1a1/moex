import requests
from environs import Env
from datetime import date, timedelta, datetime
import pandas as pd
import holidays
from fastapi.responses import StreamingResponse
import io

from data_mapping import cost_mapping
from custom_costs_df import build_custom_costs_dataframe, build_custom_numbers_dataframe

env = Env()
env.read_env("../.env")
ALGOPACK_API_KEY = env("ALGOPACK_API_KEY")


class FetchMoexData:
    moex_api_base_url = "https://apim.moex.com"
    headers = {'Authorization': f'Bearer {ALGOPACK_API_KEY}'}

    def __fetch_data_in_chunks(self, chunk_fetcher, from_data, till_date, root_key):
        _min_date = date(2007, 1, 1)
        try:
            _from = datetime.fromisoformat(from_data).date()
        except ValueError:
            _from = date.today()
        try:
            _till = datetime.fromisoformat(till_date).date()
        except ValueError:
            _till = date.today()

        _from = _min_date if _from <= _min_date else _from
        _till = _min_date if _till <= _min_date else _till

        start = datetime.fromisoformat(_from.isoformat())
        end = datetime.fromisoformat(_till.isoformat())

        data_rows = []
        cols = None

        cur = start
        while cur <= end:
            chunk_end = min(cur + timedelta(days=365), end)
            cur_from = cur.date().isoformat()
            cur_till = chunk_end.date().isoformat()

            resp = chunk_fetcher(cur_from, cur_till)

            if cols is None:
                cols = resp[root_key]["columns"]

            data_rows.extend(resp[root_key]["data"])

            cur = chunk_end + timedelta(days=1)

        return {"columns": cols, "data": data_rows}

    def __fetch_candles_for_ticker(self, ticker, from_data, till_date):
        url_costs = "iss/engines/stock/markets/shares/boards/tqbr/securities"
        url_type = cost_mapping[ticker].url_type

        if url_type == "futures":
            url_costs = "iss/engines/futures/markets/forts/boards/rfud/securities"
        elif url_type == "index":
            url_costs = "iss/engines/stock/markets/index/securities"
        elif url_type == "currency":
            url_costs = "iss/engines/currency/markets/selt/boardgroups/13/securities"

        asset_code = cost_mapping[ticker].asset_code[0]

        def chunk_fetcher(cur_from, cur_till):
            url = f"{self.moex_api_base_url}/{url_costs}/{asset_code}/candles.json?from={cur_from}&till={cur_till}&interval=24"
            return requests.get(url, headers=self.headers).json()

        return self.__fetch_data_in_chunks(chunk_fetcher, from_data, till_date, root_key="candles")

    def __fetch_candles_for_asset_code(self, asset_code, from_data, till_date):
        mapping_entry = cost_mapping[asset_code]
        url_costs = "iss/engines/stock/markets/shares/boards/tqbr/securities"
        url_type = mapping_entry.url_type
        moex_code = mapping_entry.asset_code[0]

        if url_type == "futures":
            url_costs = "iss/engines/futures/markets/forts/boards/rfud/securities"
        elif url_type == "index":
            url_costs = "iss/engines/stock/markets/index/securities"
        elif url_type == "currency":
            url_costs = "iss/engines/currency/markets/selt/boardgroups/13/securities"

        def chunk_fetcher(cur_from, cur_till):
            url = f"{self.moex_api_base_url}/{url_costs}/{moex_code}/candles.json?from={cur_from}&till={cur_till}&interval=24"
            return requests.get(url, headers=self.headers).json()

        return self.__fetch_data_in_chunks(chunk_fetcher, from_data, till_date, root_key="candles")

    def __fetch_futoi_for_ticker(self, ticker, from_data, till_date):
        def build_numbers_url(cur_from, cur_till):
            return f"{self.moex_api_base_url}/iss/analyticalproducts/futoi/securities/{ticker}.json?from={cur_from}&till={cur_till}&latest=1"

        def chunk_fetcher(cur_from, cur_till):
            return requests.get(build_numbers_url(cur_from, cur_till), headers=self.headers).json()

        return self.__fetch_data_in_chunks(chunk_fetcher, from_data, till_date, root_key="futoi")

    def __fetch_futoi_for_asset_code(self, asset_code, from_data, till_date):
        def build_numbers_url(cur_from, cur_till):
            return f"{self.moex_api_base_url}/iss/analyticalproducts/futoi/securities/{asset_code}.json?from={cur_from}&till={cur_till}&latest=1"

        def chunk_fetcher(cur_from, cur_till):
            return requests.get(build_numbers_url(cur_from, cur_till), headers=self.headers).json()

        return self.__fetch_data_in_chunks(chunk_fetcher, from_data, till_date, root_key="futoi")

    def __fetch_ticker_data(self, ticker, from_data, till_date):
        is_custom = cost_mapping[ticker].url_type == "custom"
        needs_synthetic_nums = is_custom and ticker == "РТС"

        if needs_synthetic_nums:
            base_codes = cost_mapping[ticker].asset_code
            resp_numbers = [
                self.__fetch_futoi_for_asset_code(code, from_data, till_date)
                for code in base_codes
            ]
        else:
            resp_numbers = self.__fetch_futoi_for_ticker(ticker, from_data, till_date)

        if not is_custom:
            resp_costs = self.__fetch_candles_for_ticker(ticker, from_data, till_date)
        else:
            base_codes = cost_mapping[ticker].asset_code
            resp_costs = [
                self.__fetch_candles_for_asset_code(code, from_data, till_date)
                for code in base_codes
            ]

        return resp_numbers, resp_costs, is_custom, needs_synthetic_nums

    def __build_cost_dataframe(self, response_costs):
        df_costs = pd.DataFrame(response_costs['data'], columns=response_costs['columns'])
        if 'close' in df_costs.columns and 'begin' in df_costs.columns:
            df_costs = df_costs[['close', 'begin']]
            df_costs.columns = ['cost', 'tradedate']
            df_costs['tradedate'] = pd.to_datetime(df_costs['tradedate']).dt.date
        if 'tradedate' in df_costs.columns:
            df_costs = df_costs.sort_values(by='tradedate', ascending=True)
        return df_costs

    def __build_numbers_dataframe(self, response_numbers):
        df_main = pd.DataFrame(response_numbers["data"], columns=response_numbers["columns"])
        df_main.drop(['sess_id', 'seqnum', 'systime', 'trade_session_date'], axis=1, inplace=True, errors='ignore')
        if 'tradedate' in df_main.columns:
            df_main['tradedate'] = pd.to_datetime(df_main['tradedate']).dt.date
            df_main = df_main.sort_values(by='tradedate', ascending=True)
        return df_main

    def __build_dataframes_from_json(self, ticker, response_numbers, response_costs, is_custom=False,
                                     needs_synthetic_numbers=False):
        if needs_synthetic_numbers:
            base_numbers_dfs = [self.__build_numbers_dataframe(resp) for resp in response_numbers]
            df_main = build_custom_numbers_dataframe(ticker, base_numbers_dfs)
        else:
            df_main = self.__build_numbers_dataframe(response_numbers)

        if not is_custom:
            df_costs = self.__build_cost_dataframe(response_costs)
        else:
            base_cost_dfs = [self.__build_cost_dataframe(resp) for resp in response_costs]
            df_costs = build_custom_costs_dataframe(ticker, base_cost_dfs)

        return df_main, df_costs, list(set(df_main.columns) | set(df_costs.columns))

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
        if not df_main.empty and not df_costs.empty:
            return df_main.merge(df_costs[['tradedate', 'cost']], on='tradedate', how='outer')
        elif not df_main.empty:
            return df_main
        elif not df_costs.empty:
            return df_costs
        return pd.DataFrame()

    def __drop_holidays_and_unnecessary_dates(self, df_main):
        try:
            start_year = df_main['tradedate'].min().year
            end_year = df_main['tradedate'].max().year
            ru_holidays = holidays.country_holidays("RU", years=range(start_year, end_year + 1))

            exclude_start = date(2022, 3, 1)
            exclude_end = date(2022, 3, 23)

            return df_main[df_main['tradedate'].apply(
                lambda d: d.weekday() < 5 and d not in ru_holidays and not (exclude_start <= d <= exclude_end)
            )].reset_index(drop=True)
        except Exception:
            return df_main

    def __add_pos_column(self, df_main):
        if 'pos_long_num' in df_main.columns and 'pos_short_num' in df_main.columns:
            df_main['pos_num'] = df_main['pos_long_num'].abs() - df_main['pos_short_num'].abs()
        return df_main

    def __add_oscillator_column(self, participant_type, df_main, number_of_weeks, data_types):
        if "clgroup" not in df_main.columns:
            return df_main

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
        return df.replace({pd.NA: None, float('nan'): None, pd.NaT: None})

    def __count_missing_values(self, initial_columns, df_main):
        initial_columns += ['pos_num', 'open_interest']
        null_counts = df_main.isnull().sum()

        missing_counts = {
            col: int(null_counts[col]) for col in initial_columns if col in null_counts
        }

        return missing_counts

    def __calculate_date_by_weeks(self, number_of_weeks):
        today = date.today()
        start = today - timedelta(weeks=int(number_of_weeks))
        return start.isoformat(), today.isoformat()

    def fetchFutoiData(self, ticker, participant_type="", data_types="", from_data=str(date.today().isoformat()),
                       till_date=str(date.today().isoformat())):
        response_numbers, response_costs, is_custom, needs_synthetic_numbers = self.__fetch_ticker_data(ticker,
                                                                                                        from_data,
                                                                                                        till_date)

        df_main, df_costs, initial_columns = self.__build_dataframes_from_json(
            ticker, response_numbers, response_costs, is_custom=is_custom,
            needs_synthetic_numbers=needs_synthetic_numbers
        )

        if df_main.empty and df_costs.empty:
            return {"data": pd.DataFrame(), "missing_counts": {}}

        df_main = self.__add_open_interest_column(data_types, df_main)

        df_main = self.__filter_by_participant_type(participant_type, df_main)

        df_main = self.__filter_by_data_types(data_types, df_main)

        df_main = self.__merge_all_dataframes(df_main, df_costs)

        df_main = self.__drop_holidays_and_unnecessary_dates(df_main)

        df_main = self.__add_pos_column(df_main)

        df_main = self._sanitize_dataframe(df_main)

        missing_counts = self.__count_missing_values(initial_columns, df_main)

        return {"data": df_main, "missing_counts": missing_counts}

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

        response_numbers, response_costs, is_custom, needs_synthetic_numbers = self.__fetch_ticker_data(ticker,
                                                                                                         api_start_date,
                                                                                                         till_date)

        df_main, df_costs, _ = self.__build_dataframes_from_json(
            ticker, response_numbers, response_costs, is_custom=is_custom,
            needs_synthetic_numbers=needs_synthetic_numbers
        )

        if df_main.empty and df_costs.empty:
            return pd.DataFrame()

        df_main = self.__filter_by_participant_type(participant_type, df_main)

        df_main = self.__filter_by_data_types(data_types, df_main)

        df_main = self.__merge_all_dataframes(df_main, df_costs)

        df_main = self.__drop_holidays_and_unnecessary_dates(df_main)

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

    def downloadTable(self, ticker, participant_type="", data_types="", from_data=str(date.today().isoformat()),
                      till_date=str(date.today().isoformat()), number_of_weeks=0):

        response_numbers, response_costs, is_custom, needs_synthetic_numbers = self.__fetch_ticker_data(ticker,
                                                                                                        from_data,
                                                                                                        till_date)

        df_main, df_costs, _ = self.__build_dataframes_from_json(
            ticker, response_numbers, response_costs, is_custom=is_custom,
            needs_synthetic_numbers=needs_synthetic_numbers
        )

        df_main = self.__filter_by_participant_type(participant_type, df_main)

        df_main = self.__merge_all_dataframes(df_main, df_costs)

        df_main = self.__drop_holidays_and_unnecessary_dates(df_main)

        df_main = self.__add_open_interest_column(data_types, df_main)

        df_main = self.__add_pos_column(df_main)

        df_main = self.__add_oscillator_column(participant_type, df_main, number_of_weeks=number_of_weeks,
                                               data_types=data_types)

        output = io.BytesIO()
        with pd.ExcelWriter(output, engine='xlsxwriter') as writer:  # type: ignore
            df_main.to_excel(writer, index=False, sheet_name='Sheet1')
        output.seek(0)

        return StreamingResponse(output)

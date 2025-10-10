import requests
from environs import Env
from datetime import date
import pandas as pd
import holidays

from data_mapping import cost_ticker

env = Env()
env.read_env("../.env")
ALGOPACK_API_KEY = env("ALGOPACK_API_KEY")


class FetchMoexData:
    def __fetch_json_from_moex(self, ticker, from_data, till_date):
        moex_api_base_url = "https://apim.moex.com"
        url_numbers = f"{moex_api_base_url}/iss/analyticalproducts/futoi/securities/{ticker}.json?from={from_data}&till={till_date}&latest=1"
        url_costs = f"{moex_api_base_url}/iss/engines/stock/markets/shares/boards/tqbr/securities/{cost_ticker[ticker]}/candles.json?from={from_data}&till={till_date}&interval=24"

        headers = {
            'Authorization': f'Bearer {ALGOPACK_API_KEY}',
        }

        response_numbers = requests.request("GET", url_numbers, headers=headers).json()
        response_costs = requests.request("GET", url_costs, headers=headers).json()

        return response_numbers, response_costs

    def __build_dataframes_from_json(self, response_numbers, response_costs):
        df_main = pd.DataFrame(response_numbers["futoi"]["data"], columns=response_numbers["futoi"]["columns"])[::-1]
        df_costs = pd.DataFrame(response_costs['candles']['data'], columns=response_costs['candles']['columns'])[
            ['close', 'begin']]
        df_costs.columns = ['cost', 'tradedate']
        df_costs['tradedate'] = pd.to_datetime(df_costs['tradedate']).dt.date
        df_main['tradedate'] = pd.to_datetime(df_main['tradedate']).dt.date

        return df_main, df_costs

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

    def fetchFutoiData(self, ticker, participant_type="", data_types="", from_data=str(date.today().isoformat()),
                       till_date=str(date.today().isoformat())):
        response_numbers, response_costs = self.__fetch_json_from_moex(ticker, from_data, till_date)

        df_main, df_costs = self.__build_dataframes_from_json(response_numbers, response_costs)

        df_main = self.__filter_by_participant_type(participant_type, df_main)

        df_main = self.__filter_by_data_types(data_types, df_main)

        df_main = self.__merge_all_dataframes(df_main, df_costs)

        df_main = self.__drop_nans_and_holidays(df_main)

        df_main = self.__add_pos_column(df_main)

        return df_main

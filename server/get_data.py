import requests
from environs import Env
from datetime import date
import pandas as pd

from data_mapping import cost_ticker

env = Env()
env.read_env("../.env")
ALGOPACK_API_KEY = env("ALGOPACK_API_KEY")


class GetDataFromAPI:
    def getFutoi(self, ticker, participant_type="", from_data=str(date.today().isoformat()),
                 till_date=str(date.today().isoformat())):
        url_numbers = f"https://apim.moex.com/iss/analyticalproducts/futoi/securities/{ticker}.json?from={from_data}&till={till_date}&latest=1"
        url_costs = f"https://apim.moex.com/iss/engines/stock/markets/shares/boards/tqbr/securities/{cost_ticker[ticker]}/candles.json?from={from_data}&till={till_date}&interval=24"

        headers = {
            'Authorization': f'Bearer {ALGOPACK_API_KEY}',
        }

        response_numbers = requests.request("GET", url_numbers, headers=headers)
        response_costs = requests.request("GET", url_costs, headers=headers).json()

        df_main = pd.DataFrame(response_numbers.json()["futoi"]["data"],
                               columns=response_numbers.json()["futoi"]["columns"])[::-1]
        df_costs = pd.DataFrame(response_costs['candles']['data'], columns=response_costs['candles']['columns'])[
            ['close', 'begin']]
        df_costs.columns = ['cost', 'tradedate']

        if participant_type:
            df_main = df_main[df_main['clgroup'] == participant_type]

        df_costs['tradedate'] = pd.to_datetime(df_costs['tradedate']).dt.date
        df_main['tradedate'] = pd.to_datetime(df_main['tradedate']).dt.date
        df_main = df_main.merge(df_costs[['tradedate', 'cost']], on='tradedate', how='left')

        if 'cost' in df_main.columns:
            df_main = df_main[df_main['cost'].notna()].reset_index(drop=True)

        return df_main

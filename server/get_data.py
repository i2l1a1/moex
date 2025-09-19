import requests
from environs import Env
from datetime import date
import pandas as pd

env = Env()
env.read_env("../.env")
ALGOPACK_API_KEY = env("ALGOPACK_API_KEY")


class GetDataFromAPI:
    def getFutoi(self, ticker, participant_type="", from_data=str(date.today().isoformat()),
                 till_date=str(date.today().isoformat())):
        url = f"https://apim.moex.com/iss/analyticalproducts/futoi/securities/{ticker}.json?from={from_data}&till={till_date}&latest=1"

        headers = {
            'Authorization': f'Bearer {ALGOPACK_API_KEY}',
        }

        response = requests.request("GET", url, headers=headers)

        df = pd.DataFrame(response.json()["futoi"]["data"], columns=response.json()["futoi"]["columns"])[::-1]

        if participant_type:
            df = df[df['clgroup'] == participant_type]
            print(df.shape)

        return df

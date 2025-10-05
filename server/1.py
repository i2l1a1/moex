import requests

url_1 = f"https://apim.moex.com/iss/analyticalproducts/futoi/securities/Т.json?from=2024-01-01&till=2025-01-01&latest=1"

# url_2 = "https://apim.moex.com/iss/engines/stock/markets/shares/boards/tqbr/securities/sber/candles.json?from=22-01-01&till=2022-12-31&interval=24"       # 22
# url_3 = "https://apim.moex.com/iss/engines/stock/markets/shares/boards/tqbr/securities/sber/candles.json?from=23-01-01&till=2023-12-31&interval=24"       # 23
# url_4 = "https://apim.moex.com/iss/engines/stock/markets/shares/boards/tqbr/securities/sber/candles.json?from=24-01-01&till=2024-12-31&interval=24"       # 24
# url_5 = "https://apim.moex.com/iss/engines/stock/markets/shares/boards/tqbr/securities/sber/candles.json?from=25-01-01&till=2025-12-31&interval=24"       # 25

ALGOPACK_API_KEY = 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJaVHA2Tjg1ekE4YTBFVDZ5SFBTajJ2V0ZldzNOc2xiSVR2bnVaYWlSNS1NIn0.eyJleHAiOjE3NTk5Mjg0OTEsImlhdCI6MTc1NzMzNjQ5MSwiYXV0aF90aW1lIjoxNzU3MzM1NzIyLCJqdGkiOiI2OTliMTczMC1iYTU3LTQ2NzgtYjFmNS03MTZkMzZkMzI0Y2QiLCJpc3MiOiJodHRwczovL3NzbzIubW9leC5jb20vYXV0aC9yZWFsbXMvY3JhbWwiLCJhdWQiOlsiYWNjb3VudCIsImlzcyJdLCJzdWIiOiJmOjBiYTZhOGYwLWMzOGEtNDlkNi1iYTBlLTg1NmYxZmU0YmY3ZTo5OGYzYjJlMi1jZDg0LTRlMzctOTA2Yi05NDA2NGRjZTYzYTAiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJpc3MiLCJzaWQiOiIxZWRmMjRlYS02NWEyLTQ0NzEtODAyMy1jMDE0YWI1OWI2N2IiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIi8qIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoib3BlbmlkIGlzc19hbGdvcGFjayBwcm9maWxlIG9mZmxpbmVfYWNjZXNzIGVtYWlsIGJhY2t3YXJkc19jb21wYXRpYmxlIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJpc3NfcGVybWlzc2lvbnMiOiIxMzcsIDEzOCwgMTM5LCAxNDAsIDE2NSwgMTY2LCAxNjcsIDE2OCwgMzI5LCA0MjEiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI5OGYzYjJlMi1jZDg0LTRlMzctOTA2Yi05NDA2NGRjZTYzYTAiLCJzZXNzaW9uX3N0YXRlIjoiMWVkZjI0ZWEtNjVhMi00NDcxLTgwMjMtYzAxNGFiNTliNjdiIn0.PRqr_zajorS0mAIJRO2fL_56qcf5UnXkNSJ87qMkAHHkHMuLcPbhCESV5_o5K6g0YBz78fhzpcVOYvDjHcpwqrq0XqveBhmSy9kjQFFtApKqpJ1jOgNdLEQt264eDcTS-K4wjla4Kp8BmZ5i8aFVbgBek00gHDMpsp4ipfsJq74MwmITmsmwq4KeCo5dRcHNwBM4DL_RalGN3_cQPJn6ZnCpypoaoftn1ST7Mj-SNPgo6mooXWagn5q6KCrL61PyMWXKQUQIQyApliidh06nxDWWet2Iq0vW_P11Un3egfQezOHgQUs-s7_sQG7-Ph79isHGC1Ugg7YLqIi_fWzTjw'

headers = {
    'Authorization': f'Bearer {ALGOPACK_API_KEY}',
}

response_1 = requests.request("GET", url_1, headers=headers)
# response_2 = requests.request("GET", url_2, headers=headers)
# response_3 = requests.request("GET", url_3, headers=headers)
# response_4 = requests.request("GET", url_4, headers=headers)
# response_5 = requests.request("GET", url_5, headers=headers)

print(response_1.json())
# print(response_2.json())
# print(response_3.json())
# print(response_4.json())
# print(response_5.json())

"""
{'candles': {'metadata': {'open': {'type': 'double'}, 'close': {'type': 'double'}, 'high': {'type': 'double'}, 'low': {'type': 'double'}, 'value': {'type': 'double'}, 'volume': {'type': 'double'}, 'begin': {'type': 'datetime', 'bytes': 19, 'max_size': 0}, 'end': {'type': 'datetime', 'bytes': 19, 'max_size': 0}}, 
'columns': ['open', 'close', 'high', 'low', 'value',          'volume',   'begin',                   'end'], 
'data':    [[288.88, 286.4, 290.39, 285.11, 6576740304.079999, 22897705, '2025-10-01 00:00:00', '2025-10-01 23:59:54'], 
            [286.4, 285.22, 287.15, 282.8, 7977142960.950017,  28023440, '2025-10-02 00:00:00', '2025-10-02 23:59:59'], 
            [285.75, 282.91, 287.32, 282.58, 4866587736.440003, 17098575, '2025-10-03 00:00:00', '2025-10-03 23:59:59']]}}

close за день   interval=24
begin or end
"""

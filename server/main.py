# from get_data import GetDataFromAPI
#
# api_data = GetDataFromAPI()
# print(api_data.getFutoi("si", from_data="2024-01-15", till_date="2024-03-20").to_string())

import uvicorn
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from routers import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("main:app", port=9091, reload=True)

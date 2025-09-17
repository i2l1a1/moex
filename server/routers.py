from fastapi import APIRouter
from get_data import GetDataFromAPI

router = APIRouter()

api_data = GetDataFromAPI()


@router.get("/just_for_fun")
async def just_for_fun():
    return "Wow!"


@router.get("/get_all_data")
async def get_all_data(from_data: str = "2025-01-01", till_date: str = "2025-09-17"):
    return api_data.getFutoi("si", from_data=from_data, till_date=till_date).to_dict(orient="records")

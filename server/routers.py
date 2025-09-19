from fastapi import APIRouter
from get_data import GetDataFromAPI
from schemas import RequestParameters

router = APIRouter()

api_data = GetDataFromAPI()


@router.get("/just_for_fun")
async def just_for_fun():
    return "Wow!"


@router.post("/get_all_data")
async def get_all_data(req_parameters: RequestParameters):
    print(req_parameters)
    return api_data.getFutoi(
        req_parameters.ticker,
        participant_type=req_parameters.participant_type,
        from_data=req_parameters.from_data,
        till_date=req_parameters.till_date
    ).to_dict(orient="records")

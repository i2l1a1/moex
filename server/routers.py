from fastapi import APIRouter
from get_data import FetchMoexData
from schemas import RequestParameters

router = APIRouter()

moex_data = FetchMoexData()


@router.get("/just_for_fun")
async def just_for_fun():
    return "Wow!"


@router.post("/get_all_data")
async def get_all_data(req_parameters: RequestParameters):
    return moex_data.fetchFutoiData(
        req_parameters.ticker,
        participant_type=req_parameters.participant_type,
        data_types=req_parameters.data_types,
        from_data=req_parameters.from_data,
        till_date=req_parameters.till_date
    ).to_dict(orient="records")

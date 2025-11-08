from fastapi import APIRouter
from get_data import FetchMoexData
from schemas import AllDataRequestParameters, OscillatorDataRequestParameters

router = APIRouter()

moex_data = FetchMoexData()


@router.get("/just_for_fun")
async def just_for_fun():
    return "Wow!"


@router.post("/get_futoi_data")
async def get_futoi_data(req_parameters: AllDataRequestParameters):
    return moex_data.fetchFutoiData(
        req_parameters.ticker,
        participant_type=req_parameters.participant_type,
        data_types=req_parameters.data_types,
        from_data=req_parameters.from_data,
        till_date=req_parameters.till_date
    ).to_dict(orient="records")


@router.post("/get_oscillator_data")
async def get_oscillator_data(req_parameters: OscillatorDataRequestParameters):
    return moex_data.fetchOscillatorData(
        req_parameters.ticker,
        participant_type=req_parameters.participant_type,
        data_types=req_parameters.data_types,
        from_data=req_parameters.from_data,
        till_date=req_parameters.till_date,
        number_of_weeks=req_parameters.number_of_weeks,
    ).to_dict(orient="records")


@router.post("/get_table")
async def get_table(req_parameters: OscillatorDataRequestParameters):
    return moex_data.downloadTable(
        req_parameters.ticker,
        participant_type=req_parameters.participant_type,
        data_types=req_parameters.data_types,
        from_data=req_parameters.from_data,
        till_date=req_parameters.till_date,
        number_of_weeks=req_parameters.number_of_weeks
    )

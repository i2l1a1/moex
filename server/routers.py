from fastapi import APIRouter
from get_data import FetchMoexData
from schemas import AllDataRequestParameters, OscillatorDataRequestParameters
from schemas import FutoiDataResponse
import asyncio

router = APIRouter()

moex_data = FetchMoexData()


@router.post("/get_futoi_data", response_model=FutoiDataResponse)
async def get_futoi_data(req_parameters: AllDataRequestParameters):
    futoi_data = await moex_data.fetchFutoiData(
        req_parameters.ticker,
        participant_type=req_parameters.participant_type,
        data_types=req_parameters.data_types,
        from_data=req_parameters.from_data,
        till_date=req_parameters.till_date
    )
    records = await asyncio.to_thread(lambda: futoi_data["data"].to_dict(orient="records"))
    return {
        "data": records,
        "missing_counts": futoi_data["missing_counts"],
    }


@router.post("/get_oscillator_data")
async def get_oscillator_data(req_parameters: OscillatorDataRequestParameters):
    df = await moex_data.fetchOscillatorData(
        req_parameters.ticker,
        participant_type=req_parameters.participant_type,
        data_types=req_parameters.data_types,
        from_data=req_parameters.from_data,
        till_date=req_parameters.till_date,
        number_of_weeks=req_parameters.number_of_weeks,
    )
    return await asyncio.to_thread(lambda: df.to_dict(orient="records"))


@router.post("/get_table")
async def get_table(req_parameters: OscillatorDataRequestParameters):
    return await moex_data.downloadTable(
        req_parameters.ticker,
        participant_type=req_parameters.participant_type,
        data_types=req_parameters.data_types,
        from_data=req_parameters.from_data,
        till_date=req_parameters.till_date,
        number_of_weeks=req_parameters.number_of_weeks
    )

from pydantic import BaseModel


class BasicRequestParameters(BaseModel):
    ticker: str  # example: si
    participant_type: str  # individuals
    data_types: str  # Number of contracts / Number of traders


class AllDataRequestParameters(BasicRequestParameters):
    from_data: str  # example: 2024-01-01
    till_date: str  # example: 2025-01-01


class OscillatorDataRequestParameters(AllDataRequestParameters):
    number_of_weeks: int  # example: 12


class FutoiDataResponse(BaseModel):
    data: list[dict]
    main_misses: int
    cost_misses: int

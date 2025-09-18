from pydantic import BaseModel


class RequestParameters(BaseModel):
    ticker: str         # example: si
    from_data: str      # example: 2024-01-01
    till_date: str      # example: 2025-01-01

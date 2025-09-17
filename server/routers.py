from fastapi import APIRouter

router = APIRouter()


@router.get("/just_for_fun")
async def just_for_fun():
    return "Wow!"

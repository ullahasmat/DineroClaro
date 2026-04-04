from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def list_financial():
    return {"message": "financial route placeholder"}

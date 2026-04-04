from fastapi import APIRouter

from ..schemas.common import HealthResponse

router = APIRouter()


@router.get("/", response_model=HealthResponse)
def healthcheck():
    return HealthResponse(status="ok", service="DineroClaro API")

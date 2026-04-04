from fastapi import APIRouter

from ..schemas.recommendation import RecommendationRequest, RecommendationResponse
from ..services.recommendation_service import get_recommendations

router = APIRouter()


@router.post("/", response_model=RecommendationResponse)
async def recommendations(req: RecommendationRequest):
    return get_recommendations(req.user_id, req.locale)

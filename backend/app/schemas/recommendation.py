from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    user_id: int | None = None
    locale: str | None = "en"


class RecommendationItem(BaseModel):
    title: str
    summary: str
    action_url: str | None = None


class RecommendationResponse(BaseModel):
    items: list[RecommendationItem]

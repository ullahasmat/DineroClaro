from pydantic import BaseModel


class RecommendationRequest(BaseModel):
    user_id: int | None = None
    locale: str | None = "en"
    financial_goal: str | None = None   # 'build_credit' | 'save_money' | 'start_investing'
    life_stage: str | None = None       # 'new_arrival' | 'first_gen' | 'established'


class RecommendationItem(BaseModel):
    title: str
    summary: str
    action_url: str | None = None


class RecommendationResponse(BaseModel):
    items: list[RecommendationItem]

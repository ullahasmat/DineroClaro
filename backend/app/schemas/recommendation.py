from typing import Optional

from pydantic import BaseModel


class RecommendationItem(BaseModel):
    id: int
    category: Optional[str] = None
    name: str
    provider: Optional[str] = None
    description: str
    tags: Optional[str] = None
    target_goal: Optional[str] = None
    target_life_stage: Optional[str] = None
    featured: bool = False

    class Config:
        from_attributes = True


class RecommendationRequest(BaseModel):
    user_id: int | None = None
    locale: str | None = "en"
    financial_goal: str | None = None   # 'build_credit' | 'save_money' | 'start_investing'
    life_stage: str | None = None       # 'new_arrival' | 'first_gen' | 'established'


class RecommendationResponse(BaseModel):
    items: list[RecommendationItem]

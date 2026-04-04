from ..core.config import settings
from ..schemas.recommendation import RecommendationItem, RecommendationResponse


def get_recommendations(user_id: int | None = None, locale: str | None = "en") -> RecommendationResponse:
    """Return a minimal recommendation list. Replace with real scoring later."""
    items = [
        RecommendationItem(
            title="Build an emergency fund",
            summary="Save 1 month of expenses in a high-yield account to start.",
            action_url="https://supabase.com/" if settings.supabase_url else None,
        ),
        RecommendationItem(
            title="Pay down highest interest debt",
            summary="List debts by APR and pay extra on the highest first.",
            action_url=None,
        ),
    ]
    return RecommendationResponse(items=items)

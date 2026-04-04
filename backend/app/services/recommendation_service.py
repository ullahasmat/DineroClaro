from ..schemas.recommendation import RecommendationItem, RecommendationResponse

RECOMMENDATIONS = {
    "build_credit": [
        RecommendationItem(
            title="Open a secured credit card",
            summary="A secured card requires a deposit and helps you build credit history from scratch.",
            action_url=None,
        ),
        RecommendationItem(
            title="Become an authorized user",
            summary="Ask a trusted family member to add you to their card. Their good history helps your score.",
            action_url=None,
        ),
        RecommendationItem(
            title="Try a credit-builder loan",
            summary="Banks like Self or local credit unions offer small loans designed to build your credit.",
            action_url=None,
        ),
    ],
    "save_money": [
        RecommendationItem(
            title="Open a high-yield savings account",
            summary="Earn more interest on your savings. Look for accounts with 4%+ APY and no fees.",
            action_url=None,
        ),
        RecommendationItem(
            title="Build a $500 emergency fund first",
            summary="Start small. Save $20-$50 per week until you reach $500 — then keep going.",
            action_url=None,
        ),
        RecommendationItem(
            title="Pay down highest interest debt",
            summary="List your debts by APR. Pay extra on the highest one first to save money on interest.",
            action_url=None,
        ),
    ],
    "start_investing": [
        RecommendationItem(
            title="Start with index funds",
            summary="Index funds like VOO or VTI track the whole market. Low fees, low risk, long-term growth.",
            action_url=None,
        ),
        RecommendationItem(
            title="Open a Roth IRA",
            summary="Contribute up to $7,000/year. Your money grows tax-free — great for long-term wealth.",
            action_url=None,
        ),
        RecommendationItem(
            title="Try a micro-investing app",
            summary="Apps like Acorns or Robinhood let you start investing with as little as $1.",
            action_url=None,
        ),
    ],
}

DEFAULT_RECOMMENDATIONS = [
    RecommendationItem(
        title="Set a financial goal",
        summary="Tell us if you want to build credit, save money, or start investing — we'll guide you.",
        action_url=None,
    ),
    RecommendationItem(
        title="Track your spending",
        summary="Write down what you spend for one week. Awareness is the first step to saving.",
        action_url=None,
    ),
]


def get_recommendations(
    user_id: int | None = None,
    locale: str | None = "en",
    financial_goal: str | None = None,
    life_stage: str | None = None,
) -> RecommendationResponse:
    items = RECOMMENDATIONS.get(financial_goal, DEFAULT_RECOMMENDATIONS)
    return RecommendationResponse(items=items)

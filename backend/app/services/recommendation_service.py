from ..schemas.recommendation import RecommendationItem, RecommendationResponse

RECOMMENDATIONS = {
    "build_credit": [
        RecommendationItem(
            id=1,
            name="Open a Secured Credit Card",
            category="credit_card",
            description="A secured card requires a deposit and helps you build credit history from scratch.",
            featured=True,
        ),
        RecommendationItem(
            id=2,
            name="Become an Authorized User",
            category="credit_card",
            description="Ask a trusted family member to add you to their card. Their good history helps your score.",
            featured=False,
        ),
        RecommendationItem(
            id=3,
            name="Try a Credit-Builder Loan",
            category="bank",
            description="Banks like Self or local credit unions offer small loans designed to build your credit.",
            featured=False,
        ),
    ],
    "save_money": [
        RecommendationItem(
            id=4,
            name="High-Yield Savings Account",
            category="bank",
            description="Earn more interest on your savings. Look for accounts with 4%+ APY and no fees.",
            featured=True,
        ),
        RecommendationItem(
            id=5,
            name="Build a $500 Emergency Fund",
            category="bank",
            description="Start small. Save $20–$50 per week until you reach $500 — then keep going.",
            featured=False,
        ),
        RecommendationItem(
            id=6,
            name="Pay Down High-Interest Debt",
            category="bank",
            description="List your debts by APR. Pay extra on the highest one first to save money on interest.",
            featured=False,
        ),
    ],
    "start_investing": [
        RecommendationItem(
            id=7,
            name="Start with Index Funds",
            category="investing_app",
            description="Index funds like VOO or VTI track the whole market. Low fees, low risk, long-term growth.",
            featured=True,
        ),
        RecommendationItem(
            id=8,
            name="Open a Roth IRA",
            category="investing_app",
            description="Contribute up to $7,000/year. Your money grows tax-free — great for long-term wealth.",
            featured=False,
        ),
        RecommendationItem(
            id=9,
            name="Try a Micro-Investing App",
            category="investing_app",
            provider="Acorns / Robinhood",
            description="Start investing with as little as $1. Great for beginners building the habit.",
            featured=False,
        ),
    ],
}

DEFAULT_RECOMMENDATIONS = [
    RecommendationItem(
        id=10,
        name="Set a Financial Goal",
        description="Tell us if you want to build credit, save money, or start investing — we'll guide you.",
        featured=False,
    ),
    RecommendationItem(
        id=11,
        name="Track Your Spending",
        description="Write down what you spend for one week. Awareness is the first step to saving.",
        featured=False,
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

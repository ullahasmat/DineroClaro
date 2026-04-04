from sqlalchemy import Column, DateTime, Integer, Numeric, String, func

from .base import Base


class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, unique=True)
    credit_score = Column(Integer, nullable=True)
    credit_score_range = Column(String, nullable=True)
    monthly_income = Column(Numeric(12, 2), nullable=True)
    checking_balance = Column(Numeric(12, 2), nullable=True)
    total_debt = Column(Numeric(12, 2), nullable=True)
    financial_goal = Column(String, nullable=True)
    risk_tolerance = Column(String, nullable=True)
    life_stage = Column(String, nullable=True)
    last_updated = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

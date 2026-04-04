from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class FinancialProfileUpdate(BaseModel):
    credit_score: Optional[int] = None
    credit_score_range: Optional[str] = None
    monthly_income: Optional[float] = None
    checking_balance: Optional[float] = None
    total_debt: Optional[float] = None
    financial_goal: Optional[str] = None
    risk_tolerance: Optional[str] = None
    life_stage: Optional[str] = None


class FinancialProfileResponse(BaseModel):
    id: int
    user_id: int
    credit_score: Optional[int] = None
    credit_score_range: Optional[str] = None
    monthly_income: Optional[float] = None
    checking_balance: Optional[float] = None
    total_debt: Optional[float] = None
    financial_goal: Optional[str] = None
    risk_tolerance: Optional[str] = None
    life_stage: Optional[str] = None
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True

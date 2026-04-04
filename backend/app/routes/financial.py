from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..db.session import get_db
from ..schemas.financial import FinancialProfileResponse, FinancialProfileUpdate
from ..services.financial_service import get_financial_profile, upsert_financial_profile

router = APIRouter()


@router.get("/{user_id}", response_model=FinancialProfileResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = get_financial_profile(db, user_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Financial profile not found")
    return profile


@router.post("/{user_id}", response_model=FinancialProfileResponse)
def update_profile(user_id: int, data: FinancialProfileUpdate, db: Session = Depends(get_db)):
    return upsert_financial_profile(db, user_id, data)

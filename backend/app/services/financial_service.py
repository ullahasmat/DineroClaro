from sqlalchemy.orm import Session

from ..models.financial_profile import FinancialProfile
from ..schemas.financial import FinancialProfileUpdate


def get_financial_profile(db: Session, user_id: int) -> FinancialProfile | None:
    return db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()


def upsert_financial_profile(db: Session, user_id: int, data: FinancialProfileUpdate) -> FinancialProfile:
    profile = db.query(FinancialProfile).filter(FinancialProfile.user_id == user_id).first()

    if profile is None:
        profile = FinancialProfile(user_id=user_id)
        db.add(profile)

    for field, value in data.model_dump(exclude_none=True).items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile

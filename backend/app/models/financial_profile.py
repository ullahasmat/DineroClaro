from sqlalchemy import Column, Integer, String

from .base import Base


class FinancialProfile(Base):
    __tablename__ = 'financial_profiles'

    id = Column(Integer, primary_key=True, index=True)
    nickname = Column(String, nullable=True)

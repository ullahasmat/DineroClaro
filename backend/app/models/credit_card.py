from sqlalchemy import Column, Integer, String

from .base import Base


class CreditCard(Base):
    __tablename__ = 'credit_cards'

    id = Column(Integer, primary_key=True, index=True)
    last4 = Column(String, nullable=True)

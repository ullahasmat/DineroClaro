from sqlalchemy import Column, Integer, String

from .base import Base


class BankAccount(Base):
    __tablename__ = 'bank_accounts'

    id = Column(Integer, primary_key=True, index=True)
    bank_name = Column(String, nullable=True)

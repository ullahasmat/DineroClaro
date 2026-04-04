from sqlalchemy import Column, Integer, String

from .base import Base


class Investment(Base):
    __tablename__ = 'investments'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)

from sqlalchemy import Column, Integer, String

from .base import Base


class Recommendation(Base):
    __tablename__ = 'recommendations'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)

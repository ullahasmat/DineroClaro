from sqlalchemy import Column, Integer, String

from .base import Base


class Progress(Base):
    __tablename__ = 'progress'

    id = Column(Integer, primary_key=True, index=True)
    status = Column(String, nullable=True)

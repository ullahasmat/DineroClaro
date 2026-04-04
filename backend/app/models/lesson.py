from sqlalchemy import Column, Integer, String

from .base import Base


class Lesson(Base):
    __tablename__ = 'lessons'

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=True)

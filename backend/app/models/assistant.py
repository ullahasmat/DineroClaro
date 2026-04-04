from sqlalchemy import Column, Integer, String

from .base import Base


class Assistant(Base):
    __tablename__ = 'assistants'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=True)

from sqlalchemy import Column, Integer, String

from .base import Base


class Conversation(Base):
    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String, nullable=True)

from sqlalchemy import Column, Integer, String

from .base import Base


class Notification(Base):
    __tablename__ = 'notifications'

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=True)

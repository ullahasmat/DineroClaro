from sqlalchemy import Column, DateTime, Integer, String, func

from .base import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=True)
    locale = Column(String, default="en")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

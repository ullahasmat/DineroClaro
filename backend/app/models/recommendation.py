from sqlalchemy import Boolean, Column, DateTime, Integer, String, func

from .base import Base


class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=True)
    name = Column(String, nullable=False)
    provider = Column(String, nullable=True)
    description = Column(String, nullable=False)
    tags = Column(String, nullable=True)
    target_goal = Column(String, nullable=True)
    target_life_stage = Column(String, nullable=True)
    featured = Column(Boolean, default=False)


class UserRecommendation(Base):
    __tablename__ = "user_recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    recommendation_id = Column(Integer, nullable=False)
    dismissed = Column(Boolean, default=False)
    saved = Column(Boolean, default=False)
    shown_at = Column(DateTime(timezone=True), server_default=func.now())

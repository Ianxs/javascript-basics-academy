from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from backend.app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    progress = relationship("UserProgress", back_populates="user", uselist=False, cascade="all, delete-orphan")
    completed_topics = relationship("CompletedTopic", back_populates="user", cascade="all, delete-orphan")
    quiz_scores = relationship("QuizScore", back_populates="user", cascade="all, delete-orphan")
    unlocked_badges = relationship("UnlockedBadge", back_populates="user", cascade="all, delete-orphan")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    xp = Column(Integer, default=0, nullable=False)
    level = Column(Integer, default=1, nullable=False)
    streak = Column(Integer, default=1, nullable=False)
    last_active_date = Column(String(20), nullable=False)
    has_run_code = Column(Boolean, default=False, nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="progress")

class CompletedTopic(Base):
    __tablename__ = "completed_topics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(String(50), nullable=False)
    completed_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "topic_id", name="uq_user_topic"),
    )

    user = relationship("User", back_populates="completed_topics")

class QuizScore(Base):
    __tablename__ = "quiz_scores"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    quiz_id = Column(String(50), nullable=False)
    score = Column(Integer, nullable=False)  # 0 to 100 percentage
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "quiz_id", name="uq_user_quiz"),
    )

    user = relationship("User", back_populates="quiz_scores")

class UnlockedBadge(Base):
    __tablename__ = "unlocked_badges"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    badge_id = Column(String(50), nullable=False)
    unlocked_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "badge_id", name="uq_user_badge"),
    )

    user = relationship("User", back_populates="unlocked_badges")

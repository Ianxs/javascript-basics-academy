from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_current_user

router = APIRouter(prefix="/api/progress", tags=["Progress"])

def build_progress_response(current_user: models.User, db: Session) -> schemas.UserProgressRead:
    progress = db.query(models.UserProgress).filter(models.UserProgress.user_id == current_user.id).first()
    if not progress:
        progress = models.UserProgress(
            user_id=current_user.id,
            xp=0,
            level=1,
            streak=1,
            last_active_date=datetime.now().strftime("%Y-%m-%d"),
            has_run_code=False
        )
        db.add(progress)
        db.commit()
        db.refresh(progress)

    completed_topics = [
        ct.topic_id for ct in db.query(models.CompletedTopic).filter(
            models.CompletedTopic.user_id == current_user.id
        ).all()
    ]

    quiz_scores = {
        qs.quiz_id: qs.score for qs in db.query(models.QuizScore).filter(
            models.QuizScore.user_id == current_user.id
        ).all()
    }

    unlocked_badges = [
        ub.badge_id for ub in db.query(models.UnlockedBadge).filter(
            models.UnlockedBadge.user_id == current_user.id
        ).all()
    ]

    return schemas.UserProgressRead(
        xp=progress.xp,
        level=progress.level,
        streak=progress.streak,
        last_active_date=progress.last_active_date,
        has_run_code=progress.has_run_code,
        completed_topics=completed_topics,
        quiz_scores=quiz_scores,
        unlocked_badges=unlocked_badges
    )

@router.get("", response_model=schemas.UserProgressRead)
def get_progress(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return build_progress_response(current_user, db)

@router.put("", response_model=schemas.UserProgressRead)
def update_progress(
    data: schemas.UserProgressUpdate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Update Core Progress
    progress = db.query(models.UserProgress).filter(models.UserProgress.user_id == current_user.id).first()
    if not progress:
        progress = models.UserProgress(user_id=current_user.id)
        db.add(progress)

    progress.xp = data.xp
    progress.level = data.level
    progress.streak = data.streak
    progress.last_active_date = data.last_active_date
    progress.has_run_code = data.has_run_code

    # 2. Synchronize Completed Topics
    existing_topic_ids = {
        ct.topic_id for ct in db.query(models.CompletedTopic.topic_id).filter(
            models.CompletedTopic.user_id == current_user.id
        ).all()
    }
    for topic_id in data.completed_topics:
        if topic_id and topic_id not in existing_topic_ids:
            db.add(models.CompletedTopic(user_id=current_user.id, topic_id=topic_id))

    # 3. Synchronize Quiz Scores (keep higher score if already exists)
    existing_scores = {
        qs.quiz_id: qs for qs in db.query(models.QuizScore).filter(
            models.QuizScore.user_id == current_user.id
        ).all()
    }
    for quiz_id, score in data.quiz_scores.items():
        if quiz_id:
            if quiz_id in existing_scores:
                existing_scores[quiz_id].score = max(existing_scores[quiz_id].score, score)
            else:
                db.add(models.QuizScore(user_id=current_user.id, quiz_id=quiz_id, score=score))

    # 4. Synchronize Unlocked Badges
    existing_badge_ids = {
        ub.badge_id for ub in db.query(models.UnlockedBadge.badge_id).filter(
            models.UnlockedBadge.user_id == current_user.id
        ).all()
    }
    for badge_id in data.unlocked_badges:
        if badge_id and badge_id not in existing_badge_ids:
            db.add(models.UnlockedBadge(user_id=current_user.id, badge_id=badge_id))

    db.commit()
    return build_progress_response(current_user, db)

@router.post("/reset", response_model=schemas.UserProgressRead)
def reset_progress(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = datetime.now().strftime("%Y-%m-%d")

    # Reset Core Progress
    progress = db.query(models.UserProgress).filter(models.UserProgress.user_id == current_user.id).first()
    if progress:
        progress.xp = 0
        progress.level = 1
        progress.streak = 1
        progress.last_active_date = today
        progress.has_run_code = False

    # Delete relational rows for this user
    db.query(models.CompletedTopic).filter(models.CompletedTopic.user_id == current_user.id).delete()
    db.query(models.QuizScore).filter(models.QuizScore.user_id == current_user.id).delete()
    db.query(models.UnlockedBadge).filter(models.UnlockedBadge.user_id == current_user.id).delete()

    db.commit()
    return build_progress_response(current_user, db)

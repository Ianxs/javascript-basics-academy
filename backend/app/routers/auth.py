from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app import models, schemas
from backend.app.auth import get_password_hash, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.Token, status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    email_clean = user_data.email.strip().lower()
    existing_user = db.query(models.User).filter(models.User.email == email_clean).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Create User
    new_user = models.User(
        email=email_clean,
        password_hash=get_password_hash(user_data.password)
    )
    db.add(new_user)
    db.flush()

    # Create Initial Progress Record
    initial_progress = models.UserProgress(
        user_id=new_user.id,
        xp=0,
        level=1,
        streak=1,
        last_active_date=datetime.now().strftime("%Y-%m-%d"),
        has_run_code=False
    )
    db.add(initial_progress)
    db.commit()
    db.refresh(new_user)

    # Generate Token
    access_token = create_access_token(data={"sub": str(new_user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    email_clean = credentials.email.strip().lower()
    user = db.query(models.User).filter(models.User.email == email_clean).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    access_token = create_access_token(data={"sub": str(user.id)})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user

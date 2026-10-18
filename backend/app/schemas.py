from datetime import datetime
from typing import List, Dict, Optional
from pydantic import BaseModel, EmailStr, Field

# Authentication Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Progress Schemas
class UserProgressRead(BaseModel):
    xp: int = 0
    level: int = 1
    streak: int = 1
    last_active_date: str
    has_run_code: bool = False
    completed_topics: List[str] = []
    quiz_scores: Dict[str, int] = {}
    unlocked_badges: List[str] = []

    class Config:
        from_attributes = True

class UserProgressUpdate(BaseModel):
    xp: int = Field(default=0, ge=0)
    level: int = Field(default=1, ge=1)
    streak: int = Field(default=1, ge=1)
    last_active_date: str
    has_run_code: bool = False
    completed_topics: List[str] = []
    quiz_scores: Dict[str, int] = {}
    unlocked_badges: List[str] = []

class MessageResponse(BaseModel):
    message: str

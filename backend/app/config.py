import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings

# Absolute path to backend directory and .env file
BACKEND_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BACKEND_DIR / ".env"

class Settings(BaseSettings):
    PROJECT_NAME: str = "JS Basics Academy API"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/js_basics_academy"
    SECRET_KEY: str = "supersecret_local_dev_key_change_in_production_12345"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    CORS_ORIGINS: List[str] = [
        "http://localhost",
        "http://127.0.0.1",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5500",
        "http://127.0.0.1:5500",
        "http://localhost:3000",
        "http://localhost:8080",
    ]

    class Config:
        env_file = str(ENV_PATH)
        env_file_encoding = "utf-8"
        extra = "ignore"

settings = Settings()

@echo off
title JS Basics Academy - Backend Server
echo ========================================================
echo  Starting FastAPI Backend (PostgreSQL + JWT Auth)
echo  API URL: http://127.0.0.1:8000
echo  Interactive Docs: http://127.0.0.1:8000/docs
echo ========================================================
cd /d "%~dp0"
.\backend\venv\Scripts\python.exe -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
pause

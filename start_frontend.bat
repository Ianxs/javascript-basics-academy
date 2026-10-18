@echo off
title JS Basics Academy - Frontend Server
echo ========================================================
echo  Starting Frontend Web Server (ES Modules)
echo  Website URL: http://localhost:8080
echo ========================================================
cd /d "%~dp0"
python -m http.server 8080
pause

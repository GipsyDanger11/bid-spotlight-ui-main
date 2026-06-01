@echo off
title BidLux Development Environment
echo ========================================
echo   BidLux Development Environment
echo ========================================
echo.

setlocal enabledelayedexpansion

REM Load environment variables from .env if it exists
if exist .env (
    echo Loading variables from .env...
    for /f "usebackq tokens=*" %%i in (".env") do (
        set "line=%%i"
        if "!line:~0,1!" neq "#" (
            set "%%i"
        )
    )
)

echo.
echo [1] Start with H2 Database (Recommended)
echo [2] Start with MySQL Database
echo.
set /p choice="Select database option [1]: "

if "%choice%"=="2" (
    set DB_TYPE=mysql
    echo.
    set /p DB_USERNAME="MySQL Username [root]: "
    set /p DB_PASSWORD="MySQL Password []: "
) else (
    set DB_TYPE=h2
)

echo.
echo Starting Backend (Spring Boot)...
cd backend\demo
start "Backend Server" cmd /c "set DB_TYPE=%DB_TYPE%&& set DB_USERNAME=%DB_USERNAME%&& set DB_PASSWORD=%DB_PASSWORD%&& set RAZORPAY_KEY_ID=%RAZORPAY_KEY_ID%&& set RAZORPAY_KEY_SECRET=%RAZORPAY_KEY_SECRET%&& mvnw.cmd spring-boot:run || pause"

echo.
echo Waiting for backend to initialize (15 seconds)...
timeout /t 15 /nobreak > nul

echo.
echo Starting Frontend (React)...
cd ..\..
start "Frontend Server" cmd /c "npm run dev || pause"

echo.
echo ========================================
echo   Servers are starting!
echo ========================================
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:5173
echo Swagger:  http://localhost:8080/swagger-ui/index.html
echo.
echo You can close this window. To stop the servers, 
echo close the individual Backend and Frontend windows.
echo ========================================
pause

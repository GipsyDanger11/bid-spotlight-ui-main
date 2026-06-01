@echo off
title BidLux Development Environment
echo ========================================
echo   BidLux Development Environment
echo ========================================
echo.

REM Set default database environment variables
set DB_TYPE=h2
set DB_URL=jdbc:mysql://localhost:3306/bidlux?createDatabaseIfNotExist=true^&allowPublicKeyRetrieval=true^&useSSL=false^&serverTimezone=UTC
set DB_USERNAME=root
set DB_PASSWORD=

echo [1] Start with H2 Database (Recommended - No setup required)
echo [2] Start with MySQL Database (Requires local MySQL)
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
echo Using %DB_TYPE% database...
echo.

REM Check if PowerShell is available and use it for better process management
powershell -Command "Write-Host 'Using PowerShell for process management...' -ForegroundColor Green" >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting BidLux with PowerShell...
    powershell -ExecutionPolicy Bypass -Command "& { if (Test-Path .env) { Get-Content .env | Foreach-Object { if ($_ -match '^(?<name>[^#\s=]+)=(?<value>.*)$') { $name = $Matches['name'].Trim(); $value = $Matches['value'].Trim(); if ($name) { [System.Environment]::SetEnvironmentVariable($name, $value, 'Process'); Write-Host \"Loaded from .env: $name\" -ForegroundColor Gray } } } }; $env:DB_TYPE = if ('%DB_TYPE%') { '%DB_TYPE%' } else { $env:DB_TYPE }; if (!$env:DB_TYPE) { $env:DB_TYPE = 'h2' }; $env:DB_URL = if ('%DB_URL%') { '%DB_URL%' } else { $env:DB_URL }; $env:DB_USERNAME = if ('%DB_USERNAME%') { '%DB_USERNAME%' } else { $env:DB_USERNAME }; $env:DB_PASSWORD = if ('%DB_PASSWORD%') { '%DB_PASSWORD%' } else { $env:DB_PASSWORD }; Write-Host \"Final Config - DB: $env:DB_TYPE, Razorpay Key: $($env:RAZORPAY_KEY_ID -replace '^(.{4}).*$', '$1****')\" -ForegroundColor Yellow; Write-Host 'Starting Backend (Spring Boot)...' -ForegroundColor Green; $backend = Start-Process -FilePath 'cmd' -ArgumentList '/c', 'cd backend\demo && mvnw.cmd spring-boot:run' -PassThru -WindowStyle Minimized; Write-Host 'Backend starting... (PID: $($backend.Id))' -ForegroundColor Green; Write-Host 'Waiting for backend to be ready...' -ForegroundColor Yellow; $ready = $false; for ($i=0; $i -lt 30; $i++) { try { $response = Invoke-WebRequest -Uri 'http://localhost:8080/api/auctions/active' -UseBasicParsing -ErrorAction SilentlyContinue; if ($response.StatusCode -eq 200) { $ready = $true; break } } catch {} Start-Sleep -Seconds 2 }; if ($ready) { Write-Host 'Backend is READY!' -ForegroundColor Green; Write-Host 'Starting Frontend (React)...' -ForegroundColor Green; $frontend = Start-Process -FilePath 'cmd' -ArgumentList '/c', 'npm run dev' -PassThru -WindowStyle Minimized; Write-Host 'Frontend starting... (PID: $($frontend.Id))' -ForegroundColor Green; Write-Host ''; Write-Host 'Both servers are running!' -ForegroundColor Green; Write-Host 'Backend:  http://localhost:8080' -ForegroundColor Cyan; if ($env:DB_TYPE -eq 'h2') { Write-Host 'H2 Console: http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:bidlux, User: sa, Pass: [empty])' -ForegroundColor Gray }; Write-Host 'Frontend: http://localhost:5173' -ForegroundColor Cyan; Write-Host ''; Write-Host 'Press Ctrl+C to stop all servers and exit...' -ForegroundColor Yellow; try { while ($true) { Start-Sleep -Seconds 1 } } finally { Write-Host 'Stopping servers...' -ForegroundColor Yellow; Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue; Get-Process -Name 'node' -ErrorAction SilentlyContinue | Stop-Process -Force; Write-Host 'All servers stopped.' -ForegroundColor Green } } else { Write-Host 'Backend failed to start or is taking too long. Check the minimized backend window for errors.' -ForegroundColor Red; Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue; pause } }"
    goto :end
)

echo PowerShell not available, using basic batch method...
echo Starting Backend (Spring Boot)...
cd backend\demo
start "Backend Server" /MIN cmd /c "set DB_TYPE=%DB_TYPE% && set DB_URL=%DB_URL% && set DB_USERNAME=%DB_USERNAME% && set DB_PASSWORD=%DB_PASSWORD% && mvnw.cmd spring-boot:run && pause"

echo Waiting for backend to start (30 seconds)...
timeout /t 30 /nobreak > nul

echo Starting Frontend (React)...
cd ..\..
start "Frontend Server" /MIN cmd /c "npm run dev && pause"

echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
pause

:end
echo.
echo Goodbye!
pause

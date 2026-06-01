@echo off
echo Starting BidLux Development Environment...
echo.

REM Check if PowerShell is available
powershell -Command "Write-Host 'PowerShell is available' -ForegroundColor Green" >nul 2>&1
if %errorlevel% neq 0 (
    echo PowerShell is not available. Using basic batch method...
    goto :basic_method
)

echo Using PowerShell for better process management...
powershell -ExecutionPolicy Bypass -File "start-dev-advanced.ps1"
goto :end

:basic_method
echo Using basic batch method...
echo.
echo Starting Backend (Spring Boot)...
cd backend\demo
start "Backend Server" /MIN cmd /c "mvnw.cmd spring-boot:run && pause"

echo.
echo Waiting for backend to start...
timeout /t 15 /nobreak > nul

echo.
echo Starting Frontend (React)...
cd ..\..
start "Frontend Server" /MIN cmd /c "npm run dev && pause"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8080
echo Frontend: http://localhost:5173
echo H2 Console: http://localhost:8080/h2-console
echo.
echo Press any key to stop all servers and exit...
pause > nul

echo.
echo Stopping servers...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM node.exe 2>nul
echo Servers stopped.

:end
echo.
echo Goodbye!
pause

@echo off
echo Stopping BidLux Development Environment...

echo.
echo Stopping all servers...
taskkill /F /IM java.exe 2>nul
taskkill /F /IM node.exe 2>nul
taskkill /F /IM mvnw.exe 2>nul

echo.
echo Checking for remaining processes...
for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq java.exe" /FO CSV ^| find /C "java.exe"') do (
    if %%i gtr 0 (
        echo Found %%i Java processes, killing them...
        taskkill /F /IM java.exe
    )
)

for /f "tokens=2" %%i in ('tasklist /FI "IMAGENAME eq node.exe" /FO CSV ^| find /C "node.exe"') do (
    if %%i gtr 0 (
        echo Found %%i Node processes, killing them...
        taskkill /F /IM node.exe
    )
)

echo.
echo All servers stopped.
pause

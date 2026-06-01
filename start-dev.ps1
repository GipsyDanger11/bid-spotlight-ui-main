# BidLux Development Environment Starter
Write-Host "Starting BidLux Development Environment..." -ForegroundColor Green

# Array to store process IDs
$processes = @()

try {
    # Set default database environment variables for development
    $env:DB_URL = "jdbc:mysql://localhost:3306/bidlux?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC"
    $env:DB_USERNAME = "me"
    $env:DB_PASSWORD = "noob13"
    Write-Host "`nStarting Backend (Spring Boot)..." -ForegroundColor Yellow
    $backendProcess = Start-Process -FilePath "mvnw.cmd" -ArgumentList "spring-boot:run" -WorkingDirectory "backend\demo" -PassThru -WindowStyle Hidden
    $processes += $backendProcess
    Write-Host "Backend started with PID: $($backendProcess.Id)" -ForegroundColor Green

    Write-Host "`nWaiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15

    Write-Host "`nStarting Frontend (React)..." -ForegroundColor Yellow
    $frontendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
    $processes += $frontendProcess
    Write-Host "Frontend started with PID: $($frontendProcess.Id)" -ForegroundColor Green

    Write-Host "`nBoth servers are running!" -ForegroundColor Green
    Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "Database: MySQL (configure DB_URL/DB_USERNAME/DB_PASSWORD)" -ForegroundColor Cyan
    Write-Host "`nPress Ctrl+C to stop all servers and exit..." -ForegroundColor Yellow

    # Keep the script running and wait for Ctrl+C
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if processes are still running
        $runningProcesses = $processes | Where-Object { !$_.HasExited }
        if ($runningProcesses.Count -eq 0) {
            Write-Host "`nAll processes have stopped." -ForegroundColor Red
            break
        }
    }
}
catch {
    Write-Host "`nError occurred: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Write-Host "`nStopping servers..." -ForegroundColor Yellow
    
    # Kill all tracked processes
    foreach ($process in $processes) {
        if (!$process.HasExited) {
            try {
                $process.Kill()
                Write-Host "Stopped process PID: $($process.Id)" -ForegroundColor Green
            }
            catch {
                Write-Host "Could not stop process PID: $($process.Id)" -ForegroundColor Red
            }
        }
    }
    
    # Also kill any remaining Java and Node processes (fallback)
    try {
        Get-Process -Name "java" -ErrorAction SilentlyContinue | Stop-Process -Force
        Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
        Write-Host "Cleaned up remaining processes" -ForegroundColor Green
    }
    catch {
        Write-Host "No remaining processes to clean up" -ForegroundColor Yellow
    }
    
    Write-Host "Servers stopped. Goodbye!" -ForegroundColor Green
}

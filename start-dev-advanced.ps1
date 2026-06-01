# BidLux Development Environment Starter with Proper Process Management
param(
    [switch]$UsePowerShell
)

Write-Host "Starting BidLux Development Environment..." -ForegroundColor Green

# Function to cleanup processes
function Stop-AllServers {
    Write-Host "`nStopping all servers..." -ForegroundColor Yellow
    
    # Kill Java processes (Spring Boot)
    $javaProcesses = Get-Process -Name "java" -ErrorAction SilentlyContinue
    if ($javaProcesses) {
        $javaProcesses | Stop-Process -Force
        Write-Host "Stopped Java processes (Backend)" -ForegroundColor Green
    }
    
    # Kill Node processes (React)
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        $nodeProcesses | Stop-Process -Force
        Write-Host "Stopped Node processes (Frontend)" -ForegroundColor Green
    }
    
    # Kill any Maven processes
    $mavenProcesses = Get-Process -Name "mvnw" -ErrorAction SilentlyContinue
    if ($mavenProcesses) {
        $mavenProcesses | Stop-Process -Force
        Write-Host "Stopped Maven processes" -ForegroundColor Green
    }
    
    Write-Host "All servers stopped." -ForegroundColor Green
}

# Set up cleanup on script exit
$null = Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action {
    Stop-AllServers
}

# Set up cleanup on Ctrl+C
$null = Register-EngineEvent -SourceIdentifier System.Management.Automation.PowerShell.Exiting -Action {
    Stop-AllServers
}

try {
    Write-Host "`nStarting Backend (Spring Boot)..." -ForegroundColor Yellow
    
    if ($UsePowerShell) {
        # Use PowerShell to start backend
        $backendJob = Start-Job -ScriptBlock {
            Set-Location "backend\demo"
            & ".\mvnw.cmd" spring-boot:run
        }
        Write-Host "Backend started as job ID: $($backendJob.Id)" -ForegroundColor Green
    } else {
        # Use cmd to start backend
        Start-Process -FilePath "cmd" -ArgumentList "/c", "cd backend\demo && mvnw.cmd spring-boot:run" -WindowStyle Minimized
        Write-Host "Backend started in minimized window" -ForegroundColor Green
    }

    Write-Host "`nWaiting for backend to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15

    Write-Host "`nStarting Frontend (React)..." -ForegroundColor Yellow
    
    if ($UsePowerShell) {
        # Use PowerShell to start frontend
        $frontendJob = Start-Job -ScriptBlock {
            & "npm" run dev
        }
        Write-Host "Frontend started as job ID: $($frontendJob.Id)" -ForegroundColor Green
    } else {
        # Use cmd to start frontend
        Start-Process -FilePath "cmd" -ArgumentList "/c", "npm run dev" -WindowStyle Minimized
        Write-Host "Frontend started in minimized window" -ForegroundColor Green
    }

    Write-Host "`nBoth servers are running!" -ForegroundColor Green
    Write-Host "Backend: http://localhost:8080" -ForegroundColor Cyan
    Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "H2 Console: http://localhost:8080/h2-console" -ForegroundColor Cyan
    Write-Host "`nPress Ctrl+C to stop all servers and exit..." -ForegroundColor Yellow

    # Keep the script running
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if we should exit
        if ([Console]::KeyAvailable) {
            $key = [Console]::ReadKey($true)
            if ($key.Key -eq [ConsoleKey]::C -and $key.Modifiers -eq [ConsoleModifiers]::Control) {
                break
            }
        }
    }
}
catch {
    Write-Host "`nError occurred: $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Stop-AllServers
    Write-Host "`nGoodbye!" -ForegroundColor Green
}

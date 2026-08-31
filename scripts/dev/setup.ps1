# ==============================================================================
# Koupreng Project - Windows Setup Script (PowerShell)
# Author: Nha & Antigravity
# Environment: Windows 10/11
# ==============================================================================

$ErrorActionPreference = "Stop"
$RootDir = (Get-Item "$PSScriptRoot\..\..").FullName
Set-Location $RootDir

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Koupreng - FULL STACK WINDOWS SETUP" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan

# 1. Check Prerequisites
Write-Host "`n[1/5] Checking System Tools..." -ForegroundColor White
try { $javaVer = & java -version 2>&1 | Select-Object -First 1; Write-Host "  Java: $javaVer" -ForegroundColor Green }
catch { Write-Host "  X Java not found. Please install OpenJDK 25." -ForegroundColor Red; exit 1 }

try { $nodeVer = & node -v; Write-Host "  Node: $nodeVer" -ForegroundColor Green }
catch { Write-Host "  X Node.js not found. Please install Node 20+." -ForegroundColor Red; exit 1 }

try { $npmVer = & npm -v; Write-Host "  npm:  $npmVer" -ForegroundColor Green }
catch { Write-Host "  X npm not found." -ForegroundColor Red; exit 1 }

# 2. Setup .env
Write-Host "`n[2/5] Configuring Environment (.env)..." -ForegroundColor White
if (-not (Test-Path "$RootDir\.env")) {
    Copy-Item "$RootDir\.env.example" "$RootDir\.env"
    (Get-Content "$RootDir\.env") -replace 'DB_PASSWORD=change_me', 'DB_PASSWORD=123456' | Set-Content "$RootDir\.env"
    Write-Host "  Created .env with default DB_PASSWORD=123456" -ForegroundColor Green
} else {
    Write-Host "  .env file already exists" -ForegroundColor Green
}

# 3. Check MySQL / MariaDB Service
Write-Host "`n[3/5] Checking MySQL / MariaDB Service..." -ForegroundColor White
$mysqlService = Get-Service -Name "MySQL*", "MariaDB*" -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq "Running" }
if ($mysqlService) {
    Write-Host "  Database service is running: $($mysqlService.DisplayName)" -ForegroundColor Green
} else {
    Write-Host "  WARNING: No MySQL/MariaDB service detected." -ForegroundColor Yellow
    Write-Host "  Please start MySQL manually or via XAMPP/Laragon." -ForegroundColor Yellow
}

# 4. Install Frontend User Dependencies
Write-Host "`n[4/5] Installing Frontend User Dependencies..." -ForegroundColor White
Push-Location "$RootDir\apps\frontend-user"
& npm install
Write-Host "  apps/frontend-user packages installed" -ForegroundColor Green
Pop-Location

# 5. Install Frontend Admin Dependencies
Write-Host "`n[5/5] Installing Frontend Admin Dependencies..." -ForegroundColor White
Push-Location "$RootDir\apps\frontend-admin"
& npm install
Write-Host "  apps/frontend-admin packages installed" -ForegroundColor Green
Pop-Location

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host "   SETUP COMPLETED SUCCESSFULLY FOR WINDOWS!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "To start all dev servers, run:" -ForegroundColor White
Write-Host "  .\scripts\dev\dev.ps1`n" -ForegroundColor Cyan

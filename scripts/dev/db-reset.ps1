# ==============================================================================
# Koupreng Project - Windows Database Reset (PowerShell)
# Author: Nha & Antigravity
# ==============================================================================

$ErrorActionPreference = "Stop"
$RootDir = (Get-Item "$PSScriptRoot\..\..").FullName

# Load DB password from .env
$dbPass = "123456"
if (Test-Path "$RootDir\.env") {
    $envLine = Get-Content "$RootDir\.env" | Where-Object { $_ -match '^DB_PASSWORD=' }
    if ($envLine) { $dbPass = ($envLine -split '=', 2)[1].Trim() }
}

Write-Host "Resetting MariaDB database 'koupreng_db'..." -ForegroundColor Yellow

try {
    & mysql -u root -p"$dbPass" -e "DROP DATABASE IF EXISTS koupreng_db; CREATE DATABASE koupreng_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
    Write-Host "Database 'koupreng_db' reset. Flyway migrations will run on next Backend start." -ForegroundColor Green
} catch {
    Write-Host "Failed to reset database. Make sure MySQL/MariaDB is running." -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

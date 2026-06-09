#!/usr/bin/env pwsh
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Message
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $PSCommandPath
Set-Location $ScriptDir

if ([string]::IsNullOrWhiteSpace($Message)) {
    $Message = Read-Host "Commit message"
}

if ([string]::IsNullOrWhiteSpace($Message)) {
    Write-Host ""
    Write-Host "Commit message cannot be empty. Usage: .\git-sync.ps1 ""update invitation flow""" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Safe Team Git Sync"
Write-Host "Step 1: pull latest origin/main"
& (Join-Path $ScriptDir "git-pull.ps1")
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

Write-Host ""
Write-Host "Step 2: commit and push to origin/main"
& (Join-Path $ScriptDir "git-push.ps1") $Message
if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
}

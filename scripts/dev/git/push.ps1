# ==============================================================================
# Koupreng - Safe Git Push (Windows PowerShell)
# Steps: stash → pull → pop stash → add → commit → push
# Revert: git reset --soft HEAD~1
# ==============================================================================

param (
    [string]$Message = "update: changes from $($env:COMPUTERNAME) at $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
)

$ErrorActionPreference = "Stop"
$Branch = & git branch --show-current

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Koupreng - SAFE GIT PUSH" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Branch: $Branch" -ForegroundColor Green
Write-Host "  Message: $Message" -ForegroundColor Cyan

# Step 1: Stash
Write-Host "`n[1/5] Stashing local changes..." -ForegroundColor White
$stashOutput = & git stash push -m "auto-stash-before-push" 2>&1
$stashed = $stashOutput -match "Saved working directory"
if ($stashed) { Write-Host "  Stashed" -ForegroundColor Green }
else { Write-Host "  No changes to stash" -ForegroundColor Cyan }

# Step 2: Pull
Write-Host "`n[2/5] Pulling latest from remote..." -ForegroundColor White
try {
    & git pull --rebase origin $Branch
    Write-Host "  Pull OK" -ForegroundColor Green
} catch {
    Write-Host "  Pull conflict! Fix manually:" -ForegroundColor Red
    Write-Host "    git rebase --abort" -ForegroundColor Yellow
    exit 1
}

# Step 3: Pop stash
Write-Host "`n[3/5] Restoring local changes..." -ForegroundColor White
if ($stashed) {
    & git stash pop
    Write-Host "  Restored" -ForegroundColor Green
} else {
    Write-Host "  Nothing to restore" -ForegroundColor Cyan
}

# Step 4: Add + Commit
Write-Host "`n[4/5] Adding & Committing..." -ForegroundColor White
& git add -A
$diff = & git diff --cached --quiet 2>&1; $hasChanges = $LASTEXITCODE -ne 0
if (-not $hasChanges) {
    Write-Host "  Nothing to commit" -ForegroundColor Cyan
    Write-Host "`nDone! Everything synced." -ForegroundColor Green
    exit 0
}
& git commit -m $Message
Write-Host "  Committed" -ForegroundColor Green

# Step 5: Push
Write-Host "`n[5/5] Pushing to remote..." -ForegroundColor White
& git push origin $Branch
Write-Host "  Pushed to origin/$Branch" -ForegroundColor Green

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host "   PUSH COMPLETED!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  To undo:" -ForegroundColor Yellow
Write-Host "    git reset --soft HEAD~1" -ForegroundColor Cyan
Write-Host "    git push --force-with-lease origin $Branch" -ForegroundColor Cyan
Write-Host "======================================================`n"

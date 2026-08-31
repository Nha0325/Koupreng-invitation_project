# ==============================================================================
# Koupreng - Safe Git Pull (Windows PowerShell)
# Steps: stash → pull --rebase → pop stash
# Revert: git reset --hard ORIG_HEAD
# ==============================================================================

$ErrorActionPreference = "Stop"
$Branch = & git branch --show-current

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Koupreng - SAFE GIT PULL" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Branch: $Branch" -ForegroundColor Green

# Step 1: Stash
Write-Host "`n[1/3] Stashing local changes..." -ForegroundColor White
$stashOutput = & git stash push -m "auto-stash-before-pull" 2>&1
$stashed = $stashOutput -match "Saved working directory"
if ($stashed) { Write-Host "  Stashed" -ForegroundColor Green }
else { Write-Host "  No local changes" -ForegroundColor Cyan }

# Step 2: Pull
Write-Host "`n[2/3] Pulling latest from origin/$Branch..." -ForegroundColor White
try {
    & git pull --rebase origin $Branch
    Write-Host "  Pull OK" -ForegroundColor Green
} catch {
    Write-Host "  Conflict! Fix manually or: git rebase --abort" -ForegroundColor Red
    exit 1
}

# Step 3: Pop stash
Write-Host "`n[3/3] Restoring local changes..." -ForegroundColor White
if ($stashed) {
    try {
        & git stash pop
        Write-Host "  Restored" -ForegroundColor Green
    } catch {
        Write-Host "  Stash conflict! Check: git stash list" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "  Nothing to restore" -ForegroundColor Cyan
}

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host "   PULL COMPLETED!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  To undo:" -ForegroundColor Yellow
Write-Host "    git reset --hard ORIG_HEAD" -ForegroundColor Cyan
Write-Host "======================================================`n"

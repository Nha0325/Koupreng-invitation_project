# ==============================================================================
# Koupreng - Undo Last Git Push (Windows PowerShell)
# Reverts the last commit locally + force-updates remote
# ==============================================================================

$ErrorActionPreference = "Stop"
$Branch = & git branch --show-current
$LastCommit = & git log -1 --oneline

Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "   Koupreng - UNDO LAST PUSH" -ForegroundColor Red
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Branch: $Branch" -ForegroundColor Green
Write-Host "  Last commit: $LastCommit" -ForegroundColor Yellow
Write-Host ""

$confirm = Read-Host "តើចង់ undo commit នេះមែនទេ? [y/N]"
if ($confirm -ne "y" -and $confirm -ne "Y") {
    Write-Host "  Cancelled." -ForegroundColor Cyan
    exit 0
}

# Step 1: Undo commit (keep code)
Write-Host "`n[1/2] Undoing last commit (keeping your code)..." -ForegroundColor White
& git reset --soft HEAD~1
Write-Host "  Commit undone - code still in staging" -ForegroundColor Green

# Step 2: Force update remote
Write-Host ""
$force = Read-Host "ចង់ update remote ដែរទេ? (force push) [y/N]"
if ($force -eq "y" -or $force -eq "Y") {
    Write-Host "`n[2/2] Force-updating remote..." -ForegroundColor White
    & git push --force-with-lease origin $Branch
    Write-Host "  Remote updated - push undone completely" -ForegroundColor Green
} else {
    Write-Host "  Remote untouched. Only local commit undone." -ForegroundColor Cyan
}

Write-Host "`n======================================================" -ForegroundColor Green
Write-Host "   UNDO COMPLETED!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "  Your code changes are safe in staging." -ForegroundColor Cyan
Write-Host "  Run 'git status' to see them." -ForegroundColor Cyan
Write-Host "======================================================`n"

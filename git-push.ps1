#!/usr/bin/env pwsh
[CmdletBinding()]
param(
    [Parameter(Position = 0)]
    [string]$Message
)

$ErrorActionPreference = "Stop"

function Stop-Script {
    param([string]$Text)

    Write-Host ""
    Write-Host "[ERROR] $Text" -ForegroundColor Red
    exit 1
}

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)

    & git @GitArgs
    if ($LASTEXITCODE -ne 0) {
        Stop-Script "git $($GitArgs -join ' ') failed."
    }
}

function Get-GitOutput {
    param([Parameter(ValueFromRemainingArguments = $true)][string[]]$GitArgs)

    $output = & git @GitArgs 2>$null
    if ($LASTEXITCODE -ne 0) {
        return $null
    }

    return $output
}

function Test-LocalChanges {
    $status = & git status --porcelain
    if ($LASTEXITCODE -ne 0) {
        Stop-Script "Could not read git status."
    }

    return -not [string]::IsNullOrWhiteSpace(($status -join "`n"))
}

function Test-GitPathExists {
    param([string]$PathName)

    $path = Get-GitOutput rev-parse --git-path $PathName
    return ($path -and (Test-Path $path))
}

function Write-ConflictHelp {
    param(
        [string]$Context,
        [ValidateSet("None", "Waiting", "Apply")]
        [string]$AutoStashState = "None"
    )

    Write-Host ""
    Write-Host "[CONFLICT] $Context" -ForegroundColor Yellow
    Write-Host "No commit or push was made."
    Write-Host ""
    Write-Host "Fix the files shown by:"
    Write-Host "    git status"
    Write-Host ""
    Write-Host "After fixing each conflict, stage the files:"
    Write-Host "    git add <files>"
    Write-Host ""
    Write-Host "If Git says a rebase is running, continue it with:"
    Write-Host "    git rebase --continue"
    Write-Host ""

    if ($AutoStashState -eq "Waiting") {
        Write-Host "Your uncommitted code is still saved in the auto-stash because the pull stopped first."
        Write-Host "After the rebase is complete, restore it with:"
        Write-Host "    git stash apply stash@{0}"
        Write-Host "Then remove that backup stash after you verify your files:"
        Write-Host "    git stash drop stash@{0}"
    }
    elseif ($AutoStashState -eq "Apply") {
        Write-Host "The auto-stash was applied with conflicts, and Git kept the stash as a backup."
        Write-Host "After you resolve and commit the files, remove that backup stash with:"
        Write-Host "    git stash drop stash@{0}"
    }
}

Write-Host ""
Write-Host "========================================"
Write-Host "  Safe Team Git Push"
Write-Host "========================================"
Write-Host ""

& git rev-parse --is-inside-work-tree *> $null
if ($LASTEXITCODE -ne 0) {
    Stop-Script "Not a git repository."
}

if ((Test-GitPathExists "rebase-merge") -or (Test-GitPathExists "rebase-apply")) {
    Stop-Script "A rebase is already in progress. Finish it with 'git rebase --continue' or cancel with 'git rebase --abort'."
}

if (Test-GitPathExists "MERGE_HEAD") {
    Stop-Script "A merge is already in progress. Finish the merge before running this script."
}

$branch = Get-GitOutput branch --show-current
if ([string]::IsNullOrWhiteSpace($branch)) {
    Stop-Script "You are in detached HEAD mode. Checkout a branch before pushing."
}
$branch = $branch.Trim()

Write-Host "Current branch: $branch"
Write-Host ""
Write-Host "--- Local changes before sync ---"
& git status --short
Write-Host ""

Write-Host "[1/5] Checking GitHub for new code..."
Invoke-Git fetch origin --prune

$upstream = Get-GitOutput rev-parse --abbrev-ref --symbolic-full-name "@{u}"
if ([string]::IsNullOrWhiteSpace(($upstream -join ""))) {
    & git ls-remote --exit-code --heads origin $branch *> $null
    if ($LASTEXITCODE -eq 0) {
        $upstream = "origin/$branch"
    }
    else {
        $upstream = $null
    }
}
else {
    $upstream = ($upstream -join "").Trim()
}

$needPull = $false
if ($upstream) {
    $localHead = (Get-GitOutput rev-parse HEAD) -join ""
    $remoteHead = (Get-GitOutput rev-parse $upstream) -join ""
    $baseHead = (Get-GitOutput merge-base HEAD $upstream) -join ""

    if ($localHead -eq $remoteHead) {
        Write-Host "Remote branch is already synced with local commits."
    }
    elseif ($localHead -eq $baseHead) {
        Write-Host "GitHub has new commits. They will be pulled before your commit."
        $needPull = $true
    }
    elseif ($remoteHead -eq $baseHead) {
        Write-Host "Your branch is ahead of GitHub. No pull needed."
    }
    else {
        Write-Host "Local and GitHub both have new commits. Rebase will replay your commits on top of GitHub."
        $needPull = $true
    }
}
else {
    Write-Host "No upstream branch found yet. This looks like a new branch; push will set upstream."
}

$stashCreated = $false
$stashRef = $null
if ((Test-LocalChanges) -and $needPull) {
    Write-Host ""
    Write-Host "[2/5] Saving your uncommitted code in a temporary stash..."
    $stashMessage = "safe-push auto-stash before pulling $branch $(Get-Date -Format s)"
    Invoke-Git stash push --include-untracked -m $stashMessage
    $stashCreated = $true
    $stashRef = "stash@{0}"
}
else {
    Write-Host ""
    Write-Host "[2/5] No temporary stash needed."
}

if ($needPull) {
    Write-Host ""
    Write-Host "[3/5] Pulling collaborator code safely with rebase..."
    & git pull --rebase origin $branch
    if ($LASTEXITCODE -ne 0) {
        $autoStashState = if ($stashCreated) { "Waiting" } else { "None" }
        Write-ConflictHelp "Pull stopped because the remote code and local commits touched the same lines." $autoStashState
        exit 1
    }
}
else {
    Write-Host ""
    Write-Host "[3/5] No new remote code to pull."
}

if ($stashCreated) {
    Write-Host ""
    Write-Host "Restoring your uncommitted code from the temporary stash..."
    & git stash apply $stashRef
    if ($LASTEXITCODE -ne 0) {
        Write-ConflictHelp "Your saved local edits conflicted with the latest collaborator code." "Apply"
        exit 1
    }
    Invoke-Git stash drop $stashRef
}

Write-Host ""
Write-Host "[4/5] Creating commit if there are local changes..."
if (Test-LocalChanges) {
    if ([string]::IsNullOrWhiteSpace($Message)) {
        $Message = Read-Host "Commit message"
    }

    if ([string]::IsNullOrWhiteSpace($Message)) {
        Stop-Script "Commit message cannot be empty."
    }

    Invoke-Git add -A
    Invoke-Git commit -m $Message
}
else {
    Write-Host "No local file changes to commit."
}

Write-Host ""
Write-Host "[5/5] Pushing to GitHub..."
& git push origin $branch
if ($LASTEXITCODE -ne 0) {
    Write-Host "Normal push failed. Trying to set upstream for this branch..."
    Invoke-Git push -u origin $branch
}

Write-Host ""
Write-Host "========================================"
Write-Host "  Done. Synced and pushed to origin/$branch"
Write-Host "========================================"

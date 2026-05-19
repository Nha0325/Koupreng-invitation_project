@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

REM ============================================
REM  Team Git Pull Helper (Windows)
REM  Flow: stash (if dirty) -> pull -> stash pop
REM ============================================

echo.
echo ========================================
echo   Git Pull Helper (Team)
echo ========================================
echo.

REM --- Must be inside a git repo ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not a git repository.
    pause
    exit /b 1
)

REM --- Refuse to run during an in-progress merge/rebase ---
git rev-parse --verify -q MERGE_HEAD >nul 2>&1
if not errorlevel 1 (
    echo [ERROR] A merge is already in progress.
    echo Resolve conflicts, run "git commit", or run "git merge --abort" first.
    pause
    exit /b 1
)
if exist ".git\rebase-merge" (
    echo [ERROR] A rebase is already in progress.
    echo Run "git rebase --continue" or "git rebase --abort" first.
    pause
    exit /b 1
)
if exist ".git\rebase-apply" (
    echo [ERROR] A rebase is already in progress.
    echo Run "git rebase --continue" or "git rebase --abort" first.
    pause
    exit /b 1
)

REM --- Current branch ---
for /f "delims=" %%b in ('git branch --show-current') do set "BRANCH=%%b"
echo Current branch: !BRANCH!
echo.

REM --- Show status ---
echo --- Local changes ---
git status --short
echo.

REM --- Detect if working tree is dirty ---
set "HAS_CHANGES=0"
git diff --quiet || set "HAS_CHANGES=1"
git diff --cached --quiet || set "HAS_CHANGES=1"

set "DID_STASH=0"
if "!HAS_CHANGES!"=="1" (
    echo [1/3] Stashing local changes (including untracked)...
    git stash push -u -m "git-pull.bat auto-stash"
    if errorlevel 1 goto :fail
    set "DID_STASH=1"
) else (
    echo [1/3] No local changes to stash.
)

echo.
echo [2/3] Pulling latest from origin/!BRANCH!...
git pull origin !BRANCH!
if errorlevel 1 (
    echo.
    echo [ERROR] Pull failed.
    if "!DID_STASH!"=="1" (
        echo Your changes are safe in stash. Restore them with:
        echo     git stash pop
    )
    pause
    exit /b 1
)

if "!DID_STASH!"=="1" (
    echo.
    echo [3/3] Restoring stashed changes...
    git stash pop
    if errorlevel 1 (
        echo.
        echo [CONFLICT] Stash pop has conflicts. Fix them, then:
        echo     git add ^<files^>
        echo     git stash drop
        pause
        exit /b 1
    )
) else (
    echo [3/3] No stash to restore.
)

echo.
echo ========================================
echo   Done. Up to date with origin/!BRANCH!
echo ========================================
pause
exit /b 0

:fail
echo.
echo [ERROR] Operation failed.
pause
exit /b 1

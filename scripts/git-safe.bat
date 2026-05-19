@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

REM ============================================
REM  Safe Git Sync + Push (Windows)
REM
REM  Flow:
REM    1. git stash (if dirty)
REM    2. git pull origin <branch>     team's code first
REM    3. git stash pop
REM    4. git add . + commit
REM    5. git push origin <branch>
REM
REM  Prevents code conflicts when team is pushing.
REM
REM  Usage:
REM    git-safe.bat                    asks for message
REM    git-safe.bat "fix login bug"    uses given message
REM ============================================

echo.
echo ========================================
echo   Git Safe — Pull then Push
echo ========================================
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not a git repository.
    pause
    exit /b 1
)

REM Block if rebase/merge in progress
git rev-parse --verify -q MERGE_HEAD >nul 2>&1
if not errorlevel 1 (
    echo [ERROR] A merge is already in progress.
    echo Run: git merge --abort
    pause
    exit /b 1
)
if exist ".git\rebase-merge" (
    echo [ERROR] A rebase is in progress.
    echo Run: git rebase --abort
    pause
    exit /b 1
)
if exist ".git\rebase-apply" (
    echo [ERROR] A rebase is in progress.
    echo Run: git rebase --abort
    pause
    exit /b 1
)

for /f "delims=" %%b in ('git branch --show-current') do set "BRANCH=%%b"
echo Current branch: !BRANCH!
echo.
echo --- Local changes ---
git status --short
echo.

REM Detect dirty
set "HAS_CHANGES=0"
git diff --quiet || set "HAS_CHANGES=1"
git diff --cached --quiet || set "HAS_CHANGES=1"
for /f %%i in ('git ls-files --others --exclude-standard ^| find /c /v ""') do set "UNTRACKED=%%i"
if not "!UNTRACKED!"=="0" set "HAS_CHANGES=1"

REM 1. Stash
set "DID_STASH=0"
if "!HAS_CHANGES!"=="1" (
    echo [1/5] git stash ...
    git stash push -u -m "git-safe auto-stash"
    if errorlevel 1 goto :fail
    set "DID_STASH=1"
) else (
    echo [1/5] No local changes to stash.
)

REM 2. Pull
echo.
echo [2/5] git pull origin !BRANCH! ...
git pull --no-rebase origin !BRANCH!
if errorlevel 1 (
    echo.
    echo [ERROR] Pull failed.
    if "!DID_STASH!"=="1" echo Your changes are safe in stash. Run: git stash pop
    pause
    exit /b 1
)

REM 3. Stash pop
if "!DID_STASH!"=="1" (
    echo.
    echo [3/5] git stash pop ...
    git stash pop
    if errorlevel 1 (
        echo.
        echo [CONFLICT] Stash pop has conflicts.
        echo   Fix in editor, then:
        echo     git add ^<files^>
        echo     git stash drop
        echo   Then run this script again.
        pause
        exit /b 1
    )
) else (
    echo [3/5] No stash to restore.
)

REM 4. Commit
echo.
set "HAS_NEW=0"
git diff --quiet || set "HAS_NEW=1"
git diff --cached --quiet || set "HAS_NEW=1"
for /f %%i in ('git ls-files --others --exclude-standard ^| find /c /v ""') do set "UNTRACKED2=%%i"
if not "!UNTRACKED2!"=="0" set "HAS_NEW=1"

if "!HAS_NEW!"=="1" (
    set "MSG=%~1"
    if "!MSG!"=="" set /p MSG="Commit message: "
    if "!MSG!"=="" (
        echo [ERROR] Commit message cannot be empty.
        pause
        exit /b 1
    )
    echo [4/5] git add . + git commit -m "!MSG!" ...
    git add -A
    if errorlevel 1 goto :fail
    git commit -m "!MSG!"
    if errorlevel 1 goto :fail
) else (
    echo [4/5] No new changes to commit.
)

REM 5. Push
echo.
echo [5/5] git push origin !BRANCH! ...
git push origin !BRANCH!
if errorlevel 1 (
    echo Push failed. Trying with --set-upstream...
    git push -u origin !BRANCH!
    if errorlevel 1 goto :fail
)

echo.
echo ========================================
echo   Done — Synced + Pushed safely
echo ========================================
echo Tip: Run this every time before pushing.
pause
exit /b 0

:fail
echo.
echo [ERROR] Operation failed.
pause
exit /b 1

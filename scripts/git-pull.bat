@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

REM ============================================
REM  Git Pull — Sync only (no push)
REM  Windows
REM
REM  Use this when you START your work day to get
REM  team's latest code BEFORE you start coding.
REM
REM  Flow:
REM    1. git status
REM    2. git stash push -u (if dirty)
REM    3. git pull origin <branch>
REM    4. git stash pop (if stashed)
REM
REM  Usage:
REM    git-pull.bat
REM ============================================

echo.
echo ========================================
echo   Git Pull — Sync Team's Latest
echo ========================================
echo.

git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not a git repository.
    pause
    exit /b 1
)

REM Block if merge/rebase in progress
git rev-parse --verify -q MERGE_HEAD >nul 2>&1
if not errorlevel 1 (
    echo [ERROR] A merge is already in progress.
    echo Run: scripts\git-recover.bat
    pause
    exit /b 1
)
if exist ".git\rebase-merge" (
    echo [ERROR] A rebase is in progress.
    echo Run: scripts\git-recover.bat
    pause
    exit /b 1
)
if exist ".git\rebase-apply" (
    echo [ERROR] A rebase is in progress.
    echo Run: scripts\git-recover.bat
    pause
    exit /b 1
)

for /f "delims=" %%b in ('git branch --show-current') do set "BRANCH=%%b"

REM ── Step 1: git status ──
echo ==^> [1] git status
git status
echo.

REM Detect dirty
set "HAS_CHANGES=0"
git diff --quiet || set "HAS_CHANGES=1"
git diff --cached --quiet || set "HAS_CHANGES=1"
for /f %%i in ('git ls-files --others --exclude-standard ^| find /c /v ""') do set "UNTRACKED=%%i"
if not "!UNTRACKED!"=="0" set "HAS_CHANGES=1"

REM ── Step 2: git stash ──
set "DID_STASH=0"
if "!HAS_CHANGES!"=="1" (
    echo ==^> [2] git stash push -u -m "before-pull-stash"
    git stash push -u -m "before-pull-stash"
    if errorlevel 1 goto :fail
    set "DID_STASH=1"
) else (
    echo ==^> [2] git stash  ^(skipped — no local changes^)
)
echo.

REM ── Step 3: git pull ──
echo ==^> [3] git pull origin !BRANCH!
git pull origin !BRANCH!
if errorlevel 1 (
    echo.
    echo [ERROR] Pull failed.
    if "!DID_STASH!"=="1" echo Your changes are safe in stash. Run: git stash pop
    pause
    exit /b 1
)
echo.

REM ── Step 4: git stash pop ──
if "!DID_STASH!"=="1" (
    echo ==^> [4] git stash pop
    git stash pop
    if errorlevel 1 (
        echo.
        echo [CONFLICT] Stash pop has conflicts.
        echo   Fix conflicts in editor, then:
        echo     git add ^<files^>
        echo     git stash drop
        pause
        exit /b 1
    )
) else (
    echo ==^> [4] git stash pop  ^(skipped — no stash^)
)

echo.
echo ========================================
echo   Done — Synced with origin/!BRANCH!
echo ========================================
echo.
echo Now you can start coding!
echo When done, run: scripts\git-safe.bat "your message"
echo.
pause
exit /b 0

:fail
echo.
echo [ERROR] Operation failed.
pause
exit /b 1

@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

REM ============================================
REM  Git Safe — Pull then Push (Team Workflow)
REM  Windows
REM
REM  Exact flow:
REM    1. git status
REM    2. git stash push -u -m "before-pull-stash"   (if dirty)
REM    3. git pull origin <branch>
REM    4. git stash pop                              (if stashed)
REM    5. git add .
REM    6. git commit -m "<message>"                  (if changes)
REM    7. git push origin <branch>
REM
REM  Usage:
REM    git-safe.bat                    asks for message
REM    git-safe.bat "your message"     uses given message
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

REM Block if merge/rebase already in progress
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
        echo   Then run this script again.
        pause
        exit /b 1
    )
) else (
    echo ==^> [4] git stash pop  ^(skipped — no stash^)
)
echo.

REM Detect new changes after pull/pop
set "HAS_NEW=0"
git diff --quiet || set "HAS_NEW=1"
git diff --cached --quiet || set "HAS_NEW=1"
for /f %%i in ('git ls-files --others --exclude-standard ^| find /c /v ""') do set "UNTRACKED2=%%i"
if not "!UNTRACKED2!"=="0" set "HAS_NEW=1"

if "!HAS_NEW!"=="1" (
    REM ── Step 5: git add . ──
    echo ==^> [5] git add .
    git add .
    if errorlevel 1 goto :fail
    echo.

    REM ── Step 6: git commit ──
    set "MSG=%~1"
    if "!MSG!"=="" (
        set /p MSG="Commit message: "
    )
    if "!MSG!"=="" (
        echo [ERROR] Commit message cannot be empty.
        pause
        exit /b 1
    )

    echo ==^> [6] git commit -m "!MSG!"
    git commit -m "!MSG!"
    if errorlevel 1 goto :fail
    echo.
) else (
    echo ==^> [5-6] git add + commit  ^(skipped — nothing to commit^)
    echo.
)

REM ── Step 7: git push ──
echo ==^> [7] git push origin !BRANCH!
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
echo.
echo Summary:
echo   Stash -^> Pull -^> Stash pop -^> Add -^> Commit -^> Push
echo.
pause
exit /b 0

:fail
echo.
echo [ERROR] Operation failed.
pause
exit /b 1

@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

REM ============================================
REM  Team Git Push Helper (Windows)
REM  Flow: status -> commit -> pull --rebase -> push
REM ============================================

echo.
echo ========================================
echo   Git Push Helper (Team)
echo ========================================
echo.

REM --- Must be inside a git repo ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not a git repository.
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

REM --- Detect if there is anything to commit ---
set "HAS_CHANGES=0"
git diff --quiet || set "HAS_CHANGES=1"
git diff --cached --quiet || set "HAS_CHANGES=1"

if "!HAS_CHANGES!"=="1" (
    set "MSG="
    set /p MSG="Commit message: "
    if "!MSG!"=="" (
        echo [ERROR] Commit message cannot be empty.
        pause
        exit /b 1
    )

    echo.
    echo [1/4] Staging all changes...
    git add -A
    if errorlevel 1 goto :fail

    echo [2/4] Committing...
    git commit -m "!MSG!"
    if errorlevel 1 goto :fail
) else (
    echo No local changes. Will only sync and push existing commits.
)

echo.
echo [3/4] Pulling latest from origin/!BRANCH! (rebase)...
git pull --rebase origin !BRANCH!
if errorlevel 1 (
    echo.
    echo [CONFLICT] Rebase has conflicts. Fix them, then run:
    echo     git add ^<files^>
    echo     git rebase --continue
    echo Or cancel with:
    echo     git rebase --abort
    pause
    exit /b 1
)

echo.
echo [4/4] Pushing to origin/!BRANCH!...
git push origin !BRANCH!
if errorlevel 1 (
    echo.
    set /p SET_UPSTREAM="Branch has no upstream. Push with -u? (y/N): "
    if /i "!SET_UPSTREAM!"=="y" (
        git push -u origin !BRANCH!
        if errorlevel 1 goto :fail
    ) else (
        goto :fail
    )
)

echo.
echo ========================================
echo   Done. Synced and pushed to origin/!BRANCH!
echo ========================================
pause
exit /b 0

:fail
echo.
echo [ERROR] Operation failed.
pause
exit /b 1

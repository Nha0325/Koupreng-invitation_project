@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

REM ============================================
REM  Quick Git Push Helper
REM  Usage: double-click or run from terminal
REM ============================================

echo.
echo ========================================
echo   Git Push Helper
echo ========================================
echo.

REM --- Check we are inside a git repo ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not a git repository.
    pause
    exit /b 1
)

REM --- Show current branch ---
for /f "delims=" %%b in ('git branch --show-current') do set "BRANCH=%%b"
echo Current branch: !BRANCH!
echo.

REM --- Show status ---
echo --- Changes ---
git status --short
echo.

REM --- Check if there is anything to commit ---
git diff --quiet
set "WORKING_CHANGED=!errorlevel!"
git diff --cached --quiet
set "STAGED_CHANGED=!errorlevel!"

if "!WORKING_CHANGED!"=="0" if "!STAGED_CHANGED!"=="0" (
    echo No changes to commit.
    echo.
    set /p PUSH_ONLY="Push existing commits to origin/!BRANCH!? (y/N): "
    if /i "!PUSH_ONLY!"=="y" goto :do_push
    echo Aborted.
    pause
    exit /b 0
)

REM --- Ask for commit message ---
set "MSG="
set /p MSG="Commit message: "
if "!MSG!"=="" (
    echo [ERROR] Commit message cannot be empty.
    pause
    exit /b 1
)

REM --- Stage, commit, push ---
echo.
echo [1/3] Staging all changes...
git add -A
if errorlevel 1 goto :fail

echo [2/3] Committing...
git commit -m "!MSG!"
if errorlevel 1 goto :fail

:do_push
echo [3/3] Pushing to origin/!BRANCH!...
git push origin !BRANCH!
if errorlevel 1 (
    echo.
    echo Push failed. The branch may not exist on remote.
    set /p SET_UPSTREAM="Push and set upstream? (y/N): "
    if /i "!SET_UPSTREAM!"=="y" (
        git push -u origin !BRANCH!
        if errorlevel 1 goto :fail
    ) else (
        goto :fail
    )
)

echo.
echo ========================================
echo   Done. Pushed to origin/!BRANCH!
echo ========================================
pause
exit /b 0

:fail
echo.
echo [ERROR] Operation failed.
pause
exit /b 1

@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul

REM ============================================
REM  Git Recover Helper (Windows)
REM  Aborts stuck rebase/merge/cherry-pick/revert
REM  Shows reflog so you can restore lost commits
REM
REM  Usage:
REM    git-recover.bat           Abort gracefully
REM    git-recover.bat --hard    Abort + reset working tree (DESTRUCTIVE)
REM ============================================

echo.
echo ========================================
echo   Git Recover Helper
echo ========================================
echo.

REM --- Must be inside a git repo ---
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Not a git repository.
    pause
    exit /b 1
)

REM --- Move to repo root ---
for /f "delims=" %%i in ('git rev-parse --show-toplevel') do cd /d "%%i"
for /f "delims=" %%g in ('git rev-parse --git-dir') do set "GIT_DIR=%%g"

echo --- Current state ---
git status --short --branch
echo.

REM --- Detect and abort any in-progress operation ---
set "ABORTED="

if exist "!GIT_DIR!\rebase-merge" (
    echo [1/3] Rebase in progress. Aborting...
    git rebase --abort
    set "ABORTED=rebase"
    goto :after_abort
)
if exist "!GIT_DIR!\rebase-apply" (
    echo [1/3] Rebase in progress. Aborting...
    git rebase --abort
    set "ABORTED=rebase"
    goto :after_abort
)
if exist "!GIT_DIR!\MERGE_HEAD" (
    echo [1/3] Merge in progress. Aborting...
    git merge --abort
    set "ABORTED=merge"
    goto :after_abort
)
if exist "!GIT_DIR!\CHERRY_PICK_HEAD" (
    echo [1/3] Cherry-pick in progress. Aborting...
    git cherry-pick --abort
    set "ABORTED=cherry-pick"
    goto :after_abort
)
if exist "!GIT_DIR!\REVERT_HEAD" (
    echo [1/3] Revert in progress. Aborting...
    git revert --abort
    set "ABORTED=revert"
    goto :after_abort
)
echo [1/3] No in-progress operation detected.

:after_abort
if defined ABORTED (
    echo       Successfully aborted !ABORTED!.
)

REM --- Optional hard reset ---
if "%1"=="--hard" (
    echo.
    echo [2/3] --hard flag: resetting working tree to HEAD...
    echo       WARNING: This discards uncommitted changes!
    set /p CONFIRM="      Continue? (y/N): "
    if /i "!CONFIRM!"=="y" (
        git reset --hard HEAD
        git clean -fd
        echo       Working tree reset.
    ) else (
        echo       Skipped hard reset.
    )
) else (
    echo [2/3] Skipped hard reset ^(use --hard to discard uncommitted changes^).
)

REM --- Show reflog ---
echo.
echo [3/3] Recent reflog (last 15 entries):
echo.
git reflog -15

echo.
echo ========================================
echo   Recovery complete
echo ========================================
echo.
echo If you lost a commit, find its hash above and run:
echo     git reset --hard ^<commit-hash^>
echo.
echo TIP: Before pushing your code, ALWAYS pull team's latest:
echo     scripts\git-pull.bat
echo.
pause
endlocal

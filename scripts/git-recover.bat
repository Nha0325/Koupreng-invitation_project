@echo off
REM git-recover.bat - Emergency git recovery for stuck rebase/merge/cherry-pick.
REM Usage: scripts\git-recover.bat [--hard]
REM   --hard   Also reset working tree to HEAD (discards uncommitted changes)

setlocal

REM Move to repo root
for /f "delims=" %%i in ('git rev-parse --show-toplevel') do cd /d "%%i"

echo ==^> Current branch and status:
git status --short --branch
echo.

REM Detect and abort any in-progress operation
for /f "delims=" %%g in ('git rev-parse --git-dir') do set GIT_DIR=%%g

if exist "%GIT_DIR%\rebase-merge" (
    echo ==^> Rebase in progress. Aborting...
    git rebase --abort
    echo     Done.
    goto :after_abort
)
if exist "%GIT_DIR%\rebase-apply" (
    echo ==^> Rebase in progress. Aborting...
    git rebase --abort
    echo     Done.
    goto :after_abort
)
if exist "%GIT_DIR%\MERGE_HEAD" (
    echo ==^> Merge in progress. Aborting...
    git merge --abort
    echo     Done.
    goto :after_abort
)
if exist "%GIT_DIR%\CHERRY_PICK_HEAD" (
    echo ==^> Cherry-pick in progress. Aborting...
    git cherry-pick --abort
    echo     Done.
    goto :after_abort
)
if exist "%GIT_DIR%\REVERT_HEAD" (
    echo ==^> Revert in progress. Aborting...
    git revert --abort
    echo     Done.
    goto :after_abort
)
echo ==^> No in-progress operation detected.

:after_abort

REM Optional hard reset
if "%1"=="--hard" (
    echo.
    echo ==^> --hard flag detected. Resetting working tree to HEAD...
    git reset --hard HEAD
    git clean -fd
    echo     Working tree reset.
)

echo.
echo ==^> Recent reflog (last 10 entries):
git reflog -10

echo.
echo ==^> Final status:
git status --short --branch

echo.
echo Recovery complete.
echo If you lost a commit, find it in the reflog above and run:
echo   git reset --hard ^<commit-hash^>

endlocal

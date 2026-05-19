#!/usr/bin/env bash
# ============================================
#  Git Recover (Linux / macOS / Git Bash)
#  Aborts stuck rebase/merge/cherry-pick
#  Shows reflog so you can restore lost commits
#
#  Usage:
#    ./git-recover.sh           Abort gracefully
#    ./git-recover.sh --hard    Abort + reset working tree (DESTRUCTIVE)
# ============================================
set -e

echo
echo "========================================"
echo "  Git Recover"
echo "========================================"
echo

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[ERROR] Not a git repository."
    exit 1
fi

cd "$(git rev-parse --show-toplevel)"
GIT_DIR="$(git rev-parse --git-dir)"

echo "--- Current state ---"
git status --short --branch
echo

ABORTED=""
if [[ -d "$GIT_DIR/rebase-merge" || -d "$GIT_DIR/rebase-apply" ]]; then
    echo "Rebase in progress. Aborting..."
    git rebase --abort
    ABORTED="rebase"
elif [[ -f "$GIT_DIR/MERGE_HEAD" ]]; then
    echo "Merge in progress. Aborting..."
    git merge --abort
    ABORTED="merge"
elif [[ -f "$GIT_DIR/CHERRY_PICK_HEAD" ]]; then
    echo "Cherry-pick in progress. Aborting..."
    git cherry-pick --abort
    ABORTED="cherry-pick"
elif [[ -f "$GIT_DIR/REVERT_HEAD" ]]; then
    echo "Revert in progress. Aborting..."
    git revert --abort
    ABORTED="revert"
else
    echo "No in-progress operation detected."
fi

if [[ -n "$ABORTED" ]]; then
    echo "Successfully aborted $ABORTED."
fi

if [[ "$1" == "--hard" ]]; then
    echo
    echo "--hard flag: resetting working tree to HEAD"
    echo "WARNING: This discards uncommitted changes!"
    read -r -p "Continue? (y/N): " CONFIRM
    if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
        git reset --hard HEAD
        git clean -fd
        echo "Working tree reset."
    else
        echo "Skipped hard reset."
    fi
fi

echo
echo "--- Recent reflog (last 15 entries) ---"
git reflog -15

echo
echo "========================================"
echo "  Recovery complete"
echo "========================================"
echo
echo "If you lost a commit, find its hash above and run:"
echo "    git reset --hard <commit-hash>"
echo
echo "Before pushing again, ALWAYS pull first:"
echo "    ./scripts/git-safe.sh"
echo

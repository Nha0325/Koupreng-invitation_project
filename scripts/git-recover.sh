#!/usr/bin/env bash
# ============================================
#  Git Recover Helper (Linux / macOS / Git Bash)
#  Aborts stuck rebase/merge/cherry-pick/revert
#  Shows reflog so you can restore lost commits
#
#  Usage:
#    ./git-recover.sh           Abort gracefully, keep working tree
#    ./git-recover.sh --hard    Abort + reset working tree (DESTRUCTIVE)
# ============================================
set -e

echo
echo "========================================"
echo "  Git Recover Helper"
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

# --- Detect and abort any in-progress operation ---
ABORTED=""

if [[ -d "$GIT_DIR/rebase-merge" || -d "$GIT_DIR/rebase-apply" ]]; then
    echo "[1/3] Rebase in progress. Aborting..."
    git rebase --abort
    ABORTED="rebase"
elif [[ -f "$GIT_DIR/MERGE_HEAD" ]]; then
    echo "[1/3] Merge in progress. Aborting..."
    git merge --abort
    ABORTED="merge"
elif [[ -f "$GIT_DIR/CHERRY_PICK_HEAD" ]]; then
    echo "[1/3] Cherry-pick in progress. Aborting..."
    git cherry-pick --abort
    ABORTED="cherry-pick"
elif [[ -f "$GIT_DIR/REVERT_HEAD" ]]; then
    echo "[1/3] Revert in progress. Aborting..."
    git revert --abort
    ABORTED="revert"
else
    echo "[1/3] No in-progress operation detected."
fi

if [[ -n "$ABORTED" ]]; then
    echo "      Successfully aborted $ABORTED."
fi

# --- Optional hard reset ---
if [[ "$1" == "--hard" ]]; then
    echo
    echo "[2/3] --hard flag: resetting working tree to HEAD..."
    echo "      WARNING: This discards uncommitted changes!"
    read -r -p "      Continue? (y/N): " CONFIRM
    if [[ "$CONFIRM" == "y" || "$CONFIRM" == "Y" ]]; then
        git reset --hard HEAD
        git clean -fd
        echo "      Working tree reset."
    else
        echo "      Skipped hard reset."
    fi
else
    echo "[2/3] Skipped hard reset (use --hard to discard uncommitted changes)."
fi

# --- Show reflog ---
echo
echo "[3/3] Recent reflog (last 15 entries):"
echo
git reflog -15

echo
echo "========================================"
echo "  Recovery complete"
echo "========================================"
echo
echo "If you lost a commit, find its hash above and run:"
echo "    git reset --hard <commit-hash>"
echo
echo "TIP: Before pushing your code, ALWAYS pull team's latest:"
echo "    ./scripts/git-pull.sh"
echo

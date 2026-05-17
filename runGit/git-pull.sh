#!/usr/bin/env bash
# ============================================
#  Team Git Pull Helper (Linux / macOS / Git Bash)
#  Flow: stash (if dirty) -> pull -> stash pop
#  Usage: ./git-pull.sh
# ============================================
set -e

echo
echo "========================================"
echo "  Git Pull Helper (Team)"
echo "========================================"
echo

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[ERROR] Not a git repository."
    exit 1
fi

# Refuse to run during an in-progress merge/rebase
GIT_DIR="$(git rev-parse --git-dir)"
if [[ -f "$GIT_DIR/MERGE_HEAD" ]]; then
    echo "[ERROR] A merge is already in progress."
    echo 'Resolve conflicts, run "git commit", or run "git merge --abort" first.'
    exit 1
fi
if [[ -d "$GIT_DIR/rebase-merge" || -d "$GIT_DIR/rebase-apply" ]]; then
    echo "[ERROR] A rebase is already in progress."
    echo 'Run "git rebase --continue" or "git rebase --abort" first.'
    exit 1
fi

BRANCH="$(git branch --show-current)"
echo "Current branch: $BRANCH"
echo

echo "--- Local changes ---"
git status --short
echo

HAS_CHANGES=0
git diff --quiet || HAS_CHANGES=1
git diff --cached --quiet || HAS_CHANGES=1

DID_STASH=0
if [[ "$HAS_CHANGES" == "1" ]]; then
    echo "[1/3] Stashing local changes (including untracked)..."
    git stash push -u -m "git-pull.sh auto-stash"
    DID_STASH=1
else
    echo "[1/3] No local changes to stash."
fi

echo
echo "[2/3] Pulling latest from origin/$BRANCH..."
if ! git pull origin "$BRANCH"; then
    echo
    echo "[ERROR] Pull failed."
    if [[ "$DID_STASH" == "1" ]]; then
        echo "Your changes are safe in stash. Restore them with:"
        echo "    git stash pop"
    fi
    exit 1
fi

if [[ "$DID_STASH" == "1" ]]; then
    echo
    echo "[3/3] Restoring stashed changes..."
    if ! git stash pop; then
        cat <<EOF

[CONFLICT] Stash pop has conflicts. Fix them, then:
    git add <files>
    git stash drop
EOF
        exit 1
    fi
else
    echo "[3/3] No stash to restore."
fi

echo
echo "========================================"
echo "  Done. Up to date with origin/$BRANCH"
echo "========================================"

#!/usr/bin/env bash
# ============================================
#  Safe Git Sync + Push (Linux / macOS / Git Bash)
#
#  Flow:
#    1. git stash (if dirty)
#    2. git pull origin <branch>     ← team's code first
#    3. git stash pop
#    4. git add . + commit
#    5. git push origin <branch>
#
#  Prevents code conflicts when team is pushing concurrently.
#
#  Usage:
#    ./git-safe.sh                    # asks for commit message
#    ./git-safe.sh "fix login bug"    # uses given message
# ============================================
set -e

echo
echo "========================================"
echo "  Git Safe — Pull then Push"
echo "========================================"
echo

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[ERROR] Not a git repository."
    exit 1
fi

# Block if rebase/merge already in progress
GIT_DIR="$(git rev-parse --git-dir)"
if [[ -f "$GIT_DIR/MERGE_HEAD" ]] || [[ -d "$GIT_DIR/rebase-merge" ]] || [[ -d "$GIT_DIR/rebase-apply" ]]; then
    echo "[ERROR] A merge/rebase is already in progress."
    echo "Resolve it first, or run: git merge --abort  /  git rebase --abort"
    exit 1
fi

BRANCH="$(git branch --show-current)"
echo "Current branch: $BRANCH"
echo
echo "--- Local changes ---"
git status --short
echo

# Detect dirty
HAS_CHANGES=0
git diff --quiet || HAS_CHANGES=1
git diff --cached --quiet || HAS_CHANGES=1
if [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
    HAS_CHANGES=1
fi

# 1. Stash
DID_STASH=0
if [[ "$HAS_CHANGES" == "1" ]]; then
    echo "[1/5] git stash ..."
    git stash push -u -m "git-safe auto-stash $(date +%s)"
    DID_STASH=1
else
    echo "[1/5] No local changes to stash."
fi

# 2. Pull (merge, not rebase — safer)
echo
echo "[2/5] git pull origin $BRANCH ..."
if ! git pull --no-rebase origin "$BRANCH"; then
    echo
    echo "[ERROR] Pull failed."
    if [[ "$DID_STASH" == "1" ]]; then
        echo "Your changes are safe in stash. Run: git stash pop"
    fi
    exit 1
fi

# 3. Stash pop
if [[ "$DID_STASH" == "1" ]]; then
    echo
    echo "[3/5] git stash pop ..."
    if ! git stash pop; then
        echo
        echo "[CONFLICT] Stash pop has conflicts."
        echo "  Fix conflicts in your editor, then:"
        echo "    git add <files>"
        echo "    git stash drop"
        echo "  Then run this script again."
        exit 1
    fi
else
    echo "[3/5] No stash to restore."
fi

# 4. Commit
echo
HAS_NEW=0
git diff --quiet || HAS_NEW=1
git diff --cached --quiet || HAS_NEW=1
if [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
    HAS_NEW=1
fi

if [[ "$HAS_NEW" == "1" ]]; then
    MSG="${1:-}"
    if [[ -z "$MSG" ]]; then
        read -r -p "Commit message: " MSG
    fi
    if [[ -z "$MSG" ]]; then
        echo "[ERROR] Commit message cannot be empty."
        exit 1
    fi
    echo "[4/5] git add . + git commit -m \"$MSG\" ..."
    git add -A
    git commit -m "$MSG"
else
    echo "[4/5] No new changes to commit."
fi

# 5. Push
echo
echo "[5/5] git push origin $BRANCH ..."
if ! git push origin "$BRANCH"; then
    echo "Push failed. Trying with --set-upstream..."
    git push -u origin "$BRANCH"
fi

echo
echo "========================================"
echo "  Done — Synced + Pushed safely"
echo "========================================"
echo "Tip: Run this every time before pushing."
echo

#!/usr/bin/env bash
# ============================================
#  Git Pull — Sync only (no push)
#  Linux / macOS / Git Bash
#
#  Use this when you START your work day to get
#  team's latest code BEFORE you start coding.
#
#  Flow:
#    1. git status
#    2. git stash push -u (if dirty)
#    3. git pull origin <branch>
#    4. git stash pop (if stashed)
#
#  Usage:
#    ./git-pull.sh
# ============================================
set -e

echo
echo "========================================"
echo "  Git Pull — Sync Team's Latest"
echo "========================================"
echo

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[ERROR] Not a git repository."
    exit 1
fi

# Block if rebase/merge in progress
GIT_DIR="$(git rev-parse --git-dir)"
if [[ -f "$GIT_DIR/MERGE_HEAD" ]] || [[ -d "$GIT_DIR/rebase-merge" ]] || [[ -d "$GIT_DIR/rebase-apply" ]]; then
    echo "[ERROR] A merge/rebase is already in progress."
    echo "Run: ./scripts/git-recover.sh"
    exit 1
fi

BRANCH="$(git branch --show-current)"

# ── Step 1: git status ──
echo "==> [1] git status"
git status
echo

# Detect dirty
HAS_CHANGES=0
git diff --quiet || HAS_CHANGES=1
git diff --cached --quiet || HAS_CHANGES=1
if [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
    HAS_CHANGES=1
fi

# ── Step 2: git stash ──
DID_STASH=0
if [[ "$HAS_CHANGES" == "1" ]]; then
    echo "==> [2] git stash push -u -m \"before-pull-stash\""
    git stash push -u -m "before-pull-stash"
    DID_STASH=1
else
    echo "==> [2] git stash  (skipped — no local changes)"
fi
echo

# ── Step 3: git pull ──
echo "==> [3] git pull origin $BRANCH"
if ! git pull origin "$BRANCH"; then
    echo
    echo "[ERROR] Pull failed."
    if [[ "$DID_STASH" == "1" ]]; then
        echo "Your changes are safe in stash. Run: git stash pop"
    fi
    exit 1
fi
echo

# ── Step 4: git stash pop ──
if [[ "$DID_STASH" == "1" ]]; then
    echo "==> [4] git stash pop"
    if ! git stash pop; then
        echo
        echo "[CONFLICT] Stash pop has conflicts."
        echo "  Fix conflicts in your editor, then:"
        echo "    git add <files>"
        echo "    git stash drop"
        exit 1
    fi
else
    echo "==> [4] git stash pop  (skipped — no stash)"
fi

echo
echo "========================================"
echo "  Done — Synced with origin/$BRANCH"
echo "========================================"
echo
echo "Now you can start coding!"
echo "When done, run: ./scripts/git-safe.sh \"your message\""
echo

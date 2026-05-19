#!/usr/bin/env bash
# ============================================
#  Git Safe — Pull then Push (Team Workflow)
#  Linux / macOS / Git Bash
#
#  Exact flow:
#    1. git status
#    2. git stash push -u -m "before-pull-stash"   (if dirty)
#    3. git pull origin <branch>
#    4. git stash pop                              (if stashed)
#    5. git add .
#    6. git commit -m "<message>"                  (if changes)
#    7. git push origin <branch>
#
#  Usage:
#    ./git-safe.sh                    # asks for commit message
#    ./git-safe.sh "your message"     # uses given message
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
    echo "Run: ./scripts/git-recover.sh"
    exit 1
fi

BRANCH="$(git branch --show-current)"

# ── Step 1: git status ──
echo "==> [1] git status"
git status
echo

# Detect if working tree is dirty
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
        echo "  Then run this script again."
        exit 1
    fi
else
    echo "==> [4] git stash pop  (skipped — no stash)"
fi
echo

# Detect if there is anything to commit after pull/pop
HAS_NEW=0
git diff --quiet || HAS_NEW=1
git diff --cached --quiet || HAS_NEW=1
if [[ -n "$(git ls-files --others --exclude-standard)" ]]; then
    HAS_NEW=1
fi

if [[ "$HAS_NEW" == "1" ]]; then
    # ── Step 5: git add . ──
    echo "==> [5] git add ."
    git add .
    echo

    # ── Step 6: git commit ──
    MSG="${1:-}"
    if [[ -z "$MSG" ]]; then
        read -r -p "Commit message: " MSG
    fi
    if [[ -z "$MSG" ]]; then
        echo "[ERROR] Commit message cannot be empty."
        exit 1
    fi

    echo "==> [6] git commit -m \"$MSG\""
    git commit -m "$MSG"
    echo
else
    echo "==> [5-6] git add + commit  (skipped — nothing to commit)"
    echo
fi

# ── Step 7: git push ──
echo "==> [7] git push origin $BRANCH"
if ! git push origin "$BRANCH"; then
    echo "Push failed. Trying with --set-upstream..."
    git push -u origin "$BRANCH"
fi

echo
echo "========================================"
echo "  Done — Synced + Pushed safely"
echo "========================================"
echo
echo "Summary:"
echo "  Stash -> Pull -> Stash pop -> Add -> Commit -> Push"
echo

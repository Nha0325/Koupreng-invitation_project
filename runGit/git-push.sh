#!/usr/bin/env bash
# ============================================
#  Team Git Push Helper (Linux / macOS / Git Bash)
#  Flow: status -> commit -> pull --rebase -> push
#  Usage: ./git-push.sh   or   ./git-push.sh "your message"
# ============================================
set -e

echo
echo "========================================"
echo "  Git Push Helper (Team)"
echo "========================================"
echo

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[ERROR] Not a git repository."
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

if [[ "$HAS_CHANGES" == "1" ]]; then
    MSG="${1:-}"
    if [[ -z "$MSG" ]]; then
        read -r -p "Commit message: " MSG
    fi
    if [[ -z "$MSG" ]]; then
        echo "[ERROR] Commit message cannot be empty."
        exit 1
    fi

    echo
    echo "[1/4] Staging all changes..."
    git add -A

    echo "[2/4] Committing..."
    git commit -m "$MSG"
else
    echo "No local changes. Will only sync and push existing commits."
fi

echo
echo "[3/4] Pulling latest from origin/$BRANCH (rebase)..."
if ! git pull --rebase origin "$BRANCH"; then
    cat <<EOF

[CONFLICT] Rebase has conflicts. Fix them, then run:
    git add <files>
    git rebase --continue
Or cancel with:
    git rebase --abort
EOF
    exit 1
fi

echo
echo "[4/4] Pushing to origin/$BRANCH..."
if ! git push origin "$BRANCH"; then
    echo "Push failed. Trying with --set-upstream..."
    git push -u origin "$BRANCH"
fi

echo
echo "========================================"
echo "  Done. Synced and pushed to origin/$BRANCH"
echo "========================================"

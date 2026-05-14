#!/usr/bin/env bash
# ============================================
#  Quick Git Push Helper (Linux / macOS / Git Bash)
#  Usage: ./git-push.sh   or   ./git-push.sh "your message"
# ============================================
set -e

echo
echo "========================================"
echo "  Git Push Helper"
echo "========================================"
echo

# --- Check we are inside a git repo ---
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    echo "[ERROR] Not a git repository."
    exit 1
fi

BRANCH="$(git branch --show-current)"
echo "Current branch: $BRANCH"
echo

echo "--- Changes ---"
git status --short
echo

# --- If nothing changed, offer to push existing commits ---
if git diff --quiet && git diff --cached --quiet; then
    echo "No changes to commit."
    read -r -p "Push existing commits to origin/$BRANCH? (y/N): " ans
    if [[ "$ans" =~ ^[Yy]$ ]]; then
        git push origin "$BRANCH" || git push -u origin "$BRANCH"
        echo "Done."
    else
        echo "Aborted."
    fi
    exit 0
fi

# --- Get commit message (arg or prompt) ---
MSG="${1:-}"
if [[ -z "$MSG" ]]; then
    read -r -p "Commit message: " MSG
fi
if [[ -z "$MSG" ]]; then
    echo "[ERROR] Commit message cannot be empty."
    exit 1
fi

echo
echo "[1/3] Staging all changes..."
git add -A

echo "[2/3] Committing..."
git commit -m "$MSG"

echo "[3/3] Pushing to origin/$BRANCH..."
if ! git push origin "$BRANCH"; then
    echo "Push failed. Trying with --set-upstream..."
    git push -u origin "$BRANCH"
fi

echo
echo "========================================"
echo "  Done. Pushed to origin/$BRANCH"
echo "========================================"

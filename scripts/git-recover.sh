#!/usr/bin/env bash
# git-recover.sh — Emergency git recovery for stuck rebase/merge/cherry-pick.
# Usage: ./scripts/git-recover.sh [--hard]
#   --hard   Also reset working tree to HEAD (discards uncommitted changes)

set -e

cd "$(git rev-parse --show-toplevel)"

echo "==> Current branch and status:"
git status --short --branch
echo ""

# Detect and abort any in-progress operation
GIT_DIR=$(git rev-parse --git-dir)

if [ -d "$GIT_DIR/rebase-merge" ] || [ -d "$GIT_DIR/rebase-apply" ]; then
    echo "==> Rebase in progress. Aborting..."
    git rebase --abort
    echo "    Done."
elif [ -f "$GIT_DIR/MERGE_HEAD" ]; then
    echo "==> Merge in progress. Aborting..."
    git merge --abort
    echo "    Done."
elif [ -f "$GIT_DIR/CHERRY_PICK_HEAD" ]; then
    echo "==> Cherry-pick in progress. Aborting..."
    git cherry-pick --abort
    echo "    Done."
elif [ -f "$GIT_DIR/REVERT_HEAD" ]; then
    echo "==> Revert in progress. Aborting..."
    git revert --abort
    echo "    Done."
else
    echo "==> No in-progress operation detected."
fi

# Optional hard reset
if [ "$1" = "--hard" ]; then
    echo ""
    echo "==> --hard flag detected. Resetting working tree to HEAD..."
    git reset --hard HEAD
    git clean -fd
    echo "    Working tree reset."
fi

echo ""
echo "==> Recent reflog (last 10 entries):"
git reflog -10

echo ""
echo "==> Final status:"
git status --short --branch

echo ""
echo "Recovery complete."
echo "If you lost a commit, find it in the reflog above and run:"
echo "  git reset --hard <commit-hash>"

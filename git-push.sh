#!/usr/bin/env bash
set -Eeuo pipefail

# Safe team Git push script for Koupreng.

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$SCRIPT_DIR"

TARGET_REMOTE="origin"
TARGET_BRANCH="main"
MESSAGE="${1:-}"

fail() {
    echo -e "\n${RED}Error: $1${NC}" >&2
    exit 1
}

git_path_exists() {
    local path_name="$1"
    local git_path
    git_path="$(git rev-parse --git-path "$path_name" 2>/dev/null || true)"
    [ -n "$git_path" ] && [ -e "$git_path" ]
}

has_local_changes() {
    [ -n "$(git status --porcelain)" ]
}

origin_branch_exists() {
    local remote="$1"
    local branch="$2"
    git ls-remote --exit-code --heads "$remote" "$branch" >/dev/null 2>&1
}

show_unfinished_help() {
    cat >&2 <<EOF

${RED}A rebase or merge is already in progress.${NC}

${YELLOW}To continue:${NC}
  git status
  git rebase --continue
  git merge --continue

${YELLOW}To abort:${NC}
  git rebase --abort
  git merge --abort
EOF
}

show_pull_conflict_help() {
    cat >&2 <<EOF

${RED}Push stopped because collaborator code conflicts with your local work.${NC}

${YELLOW}To fix:${NC}
  git status
  Edit conflicted files
  git add .
  git rebase --continue

${YELLOW}To cancel:${NC}
  git rebase --abort
EOF
}

show_stash_conflict_help() {
    cat >&2 <<EOF

${RED}Your saved local changes conflicted after the pull.${NC}

${YELLOW}To fix:${NC}
  git status
  Edit conflicted files
  git add .
  git commit -m "resolve conflict"

${CYAN}Your stash was kept as a backup.${NC}

${YELLOW}To check:${NC}
  git stash list
EOF
}

safe_pull() {
    local stash_created=0
    local stash_ref='stash@{0}'

    if has_local_changes; then
        echo -e "${YELLOW}Saving uncommitted changes in a temporary stash...${NC}"
        git stash push --include-untracked -m "safe-push auto-stash before pulling ${branch} $(date -u +%Y-%m-%dT%H:%M:%SZ)"
        stash_created=1
    fi

    echo -e "${BLUE}Pulling latest $TARGET_REMOTE/$TARGET_BRANCH with rebase...${NC}"
    if ! git pull --rebase "$TARGET_REMOTE" "$TARGET_BRANCH"; then
        show_pull_conflict_help
        if [ "$stash_created" -eq 1 ]; then
            echo -e "\n${CYAN}Your uncommitted changes are still saved in the auto-stash.${NC}" >&2
            echo -e "${CYAN}Check it with: git stash list${NC}" >&2
        fi
        exit 1
    fi

    if [ "$stash_created" -eq 1 ]; then
        echo -e "${BLUE}Restoring saved local changes...${NC}"
        if ! git stash apply "$stash_ref"; then
            show_stash_conflict_help
            exit 1
        fi
        git stash drop "$stash_ref"
    fi
}

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Not inside a Git repository."

if git_path_exists rebase-merge || git_path_exists rebase-apply || git_path_exists MERGE_HEAD; then
    show_unfinished_help
    exit 1
fi

branch="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
[ -n "$branch" ] || fail "You are in detached HEAD mode. Checkout a branch before pushing."
if [ "$branch" != "$TARGET_BRANCH" ]; then
    fail "This script only pushes from $TARGET_BRANCH to $TARGET_REMOTE/$TARGET_BRANCH. Run: git checkout $TARGET_BRANCH"
fi

if [ -z "$MESSAGE" ]; then
    echo -n -e "${CYAN}Commit message: ${NC}"
    IFS= read -r MESSAGE
fi

[ -n "$MESSAGE" ] || fail "Commit message cannot be empty. Usage: ./git-push.sh \"update invitation flow\""

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  Koupreng Safe Team Git Push${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Current branch:${NC} ${YELLOW}$branch${NC}"
echo -e "${GREEN}Push target:${NC}     ${YELLOW}$TARGET_REMOTE/$TARGET_BRANCH${NC}"
echo ""

echo -e "${BLUE}Fetching latest changes from $TARGET_REMOTE...${NC}"
git fetch "$TARGET_REMOTE" --prune
origin_branch_exists "$TARGET_REMOTE" "$TARGET_BRANCH" || fail "$TARGET_REMOTE/$TARGET_BRANCH was not found."

safe_pull

if has_local_changes; then
    echo -e "${BLUE}Committing local changes...${NC}"
    git add -A
    git commit -m "$MESSAGE"
else
    echo -e "${YELLOW}No local file changes to commit.${NC}"
fi

echo -e "${BLUE}Pushing to $TARGET_REMOTE/$TARGET_BRANCH...${NC}"
git push "$TARGET_REMOTE" "HEAD:$TARGET_BRANCH"

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Pushed successfully to $TARGET_REMOTE/$TARGET_BRANCH${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

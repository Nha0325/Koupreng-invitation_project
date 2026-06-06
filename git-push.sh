#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$SCRIPT_DIR"

TARGET_REMOTE="origin"
TARGET_BRANCH="main"
MESSAGE="${1:-}"

fail() {
    printf '\n%s\n' "$1" >&2
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

show_pull_conflict_help() {
    cat >&2 <<'EOF'

Pull stopped because collaborator code conflicts with your local work.

Fix:
git status
Edit conflicted files
git add .
git rebase --continue

Cancel:
git rebase --abort
EOF
}

show_stash_conflict_help() {
    cat >&2 <<'EOF'

Your saved local changes conflicted after pull.

Fix:
git status
Edit conflicted files
git add .
git commit -m "resolve conflict"

Your stash was kept as a backup.

Check:
git stash list

Drop after verification:
git stash drop stash@{0}
EOF
}

safe_pull() {
    local stash_created=0
    local stash_ref='stash@{0}'

    if has_local_changes; then
        printf 'Saving uncommitted changes in a temporary stash.\n'
        git stash push --include-untracked -m "safe-push auto-stash before pulling ${branch} $(date -u +%Y-%m-%dT%H:%M:%SZ)"
        stash_created=1
    fi

    printf 'Pulling latest %s/%s with rebase.\n' "$TARGET_REMOTE" "$TARGET_BRANCH"
    if ! git pull --rebase "$TARGET_REMOTE" "$TARGET_BRANCH"; then
        show_pull_conflict_help
        if [ "$stash_created" -eq 1 ]; then
            printf '\nYour uncommitted changes are still saved in the auto-stash.\nCheck it with:\ngit stash list\n' >&2
        fi
        exit 1
    fi

    if [ "$stash_created" -eq 1 ]; then
        printf 'Restoring saved local changes.\n'
        if ! git stash apply "$stash_ref"; then
            show_stash_conflict_help
            exit 1
        fi
        git stash drop "$stash_ref"
    fi
}

git rev-parse --is-inside-work-tree >/dev/null 2>&1 || fail "Not inside a Git repository."

if git_path_exists rebase-merge || git_path_exists rebase-apply; then
    fail "A rebase is already in progress. Run git status, then git rebase --continue or git rebase --abort."
fi

if git_path_exists MERGE_HEAD; then
    fail "A merge is already in progress. Run git status, then finish the merge or use git merge --abort."
fi

branch="$(git symbolic-ref --quiet --short HEAD 2>/dev/null || true)"
[ -n "$branch" ] || fail "You are in detached HEAD mode. Checkout a branch before pushing."
if [ "$branch" != "$TARGET_BRANCH" ]; then
    fail "This script only pushes from the $TARGET_BRANCH branch to $TARGET_REMOTE/$TARGET_BRANCH. Run: git checkout $TARGET_BRANCH"
fi

if [ -z "$MESSAGE" ]; then
    printf 'Commit message: '
    IFS= read -r MESSAGE
fi

[ -n "$MESSAGE" ] || fail "Commit message cannot be empty. Usage: ./git-push.sh \"update invitation flow\""

printf 'Safe Team Git Push\n'
printf 'Current branch: %s\n' "$branch"
printf 'Target: %s/%s\n' "$TARGET_REMOTE" "$TARGET_BRANCH"

git fetch "$TARGET_REMOTE" --prune
origin_branch_exists "$TARGET_REMOTE" "$TARGET_BRANCH" || fail "$TARGET_REMOTE/$TARGET_BRANCH was not found."

safe_pull

if has_local_changes; then
    git add -A
    git commit -m "$MESSAGE"
else
    printf 'No local file changes to commit.\n'
fi

git push "$TARGET_REMOTE" "HEAD:$TARGET_BRANCH"

printf '\nPushed successfully to %s/%s\n' "$TARGET_REMOTE" "$TARGET_BRANCH"

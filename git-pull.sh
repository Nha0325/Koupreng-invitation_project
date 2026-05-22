#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$SCRIPT_DIR"

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
    local branch="$1"
    git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1
}

show_unfinished_help() {
    cat >&2 <<'EOF'

A rebase or merge is already in progress.

git status
git rebase --continue
git rebase --abort
git merge --abort
EOF
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

Your saved local changes conflicted with the latest code.

Fix:
git status
Edit conflicted files
git add .
git commit -m "resolve local conflict"

Your stash is kept as backup.

Check:
git stash list

Drop after verification:
git stash drop stash@{0}
EOF
}

safe_pull() {
    local pull_mode="$1"
    local remote="${2:-}"
    local remote_branch="${3:-}"
    local stash_created=0
    local stash_ref='stash@{0}'

    if has_local_changes; then
        git stash push --include-untracked -m "safe-pull auto-stash ${branch} $(date -u +%Y-%m-%dT%H:%M:%SZ)"
        stash_created=1
    fi

    if [ "$pull_mode" = "upstream" ]; then
        if ! git pull --rebase; then
            show_pull_conflict_help
            if [ "$stash_created" -eq 1 ]; then
                printf '\nYour uncommitted changes are still saved in the auto-stash.\nCheck it with:\ngit stash list\n' >&2
            fi
            exit 1
        fi
    else
        if ! git pull --rebase "$remote" "$remote_branch"; then
            show_pull_conflict_help
            if [ "$stash_created" -eq 1 ]; then
                printf '\nYour uncommitted changes are still saved in the auto-stash.\nCheck it with:\ngit stash list\n' >&2
            fi
            exit 1
        fi
    fi

    if [ "$stash_created" -eq 1 ]; then
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
[ -n "$branch" ] || fail "You are in detached HEAD mode. Checkout a branch before pulling."

git fetch origin --prune

upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>/dev/null || true)"
if [ -n "$upstream" ]; then
    printf 'Pull target: %s\n' "$upstream"
    safe_pull upstream
elif origin_branch_exists "$branch"; then
    printf 'Pull target: origin/%s\n' "$branch"
    safe_pull explicit origin "$branch"
elif origin_branch_exists main; then
    printf 'No upstream branch yet. Pulling origin/main to update this branch base.\n'
    safe_pull explicit origin main
else
    fail "No upstream branch, origin/$branch, or origin/main was found."
fi

printf '\nPull completed successfully.\n'
printf 'Your branch is up to date.\n'

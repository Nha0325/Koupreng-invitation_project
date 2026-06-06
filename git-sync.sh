#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
cd "$SCRIPT_DIR"

MESSAGE="${1:-}"

if [ -z "$MESSAGE" ]; then
    printf 'Commit message: '
    IFS= read -r MESSAGE
fi

if [ -z "$MESSAGE" ]; then
    printf '\nCommit message cannot be empty. Usage: ./git-sync.sh "update invitation flow"\n' >&2
    exit 1
fi

printf 'Safe Team Git Sync\n'
printf 'Step 1: pull latest origin/main\n'
"$SCRIPT_DIR/git-pull.sh"

printf '\nStep 2: commit and push to origin/main\n'
"$SCRIPT_DIR/git-push.sh" "$MESSAGE"

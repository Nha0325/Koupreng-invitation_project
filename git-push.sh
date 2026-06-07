#!/bin/bash
set -euo pipefail

# Add all changes (respects .gitignore)
git add .

# Commit with a message (use first argument or default)
MSG="${1:-Update Bot.}"
if git diff --cached --quiet; then
  echo "No changes to commit."
else
  git commit -m "$MSG"
fi

# Push the current commit to GitHub main.
git push --force-with-lease origin HEAD:main

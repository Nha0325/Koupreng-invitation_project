#!/bin/bash

# Add all changes (respects .gitignore)
git add .

# Commit with a message (use first argument or default)
MSG="${1:- Add these fields after 'sendStatus'}"
git commit -m "$MSG"

# Force push to origin main
git push --force origin main

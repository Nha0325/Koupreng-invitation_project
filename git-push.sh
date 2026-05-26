#!/bin/bash

# Add all changes
git add .

# Commit with a message (use first argument or default)
MSG="${1:-update project}"
git commit -m "$MSG"

# Push to origin main
git push origin main

#!/usr/bin/env bash
# ==============================================================================
# Koupreng - Safe Git Push (Linux)
# Steps: stash → pull → pop stash → add → commit → push
# Revert: git reset --soft HEAD~1 (undo last commit, keep changes)
# ==============================================================================

set -eo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

BRANCH=$(git branch --show-current)
MSG="${1:-update: changes from $(hostname) at $(date '+%Y-%m-%d %H:%M')}"

echo -e "${BOLD}${CYAN}======================================================${NC}"
echo -e "${BOLD}${YELLOW}   ⚜️  KOUPRENG - SAFE GIT PUSH${NC}"
echo -e "${BOLD}${CYAN}======================================================${NC}"
echo -e "  Branch: ${GREEN}${BRANCH}${NC}"
echo -e "  Message: ${CYAN}${MSG}${NC}"

# Step 1: Stash local changes (safety)
echo -e "\n${BOLD}[1/5] Stashing local changes...${NC}"
STASH_RESULT=$(git stash push -m "auto-stash-before-push" 2>&1 || true)
STASHED=false
if echo "$STASH_RESULT" | grep -q "Saved working directory"; then
  STASHED=true
  echo -e "  ${GREEN}✓ Changes stashed${NC}"
else
  echo -e "  ${CYAN}— No changes to stash (clean tree)${NC}"
fi

# Step 2: Pull remote (avoid conflict)
echo -e "\n${BOLD}[2/5] Pulling latest from remote...${NC}"
if git pull --rebase origin "$BRANCH" 2>&1; then
  echo -e "  ${GREEN}✓ Pull successful${NC}"
else
  echo -e "  ${RED}✗ Pull conflict detected! Fix manually:${NC}"
  echo -e "    1. git rebase --abort"
  echo -e "    2. git stash pop (if stashed)"
  exit 1
fi

# Step 3: Pop stash (restore your changes)
echo -e "\n${BOLD}[3/5] Restoring local changes...${NC}"
if [ "$STASHED" = true ]; then
  git stash pop
  echo -e "  ${GREEN}✓ Changes restored${NC}"
else
  echo -e "  ${CYAN}— Nothing to restore${NC}"
fi

# Step 4: Add + Commit
echo -e "\n${BOLD}[4/5] Adding & Committing...${NC}"
git add -A
if git diff --cached --quiet; then
  echo -e "  ${CYAN}— Nothing to commit (already up-to-date)${NC}"
  echo -e "\n${GREEN}✓ Done! Everything is synced.${NC}"
  exit 0
fi
git commit -m "$MSG"
echo -e "  ${GREEN}✓ Committed${NC}"

# Step 5: Push
echo -e "\n${BOLD}[5/5] Pushing to remote...${NC}"
git push origin "$BRANCH"
echo -e "  ${GREEN}✓ Pushed to origin/${BRANCH}${NC}"

echo -e "\n${BOLD}${GREEN}======================================================${NC}"
echo -e "${BOLD}${GREEN}   ✅ PUSH COMPLETED SUCCESSFULLY!${NC}"
echo -e "${BOLD}${GREEN}======================================================${NC}"
echo -e "  ${YELLOW}To undo (revert back):${NC}"
echo -e "    ${CYAN}git reset --soft HEAD~1${NC}  (undo commit, keep changes)"
echo -e "    ${CYAN}git push --force-with-lease origin ${BRANCH}${NC}  (force update remote)"
echo -e "======================================================\n"

#!/usr/bin/env bash
# ==============================================================================
# Koupreng - Safe Git Pull (Linux)
# Steps: stash → pull --rebase → pop stash
# Revert: git reset --hard ORIG_HEAD (go back to before pull)
# ==============================================================================

set -eo pipefail

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

BRANCH=$(git branch --show-current)

echo -e "${BOLD}${CYAN}======================================================${NC}"
echo -e "${BOLD}${YELLOW}   ⚜️  KOUPRENG - SAFE GIT PULL${NC}"
echo -e "${BOLD}${CYAN}======================================================${NC}"
echo -e "  Branch: ${GREEN}${BRANCH}${NC}"

# Step 1: Stash local changes
echo -e "\n${BOLD}[1/3] Stashing local changes...${NC}"
STASH_RESULT=$(git stash push -m "auto-stash-before-pull" 2>&1 || true)
STASHED=false
if echo "$STASH_RESULT" | grep -q "Saved working directory"; then
  STASHED=true
  echo -e "  ${GREEN}✓ Changes stashed safely${NC}"
else
  echo -e "  ${CYAN}— No local changes to stash${NC}"
fi

# Step 2: Pull (rebase to keep history clean)
echo -e "\n${BOLD}[2/3] Pulling latest from origin/${BRANCH}...${NC}"
if git pull --rebase origin "$BRANCH" 2>&1; then
  echo -e "  ${GREEN}✓ Pull successful${NC}"
else
  echo -e "  ${RED}✗ Conflict during pull! Resolve manually:${NC}"
  echo -e "    1. Fix conflicts in files"
  echo -e "    2. git add <file>"
  echo -e "    3. git rebase --continue"
  echo -e "    ${YELLOW}Or abort: git rebase --abort${NC}"
  exit 1
fi

# Step 3: Pop stash
echo -e "\n${BOLD}[3/3] Restoring local changes...${NC}"
if [ "$STASHED" = true ]; then
  if git stash pop 2>&1; then
    echo -e "  ${GREEN}✓ Local changes restored${NC}"
  else
    echo -e "  ${RED}✗ Stash conflict! Your changes are in 'git stash list'${NC}"
    echo -e "    Fix conflicts then: ${CYAN}git stash drop${NC}"
    exit 1
  fi
else
  echo -e "  ${CYAN}— Nothing to restore${NC}"
fi

echo -e "\n${BOLD}${GREEN}======================================================${NC}"
echo -e "${BOLD}${GREEN}   ✅ PULL COMPLETED SUCCESSFULLY!${NC}"
echo -e "${BOLD}${GREEN}======================================================${NC}"
echo -e "  ${YELLOW}To undo (go back to before pull):${NC}"
echo -e "    ${CYAN}git reset --hard ORIG_HEAD${NC}"
echo -e "======================================================\n"

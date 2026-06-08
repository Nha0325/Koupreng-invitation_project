#!/bin/bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# git-push.sh — Interactive menu-driven Git push script for Koupreng
# ─────────────────────────────────────────────────────────────────────────────

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# ─────────────────────────────────────────────────────────────────────────────
# Commit message templates
# ─────────────────────────────────────────────────────────────────────────────
show_menu() {
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}  Koupreng Git Push Menu${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
  echo ""
  echo -e "${GREEN}Backend (Spring Boot)${NC}"
  echo -e "  ${YELLOW}1)${NC}  Update backend API endpoints"
  echo -e "  ${YELLOW}2)${NC}  Fix backend bug"
  echo -e "  ${YELLOW}3)${NC}  Add backend feature"
  echo -e "  ${YELLOW}4)${NC}  Update backend security/auth"
  echo -e "  ${YELLOW}5)${NC}  Update database schema/migration"
  echo ""
  echo -e "${GREEN}Frontend User${NC}"
  echo -e "  ${YELLOW}6)${NC}  Update user interface/UI"
  echo -e "  ${YELLOW}7)${NC}  update chat bot"
  echo -e "  ${YELLOW}8)${NC}  update page page"
  echo -e "  ${YELLOW}9)${NC}  Fix frontend-user bug"
  echo -e "  ${YELLOW}10)${NC} Add user-facing feature"
  echo -e "  ${YELLOW}11)${NC} Update invitation templates"
  echo ""
  echo -e "${GREEN}Frontend Admin${NC}"
  echo -e "  ${YELLOW}12)${NC} Update admin dashboard"
  echo -e "  ${YELLOW}13)${NC} Fix admin panel bug"
  echo -e "  ${YELLOW}14)${NC} Add admin feature"
  echo ""
  echo -e "${GREEN}Telegram Bot${NC}"
  echo -e "  ${YELLOW}15)${NC} Update telegram bot"
  echo -e "  ${YELLOW}16)${NC} Fix telegram bot webhook"
  echo -e "  ${YELLOW}17)${NC} Add telegram bot feature"
  echo ""
  echo -e "${GREEN}Infrastructure & Configuration${NC}"
  echo -e "  ${YELLOW}18)${NC} Update environment configuration"
  echo -e "  ${YELLOW}19)${NC} Update dependencies"
  echo -e "  ${YELLOW}20)${NC} Update dev scripts (dev.sh, setup.sh)"
  echo -e "  ${YELLOW}21)${NC} Update documentation"
  echo ""
  echo -e "${GREEN}Payment Integration${NC}"
  echo -e "  ${YELLOW}22)${NC} Update payment flow"
  echo -e "  ${YELLOW}23)${NC} Fix payment bug"
  echo -e "  ${YELLOW}24)${NC} Add payment feature (ABA PayWay, etc.)"
  echo ""
  echo -e "${GREEN}General${NC}"
  echo -e "  ${YELLOW}25)${NC} Refactor code"
  echo -e "  ${YELLOW}26)${NC} Update tests"
  echo -e "  ${YELLOW}27)${NC} Performance improvements"
  echo -e "  ${YELLOW}28)${NC} Security updates"
  echo -e "  ${YELLOW}29)${NC} General bug fixes"
  echo -e "  ${YELLOW}30)${NC} Work in progress (WIP)"
  echo ""
  echo -e "${GREEN}Quick Actions${NC}"
  echo -e "  ${YELLOW}31)${NC} Quick commit (default message)"
  echo -e "  ${YELLOW}32)${NC} Custom commit message"
  echo ""
  echo -e "${RED}0)${NC}  Cancel and exit"
  echo ""
  echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
}

# ─────────────────────────────────────────────────────────────────────────────
# Main script
# ─────────────────────────────────────────────────────────────────────────────

# If a message is provided as argument, use it directly (backward compatibility)
if [ $# -ge 1 ]; then
  MSG="$1"
else
  # Show interactive menu
  show_menu
  
  # Get user choice
  echo -n -e "${CYAN}Select an option [0-32]: ${NC}"
  read -r CHOICE
  
  case "$CHOICE" in
    1)  MSG="Update backend API endpoints" ;;
    2)  MSG="Fix backend bug" ;;
    3)  MSG="Add backend feature" ;;
    4)  MSG="Update backend security/auth" ;;
    5)  MSG="Update database schema/migration" ;;
    6)  MSG="Update user interface/UI" ;;
    7)  MSG="update chat bot" ;;
    8)  MSG="update page page" ;;
    9)  MSG="Fix frontend-user bug" ;;
    10) MSG="Add user-facing feature" ;;
    11) MSG="Update invitation templates" ;;
    12) MSG="Update admin dashboard" ;;
    13) MSG="Fix admin panel bug" ;;
    14) MSG="Add admin feature" ;;
    15) MSG="Update telegram bot" ;;
    16) MSG="Fix telegram bot webhook" ;;
    17) MSG="Add telegram bot feature" ;;
    18) MSG="Update environment configuration" ;;
    19) MSG="Update dependencies" ;;
    20) MSG="Update dev scripts" ;;
    21) MSG="Update documentation" ;;
    22) MSG="Update payment flow" ;;
    23) MSG="Fix payment bug" ;;
    24) MSG="Add payment feature" ;;
    25) MSG="Refactor code" ;;
    26) MSG="Update tests" ;;
    27) MSG="Performance improvements" ;;
    28) MSG="Security updates" ;;
    29) MSG="General bug fixes" ;;
    30) MSG="WIP: Work in progress" ;;
    31) MSG="Update project" ;;
    32) 
      echo -n -e "${CYAN}Enter custom commit message: ${NC}"
      read -r MSG
      if [ -z "$MSG" ]; then
        echo -e "${RED}Error: Commit message cannot be empty${NC}"
        exit 1
      fi
      ;;
    0)
      echo -e "${YELLOW}Cancelled.${NC}"
      exit 0
      ;;
    *)
      echo -e "${RED}Invalid choice. Exiting.${NC}"
      exit 1
      ;;
  esac
fi

# ─────────────────────────────────────────────────────────────────────────────
# Git operations
# ─────────────────────────────────────────────────────────────────────────────

echo ""
echo -e "${BLUE}Checking current branch...${NC}"

# Get current branch name
CURRENT_BRANCH=$(git branch --show-current)

# Check if we're on main branch, if not switch to it
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo -e "${YELLOW}Current branch: $CURRENT_BRANCH${NC}"
  echo -e "${BLUE}Switching to main branch...${NC}"
  
  # Stash any uncommitted changes temporarily
  git stash push -m "Auto-stash before switching to main"
  STASHED=$?
  
  # Switch to main
  git checkout main
  
  # Pop stashed changes if we stashed them
  if [ $STASHED -eq 0 ]; then
    git stash pop
  fi
else
  echo -e "${GREEN}Already on main branch${NC}"
fi

echo ""
echo -e "${BLUE}Fetching latest changes from origin/main...${NC}"

# Fetch the latest changes from remote
git fetch origin main

echo ""
echo -e "${BLUE}Checking for changes...${NC}"

# Add all changes (respects .gitignore)
git add .

# Check if there are changes to commit
if git diff --cached --quiet; then
  echo -e "${YELLOW}No changes to commit.${NC}"
  
  # Check if we need to pull
  LOCAL=$(git rev-parse main)
  REMOTE=$(git rev-parse origin/main)
  
  if [ "$LOCAL" != "$REMOTE" ]; then
    echo -e "${BLUE}Pulling latest changes...${NC}"
    git pull --rebase origin main
    echo -e "${GREEN}✓ Up to date with origin/main${NC}"
  else
    echo -e "${GREEN}✓ Already up to date with origin/main${NC}"
  fi
  
  exit 0
fi

# Show what will be committed
echo ""
echo -e "${CYAN}Files to be committed:${NC}"
git diff --cached --name-status | while read -r status file; do
  case "$status" in
    A) echo -e "  ${GREEN}[Added]${NC}    $file" ;;
    M) echo -e "  ${YELLOW}[Modified]${NC} $file" ;;
    D) echo -e "  ${RED}[Deleted]${NC}  $file" ;;
    *) echo -e "  [$status]      $file" ;;
  esac
done

echo ""
echo -e "${CYAN}Commit message:${NC} ${MAGENTA}$MSG${NC}"
echo ""

# Ask for confirmation
echo -n -e "${YELLOW}Proceed with commit and push to main? [Y/n]: ${NC}"
read -r CONFIRM

if [[ "$CONFIRM" =~ ^[Nn] ]]; then
  echo -e "${YELLOW}Cancelled by user.${NC}"
  git reset > /dev/null 2>&1
  exit 0
fi

# Commit
echo -e "${BLUE}Committing changes...${NC}"
git commit -m "$MSG"

# Rebase on top of origin/main to get latest changes
echo -e "${BLUE}Rebasing on origin/main...${NC}"
if ! git pull --rebase origin main; then
  echo -e "${RED}Rebase failed! Please resolve conflicts manually.${NC}"
  echo -e "${YELLOW}Run 'git status' to see conflicts${NC}"
  echo -e "${YELLOW}After fixing, run: git add . && git rebase --continue${NC}"
  echo -e "${YELLOW}Or abort with: git rebase --abort${NC}"
  exit 1
fi

# Push directly to main branch
echo -e "${BLUE}Pushing to main branch...${NC}"
git push origin main

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Successfully pushed to main branch!${NC}"
echo -e "${GREEN}✓ Commit: $MSG${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

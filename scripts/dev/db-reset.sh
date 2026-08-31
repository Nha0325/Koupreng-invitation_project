#!/usr/bin/env bash
# ==============================================================================
# Koupreng Project - Database Reset & Migration Re-run (Linux)
# Author: Nha & Antigravity
# ==============================================================================

set -eo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

cd "${ROOT_DIR}"

DB_PASS="123456"
if [ -f "${ROOT_DIR}/.env" ]; then
  ENV_PASS=$(grep '^DB_PASSWORD=' "${ROOT_DIR}/.env" | cut -d '=' -f2- | tr -d '"' | tr -d "'")
  if [ -n "$ENV_PASS" ]; then DB_PASS="$ENV_PASS"; fi
fi

echo -e "${BOLD}${YELLOW}⚠️  Resetting MariaDB database 'koupreng_db'...${NC}"

mariadb -u root -p"${DB_PASS}" -e "DROP DATABASE IF EXISTS koupreng_db; CREATE DATABASE koupreng_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

echo -e "${GREEN}✓ Database 'koupreng_db' reset. Flyway migrations will run automatically on next Backend start.${NC}"

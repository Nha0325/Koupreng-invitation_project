#!/usr/bin/env bash
set -euo pipefail

SSH_PORT="${SSH_PORT:-22}"
APP_PORT="${APP_PORT:-8080}"
MANAGEMENT_PORT="${MANAGEMENT_PORT:-8081}"
ALLOWED_SSH_CIDR="${ALLOWED_SSH_CIDR:-}"
ALLOWED_APP_CIDR="${ALLOWED_APP_CIDR:-127.0.0.1}"
ALLOWED_MONITORING_CIDR="${ALLOWED_MONITORING_CIDR:-}"

sudo ufw default deny incoming
sudo ufw default allow outgoing

if [[ -n "$ALLOWED_SSH_CIDR" ]]; then
  sudo ufw allow from "$ALLOWED_SSH_CIDR" to any port "$SSH_PORT" proto tcp comment "SSH restricted"
else
  sudo ufw allow "$SSH_PORT/tcp" comment "SSH"
fi

sudo ufw allow 80/tcp comment "HTTP ACME and redirect"
sudo ufw allow 443/tcp comment "HTTPS"

if [[ "$ALLOWED_APP_CIDR" != "127.0.0.1" ]]; then
  sudo ufw allow from "$ALLOWED_APP_CIDR" to any port "$APP_PORT" proto tcp comment "Koupreng backend private"
fi

if [[ -n "$ALLOWED_MONITORING_CIDR" ]]; then
  sudo ufw allow from "$ALLOWED_MONITORING_CIDR" to any port "$MANAGEMENT_PORT" proto tcp comment "Koupreng monitoring"
fi

sudo ufw --force enable
sudo ufw status verbose

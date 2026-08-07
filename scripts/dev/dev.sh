#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# dev.sh — Start everything for Koupreng local development
#
# Usage:
#   ./scripts/dev/dev.sh                # start all services with ngrok (40 req/min limit)
#   ./scripts/dev/dev.sh --cloudflare   # use Cloudflare Tunnel (unlimited, recommended)
#   ./scripts/dev/dev.sh --no-ngrok     # skip public tunnel, localhost only
#   ./scripts/dev/dev.sh --no-bot       # skip telegram bot
#
# Services started:
#   1. Spring Boot backend      → http://localhost:8080
#   2. frontend-user            → http://localhost:5173
#   3. frontend-admin           → http://localhost:5174
#   4. Telegram bot             → http://localhost:8000
#   5. Public tunnel            → HTTPS URL for frontend-user
#      - ngrok (default)        → 40 requests/minute limit
#      - cloudflare (--cloudflare) → unlimited, free forever
#                                  /telegram is proxied to telegram-bot
#
# Requires: java, mvn/mvnw, node, npm, python3
# Optional: ngrok (in PATH) OR cloudflared (in PATH)
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd -P)"
LOG_DIR="$PROJECT_ROOT/logs"
mkdir -p "$LOG_DIR"

BACKEND_PORT="${BACKEND_PORT:-8080}"
FRONTEND_USER_PORT="${FRONTEND_USER_PORT:-5173}"
FRONTEND_ADMIN_PORT="${FRONTEND_ADMIN_PORT:-5174}"
TELEGRAM_BOT_PORT="${TELEGRAM_BOT_PORT:-8000}"
NGROK_API_PORT="${NGROK_API_PORT:-4040}"

env_file_value() {
  local file=$1 key=$2
  [ -f "$file" ] || return 0
  awk -F= -v key="$key" '$1 == key {print substr($0, index($0, "=") + 1); exit}' "$file" | tr -d '\r'
}

csv_append_unique() {
  local csv=$1 value=$2
  [ -n "$value" ] || { printf '%s' "$csv"; return; }
  case ",$csv," in
    *,"$value",*) printf '%s' "$csv" ;;
    *) printf '%s,%s' "$csv" "$value" ;;
  esac
}

ROOT_ENV="$PROJECT_ROOT/.env"
ROOT_CORS_ALLOWED_ORIGINS="$(env_file_value "$ROOT_ENV" CORS_ALLOWED_ORIGINS)"
PUBLIC_FRONTEND_URL="$(env_file_value "$ROOT_ENV" VITE_PUBLIC_APP_URL)"
DEV_CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS:-${ROOT_CORS_ALLOWED_ORIGINS:-http://localhost:$FRONTEND_USER_PORT,http://localhost:$FRONTEND_ADMIN_PORT}}"
if [ -n "$PUBLIC_FRONTEND_URL" ]; then
  DEV_CORS_ALLOWED_ORIGINS="$(csv_append_unique "$DEV_CORS_ALLOWED_ORIGINS" "$PUBLIC_FRONTEND_URL")"
fi

# ── Parse flags ──────────────────────────────────────────────────────────────
USE_NGROK=true
USE_CLOUDFLARE=false
USE_BOT=true
for arg in "$@"; do
  case "$arg" in
    --no-ngrok)    USE_NGROK=false ;;
    --cloudflare)  USE_CLOUDFLARE=true; USE_NGROK=false ;;
    --no-bot)      USE_BOT=false   ;;
  esac
done

if [ "$USE_BOT" = true ] && [ "$TELEGRAM_BOT_PORT" = "$BACKEND_PORT" ]; then
  echo "[DEV] telegram-bot port ($TELEGRAM_BOT_PORT) must be different from backend port ($BACKEND_PORT)." >&2
  echo "[DEV] Run with TELEGRAM_BOT_PORT=8000 ./scripts/dev/dev.sh or choose another free bot port." >&2
  exit 1
fi

# ── Colors ────────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
BLUE='\033[0;34m'; CYAN='\033[0;36m'; NC='\033[0m'

log()  { echo -e "${GREEN}[DEV]${NC} $*"; }
info() { echo -e "${CYAN}[DEV]${NC} $*"; }
warn() { echo -e "${YELLOW}[DEV]${NC} $*"; }
err()  { echo -e "${RED}[DEV]${NC} $*" >&2; }

# ── Port ownership helpers ───────────────────────────────────────────────────
pids_on_port() {
  local port=$1
  if command -v lsof &>/dev/null; then
    lsof -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null | sort -u
    return
  fi

  ss -ltnp "sport = :$port" 2>/dev/null \
    | sed -nE 's/.*pid=([0-9]+).*/\1/p' \
    | sort -u
}

pid_belongs_to_project() {
  local pid=$1 cwd cmdline

  cwd="$(readlink -f "/proc/$pid/cwd" 2>/dev/null || true)"
  if [[ "$cwd" == "$PROJECT_ROOT" || "$cwd" == "$PROJECT_ROOT/"* ]]; then
    return 0
  fi

  cmdline="$(tr '\0' ' ' < "/proc/$pid/cmdline" 2>/dev/null || true)"
  [[ "$cmdline" == *"$PROJECT_ROOT"* ]]
}

free_project_port() {
  local port=$1 label=$2 pid cmdline
  local pids=()
  mapfile -t pids < <(pids_on_port "$port")

  [ "${#pids[@]}" -eq 0 ] && return 0

  for pid in "${pids[@]}"; do
    if ! pid_belongs_to_project "$pid"; then
      cmdline="$(tr '\0' ' ' < "/proc/$pid/cmdline" 2>/dev/null | cut -c1-140 || true)"
      err "$label port $port is already used by non-project PID $pid: $cmdline"
      err "Stop that process or run this script with a different port configuration."
      return 1
    fi
  done

  for pid in "${pids[@]}"; do
    warn "Stopping existing $label process on port $port (PID $pid)"
    kill "$pid" 2>/dev/null || true
  done

  for _ in {1..10}; do
    sleep 0.5
    mapfile -t pids < <(pids_on_port "$port")
    [ "${#pids[@]}" -eq 0 ] && return 0
  done

  mapfile -t pids < <(pids_on_port "$port")
  for pid in "${pids[@]}"; do
    if pid_belongs_to_project "$pid"; then
      warn "Force stopping existing $label process on port $port (PID $pid)"
      kill -9 "$pid" 2>/dev/null || true
    fi
  done

  sleep 0.5
  mapfile -t pids < <(pids_on_port "$port")
  if [ "${#pids[@]}" -ne 0 ]; then
    err "$label port $port is still in use"
    return 1
  fi
}

# ── PID tracking ─────────────────────────────────────────────────────────────
PIDS=()

cleanup() {
  if [ "${#PIDS[@]}" -eq 0 ]; then
    return
  fi

  echo ""
  warn "Shutting down all services..."
  for pid in "${PIDS[@]}"; do
    kill "$pid" 2>/dev/null || true
  done

  free_project_port "$BACKEND_PORT" "backend"       || true
  free_project_port "$FRONTEND_USER_PORT" "frontend-user" || true
  free_project_port "$FRONTEND_ADMIN_PORT" "frontend-admin" || true
  if [ "$USE_BOT" = true ]; then
    free_project_port "$TELEGRAM_BOT_PORT" "telegram-bot" || true
  fi
  if [ "$USE_NGROK" = true ]; then
    free_project_port "$NGROK_API_PORT" "ngrok" || true
  fi

  log "All services stopped."
}
trap cleanup EXIT INT TERM

# ── Helper: wait for port ─────────────────────────────────────────────────────
wait_for_port() {
  local port=$1 label=$2 retries=${3:-30}
  local count=0
  while ! nc -z localhost "$port" 2>/dev/null; do
    sleep 1
    count=$((count + 1))
    if [ "$count" -ge "$retries" ]; then
      warn "$label did not start on port $port within ${retries}s"
      return 1
    fi
  done
  log "$label ready on port $port"
}

# ── Free ports from previous project dev runs ────────────────────────────────
log "Checking development ports..."
free_project_port "$BACKEND_PORT" "backend"
free_project_port "$FRONTEND_USER_PORT" "frontend-user"
free_project_port "$FRONTEND_ADMIN_PORT" "frontend-admin"
if [ "$USE_BOT" = true ]; then
  free_project_port "$TELEGRAM_BOT_PORT" "telegram-bot"
fi
if [ "$USE_NGROK" = true ]; then
  free_project_port "$NGROK_API_PORT" "ngrok"
fi

# Kill any existing cloudflared processes if using Cloudflare
if [ "$USE_CLOUDFLARE" = true ]; then
  pkill -f "cloudflared tunnel" 2>/dev/null || true
  sleep 1
fi

# ─────────────────────────────────────────────────────────────────────────────
# 1. Spring Boot backend
# ─────────────────────────────────────────────────────────────────────────────
log "Starting Spring Boot backend..."
(
  cd "$PROJECT_ROOT/apps/backend"
  SERVER_PORT="$BACKEND_PORT" CORS_ALLOWED_ORIGINS="$DEV_CORS_ALLOWED_ORIGINS" ./mvnw -q -DskipTests spring-boot:run > "$LOG_DIR/backend.log" 2>&1
) &
PIDS+=($!)
info "Backend log → logs/backend.log"

# ─────────────────────────────────────────────────────────────────────────────
# Resolve public tunnel URL BEFORE starting frontend-user (so Vite gets
# VITE_HMR_HOST at startup and WebSocket connects through the tunnel)
# ─────────────────────────────────────────────────────────────────────────────
PUBLIC_FRONTEND_URL=""
HMR_HOST=""

if [ "$USE_CLOUDFLARE" = true ]; then
  if command -v cloudflared &>/dev/null; then
    log "Starting Cloudflare Tunnel (pre-flight, resolving URL before Vite)..."
    cloudflared tunnel --url "http://localhost:$FRONTEND_USER_PORT" --no-autoupdate > "$LOG_DIR/cloudflare-tunnel.log" 2>&1 &
    PIDS+=($!)
    # Wait briefly — we'll grab the URL after Vite starts too
  fi
elif [ "$USE_NGROK" = true ]; then
  if command -v ngrok &>/dev/null; then
    log "Starting ngrok tunnel (pre-flight, resolving URL before Vite)..."
    warn "⚠️  Ngrok free tier: 40 requests/minute limit"
    warn "⚠️  Use --cloudflare flag for unlimited free tunneling"
    ngrok http "$FRONTEND_USER_PORT" --log=stdout > "$LOG_DIR/ngrok-frontend.log" 2>&1 &
    PIDS+=($!)
    sleep 4
    # Grab URL now so we can set VITE_HMR_HOST before Vite launches
    NGROK_RAW=$(curl -s "http://localhost:$NGROK_API_PORT/api/tunnels" 2>/dev/null \
      | python3 -c "
import sys, json
d = json.load(sys.stdin)
for t in d.get('tunnels', []):
    if '$FRONTEND_USER_PORT' in t.get('config', {}).get('addr', ''):
        print(t['public_url'])
        break
" 2>/dev/null || echo "")
    if [ -n "$NGROK_RAW" ]; then
      PUBLIC_FRONTEND_URL="$NGROK_RAW"
      # Strip protocol → just the hostname
      HMR_HOST="${NGROK_RAW#https://}"
      HMR_HOST="${HMR_HOST#http://}"
      log "frontend-user public URL: ${YELLOW}$NGROK_RAW${NC}"
    fi
  fi
fi

# ─────────────────────────────────────────────────────────────────────────────
# 2. frontend-user  (VITE_HMR_HOST set so HMR WebSocket uses tunnel)
# ─────────────────────────────────────────────────────────────────────────────
log "Starting frontend-user..."
(
  cd "$PROJECT_ROOT/apps/frontend-user"
  BACKEND_PORT="$BACKEND_PORT" FRONTEND_USER_PORT="$FRONTEND_USER_PORT" TELEGRAM_BOT_PORT="$TELEGRAM_BOT_PORT" VITE_HMR_HOST="$HMR_HOST" npm run dev -- --port "$FRONTEND_USER_PORT" --strictPort > "$LOG_DIR/frontend-user.log" 2>&1
) &
PIDS+=($!)
info "frontend-user log → logs/frontend-user.log"

# ─────────────────────────────────────────────────────────────────────────────
# 3. frontend-admin
# ─────────────────────────────────────────────────────────────────────────────
log "Starting frontend-admin..."
(
  cd "$PROJECT_ROOT/apps/frontend-admin"
  npm run dev -- --port "$FRONTEND_ADMIN_PORT" --strictPort > "$LOG_DIR/frontend-admin.log" 2>&1
) &
PIDS+=($!)
info "frontend-admin log → logs/frontend-admin.log"

# ─────────────────────────────────────────────────────────────────────────────
# 4. Telegram bot
# ─────────────────────────────────────────────────────────────────────────────
if [ "$USE_BOT" = true ]; then
  log "Starting Telegram bot..."
  (
    cd "$PROJECT_ROOT/apps/telegram-bot"
    # Activate venv if it exists
    if [ -d ".venv" ]; then
      source .venv/bin/activate
    fi
    python -m uvicorn main:app --host 0.0.0.0 --port "$TELEGRAM_BOT_PORT" > "$LOG_DIR/telegram-bot.log" 2>&1
  ) &
  PIDS+=($!)
  info "Telegram bot log → logs/telegram-bot.log"
fi

# ─────────────────────────────────────────────────────────────────────────────
# 5. Wait for services before finishing tunnel setup
# ─────────────────────────────────────────────────────────────────────────────
echo ""
log "Waiting for services to start..."
wait_for_port "$BACKEND_PORT" "backend"       120
wait_for_port "$FRONTEND_USER_PORT" "frontend-user"  60
wait_for_port "$FRONTEND_ADMIN_PORT" "frontend-admin" 30
if [ "$USE_BOT" = true ]; then
  wait_for_port "$TELEGRAM_BOT_PORT" "telegram-bot" 20
fi

# ─────────────────────────────────────────────────────────────────────────────
# 6. Complete tunnel setup (register webhook, update .env)
# ─────────────────────────────────────────────────────────────────────────────

if [ "$USE_CLOUDFLARE" = true ]; then
  if ! command -v cloudflared &>/dev/null; then
    err "cloudflared not found in PATH"
    err "Install: wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb && sudo dpkg -i cloudflared-linux-amd64.deb"
    err "See CLOUDFLARE-TUNNEL-SETUP.md for full setup guide"
  else
    # Wait for cloudflare URL to appear in logs
    for i in {1..30}; do
      sleep 1
      if grep -q "https://" "$LOG_DIR/cloudflare-tunnel.log" 2>/dev/null; then
        PUBLIC_FRONTEND_URL=$(grep -oP 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_DIR/cloudflare-tunnel.log" | head -1)
        HMR_HOST="${PUBLIC_FRONTEND_URL#https://}"
        break
      fi
    done

    if [ -n "$PUBLIC_FRONTEND_URL" ]; then
      log "frontend-user public URL: ${YELLOW}$PUBLIC_FRONTEND_URL${NC}"

      ENV_FILE="$PROJECT_ROOT/apps/telegram-bot/.env"
      if [ -f "$ENV_FILE" ]; then
        sed -i "s|^FRONTEND_BASE_URL=.*|FRONTEND_BASE_URL=$PUBLIC_FRONTEND_URL|" "$ENV_FILE"
        log "Updated telegram-bot/.env FRONTEND_BASE_URL → $PUBLIC_FRONTEND_URL"

        if [ "$USE_BOT" = true ]; then
          TELEGRAM_BOT_TOKEN=$(
            awk -F= '/^TELEGRAM_BOT_TOKEN=/{print substr($0, index($0, "=") + 1); exit}' "$ENV_FILE" \
              | tr -d '\r'
          )

          if [ -n "$TELEGRAM_BOT_TOKEN" ]; then
            WEBHOOK_URL="$PUBLIC_FRONTEND_URL/telegram/webhook"
            WEBHOOK_RESPONSE=$(
              curl -sS -G --config - 2>/dev/null <<EOF || true
url = "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook"
data-urlencode = "url=$WEBHOOK_URL"
EOF
            )

            if printf '%s' "$WEBHOOK_RESPONSE" | python3 -c 'import json, sys; sys.exit(0 if json.load(sys.stdin).get("ok") else 1)' 2>/dev/null; then
              log "Telegram webhook registered: $WEBHOOK_URL"
              log "Telegram webhook routes through frontend-user to telegram-bot port $TELEGRAM_BOT_PORT"
            else
              warn "Telegram webhook registration failed. Check logs/cloudflare-tunnel.log."
            fi
          fi
        fi
      fi
    else
      warn "Could not get Cloudflare Tunnel URL. Check logs/cloudflare-tunnel.log"
    fi
  fi

elif [ "$USE_NGROK" = true ] && [ -n "$PUBLIC_FRONTEND_URL" ]; then
  # URL already captured pre-flight; just handle webhook registration
  ENV_FILE="$PROJECT_ROOT/apps/telegram-bot/.env"
  if [ -f "$ENV_FILE" ]; then
    sed -i "s|^FRONTEND_BASE_URL=.*|FRONTEND_BASE_URL=$PUBLIC_FRONTEND_URL|" "$ENV_FILE"
    log "Updated telegram-bot/.env FRONTEND_BASE_URL → $PUBLIC_FRONTEND_URL"

    if [ "$USE_BOT" = true ]; then
      TELEGRAM_BOT_TOKEN=$(
        awk -F= '/^TELEGRAM_BOT_TOKEN=/{print substr($0, index($0, "=") + 1); exit}' "$ENV_FILE" \
          | tr -d '\r'
      )

      if [ -n "$TELEGRAM_BOT_TOKEN" ]; then
        WEBHOOK_URL="$PUBLIC_FRONTEND_URL/telegram/webhook"
        WEBHOOK_RESPONSE=$(
          curl -sS -G --config - 2>/dev/null <<EOF || true
url = "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook"
data-urlencode = "url=$WEBHOOK_URL"
EOF
        )

        if printf '%s' "$WEBHOOK_RESPONSE" | python3 -c 'import json, sys; sys.exit(0 if json.load(sys.stdin).get("ok") else 1)' 2>/dev/null; then
          log "Telegram webhook registered: $WEBHOOK_URL"
          log "Telegram webhook routes through frontend-user to telegram-bot port $TELEGRAM_BOT_PORT"
        else
          warn "Telegram webhook registration failed. Check TELEGRAM_BOT_TOKEN and logs/ngrok-frontend.log."
        fi
      else
        warn "TELEGRAM_BOT_TOKEN is empty; skipping Telegram webhook registration."
      fi
    fi
  fi
elif [ "$USE_NGROK" = true ]; then
  warn "Could not get ngrok URL for frontend (free plan allows 1 tunnel)"
fi

# ─────────────────────────────────────────────────────────────────────────────
# Summary
# ─────────────────────────────────────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Koupreng Dev Environment Started${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "  ${CYAN}Backend     ${NC}→ http://localhost:$BACKEND_PORT"
echo -e "  ${CYAN}Frontend    ${NC}→ http://localhost:$FRONTEND_USER_PORT"
echo -e "  ${CYAN}Admin       ${NC}→ http://localhost:$FRONTEND_ADMIN_PORT"
[ "$USE_BOT" = true ] && \
echo -e "  ${CYAN}Telegram bot${NC}→ http://localhost:$TELEGRAM_BOT_PORT"
[ -n "$PUBLIC_FRONTEND_URL" ] && \
echo -e "  ${CYAN}Public URL  ${NC}→ $PUBLIC_FRONTEND_URL"
[ -n "${WEBHOOK_URL:-}" ] && \
echo -e "  ${CYAN}Bot webhook ${NC}→ $WEBHOOK_URL → localhost:$TELEGRAM_BOT_PORT"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "  Logs in ${YELLOW}./logs/${NC}"
echo -e "  Press ${RED}Ctrl+C${NC} to stop all services"
echo ""

# Keep script alive until Ctrl+C
wait

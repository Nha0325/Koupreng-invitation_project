#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# install-cloudflare-tunnel.sh — Quick installer for Cloudflare Tunnel
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

log()  { echo -e "${GREEN}[INSTALL]${NC} $*"; }
warn() { echo -e "${YELLOW}[INSTALL]${NC} $*"; }
info() { echo -e "${CYAN}[INSTALL]${NC} $*"; }

echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Cloudflare Tunnel Installer${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

# Check if cloudflared is already installed
if command -v cloudflared &>/dev/null; then
  CURRENT_VERSION=$(cloudflared --version 2>&1 | grep -oP 'cloudflared version \K[0-9.]+' || echo "unknown")
  warn "cloudflared is already installed (version: $CURRENT_VERSION)"
  read -p "Do you want to reinstall/update it? (y/N): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log "Installation cancelled"
    exit 0
  fi
fi

# Download and install cloudflared
log "Downloading cloudflared for Linux (amd64)..."
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

wget -q --show-progress https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

log "Installing cloudflared (requires sudo)..."
sudo dpkg -i cloudflared-linux-amd64.deb

# Cleanup
cd - > /dev/null
rm -rf "$TEMP_DIR"

# Verify installation
if command -v cloudflared &>/dev/null; then
  VERSION=$(cloudflared --version 2>&1 | grep -oP 'cloudflared version \K[0-9.]+' || echo "unknown")
  log "✓ cloudflared installed successfully (version: $VERSION)"
  echo ""
  info "Next steps:"
  echo ""
  echo "  1. Test the tunnel (quick start, no account needed):"
  echo -e "     ${CYAN}./dev.sh --cloudflare${NC}"
  echo ""
  echo "  2. Or use it standalone:"
  echo -e "     ${CYAN}cloudflared tunnel --url http://localhost:5173${NC}"
  echo ""
  echo "  3. For custom domains (optional, requires Cloudflare account):"
  echo -e "     ${CYAN}cloudflared tunnel login${NC}"
  echo -e "     See ${YELLOW}CLOUDFLARE-TUNNEL-SETUP.md${NC} for details"
  echo ""
else
  warn "Installation completed but cloudflared not found in PATH"
  warn "Try running: source ~/.bashrc"
fi

echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""

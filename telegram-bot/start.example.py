"""
Quick-start helper for the Koupreng Telegram bot.

Usage:
    python start.py

This script:
1. Loads .env
2. Validates that TELEGRAM_BOT_TOKEN is set
3. Verifies the bot token with Telegram
4. Starts uvicorn on port 8000
"""

import os
import subprocess
import sys
import urllib.request
import urllib.error
import json
from pathlib import Path

from dotenv import load_dotenv

BOT_DIR = Path(__file__).resolve().parent
load_dotenv(BOT_DIR / ".env")

BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()

def check_token():
    if not BOT_TOKEN:
        print("❌  TELEGRAM_BOT_TOKEN is not set in .env")
        sys.exit(1)

    url = f"https://api.telegram.org/bot{BOT_TOKEN}/getMe"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.loads(resp.read())
            if data.get("ok"):
                bot = data["result"]
                print(f"✅  Bot token valid: @{bot.get('username')} (id={bot.get('id')})")
            else:
                print(f"❌  Telegram rejected the token: {data}")
                sys.exit(1)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"❌  Token check failed (HTTP {e.code}): {body}")
        sys.exit(1)
    except Exception as e:
        print(f"⚠️   Could not reach Telegram to verify token: {e}")

def print_webhook_instructions():
    print("\n─────────────────────────────────────────────────────────")
    print("NEXT STEPS — run each in a separate terminal:")
    print()
    print("1. Expose this server with ngrok:")
    print("      ngrok http 8000")
    print()
    print("2. Copy the HTTPS URL (e.g. https://abc123.ngrok-free.app)")
    print()
    print("3. Register the webhook with Telegram:")
    print("      curl \"https://api.telegram.org/bot<TOKEN>/setWebhook?url=<NGROK_URL>/telegram/webhook\"")
    print()
    print("   Or open this URL in your browser after replacing placeholders:")
    print(f"      https://api.telegram.org/bot{BOT_TOKEN}/setWebhook?url=YOUR_NGROK_URL/telegram/webhook")
    print()
    print("4. Check webhook status:")
    print(f"      https://api.telegram.org/bot{BOT_TOKEN}/getWebhookInfo")
    print()
    print("5. Send /start to your bot in Telegram — it should reply.")
    print("─────────────────────────────────────────────────────────\n")

def start_server():
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        if s.connect_ex(("localhost", 8000)) == 0:
            print("⚠️   Port 8000 is already in use.")
            print("     Kill the existing process first:")
            print("     pkill -f 'uvicorn main:app'")
            sys.exit(1)
    print("🚀  Starting uvicorn on http://0.0.0.0:8000 ...")
    subprocess.run(
        [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        cwd=BOT_DIR,
    )

if __name__ == "__main__":
    check_token()
    print_webhook_instructions()
    start_server()

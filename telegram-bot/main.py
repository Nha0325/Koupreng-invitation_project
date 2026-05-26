import os
from decimal import Decimal, InvalidOperation

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Request

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
SPRING_API_BASE_URL = os.getenv("SPRING_API_BASE_URL", "http://localhost:8080").rstrip("/")
ADMIN_PAYMENT_SECRET = os.getenv("ADMIN_PAYMENT_SECRET", "")
TELEGRAM_ALLOWED_ADMIN_IDS = {
    value.strip()
    for value in os.getenv("TELEGRAM_ALLOWED_ADMIN_IDS", "").split(",")
    if value.strip()
}

app = FastAPI(title="Koupreng payment Telegram webhook")


@app.post("/telegram/webhook")
async def telegram_webhook(request: Request):
    update = await request.json()
    message = update.get("message") or update.get("edited_message") or {}
    chat = message.get("chat") or {}
    sender = message.get("from") or {}
    chat_id = chat.get("id")
    sender_id = str(sender.get("id") or "")
    username = sender.get("username") or sender_id
    text = (message.get("text") or message.get("caption") or "").strip()

    if not chat_id or not text:
        return {"ok": True}

    if text.startswith("/paid"):
        if sender_id not in TELEGRAM_ALLOWED_ADMIN_IDS:
            await send_message(chat_id, "❌ You are not allowed to confirm payments.")
            return {"ok": True}
        await handle_paid_command(chat_id, text, username)
        return {"ok": True}

    if sender_id not in TELEGRAM_ALLOWED_ADMIN_IDS:
        await send_message(chat_id, "❌ You are not allowed to submit payment notifications.")
        return {"ok": True}

    await handle_detect_message(chat_id, text, username)
    return {"ok": True}


async def handle_paid_command(chat_id, text, username):
    parts = text.split()
    if len(parts) < 3:
        await send_message(chat_id, "Usage: /paid EVT260520001 5.00")
        return

    order_code = parts[1].upper()
    try:
        amount = str(Decimal(parts[2]))
    except InvalidOperation:
        await send_message(chat_id, "❌ Invalid amount.")
        return

    result = await post_to_backend(
        "/api/v1/admin/template-payments/confirm",
        {
            "orderCode": order_code,
            "amount": amount,
            "confirmedBy": username,
        },
    )
    await reply_from_backend(chat_id, result, success_prefix=f"✅ Payment confirmed for {order_code}")


async def handle_detect_message(chat_id, text, username):
    result = await post_to_backend(
        "/api/v1/admin/template-payments/telegram-detect",
        {
            "rawMessage": text,
            "detectedBy": username,
        },
    )
    data = result.get("data") or {}
    if result.get("ok") and data.get("status") == "PAID":
        await send_message(chat_id, f"✅ Payment detected and confirmed for {data.get('orderCode')}")
        return
    if result.get("ok") and data.get("status") == "PAID_PENDING_REVIEW":
        await send_message(chat_id, f"⏳ Payment detected and waiting for admin review: {data.get('orderCode')}")
        return
    await reply_from_backend(chat_id, result, success_prefix="✅ Payment notification processed")


async def post_to_backend(path, payload):
    headers = {"X-ADMIN-PAYMENT-SECRET": ADMIN_PAYMENT_SECRET}
    async with httpx.AsyncClient(timeout=15) as client:
        try:
            response = await client.post(f"{SPRING_API_BASE_URL}{path}", json=payload, headers=headers)
            body = response.json()
        except httpx.HTTPError as exc:
            return {"ok": False, "message": str(exc)}
        except ValueError:
            return {"ok": False, "message": "Backend returned a non-JSON response"}

    if response.status_code >= 400:
        return {"ok": False, "message": body.get("message") or response.reason_phrase}
    return {"ok": True, "data": body.get("data") or body}


async def reply_from_backend(chat_id, result, success_prefix):
    if result.get("ok"):
        data = result.get("data") or {}
        message = data.get("message") or success_prefix
        await send_message(chat_id, f"{success_prefix}\n{message}")
    else:
        await send_message(chat_id, f"❌ Failed: {result.get('message')}")


async def send_message(chat_id, text):
    if not TELEGRAM_BOT_TOKEN:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    async with httpx.AsyncClient(timeout=10) as client:
        await client.post(url, json={"chat_id": chat_id, "text": text})

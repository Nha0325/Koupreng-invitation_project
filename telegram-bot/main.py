import logging
import os
import re
from decimal import Decimal, InvalidOperation

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, Request

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
SPRING_API_BASE_URL = os.getenv("SPRING_API_BASE_URL", "http://localhost:8080").rstrip("/")
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:5173").rstrip("/")
ADMIN_PAYMENT_SECRET = os.getenv("ADMIN_PAYMENT_SECRET", "")
TELEGRAM_ALLOWED_GROUP_IDS = {
    value
    for value in (item.strip() for item in os.getenv("TELEGRAM_ALLOWED_GROUP_IDS", "").split(","))
    if value
}
TELEGRAM_ALLOWED_ADMIN_IDS = {
    value
    for value in (item.strip() for item in os.getenv("TELEGRAM_ALLOWED_ADMIN_IDS", "").split(","))
    if value
}
TELEGRAM_ALLOWED_PAYMENT_BOT_IDS = {
    value
    for value in (item.strip() for item in os.getenv("TELEGRAM_ALLOWED_PAYMENT_BOT_IDS", "").split(","))
    if value
}
TELEGRAM_ALLOWED_PAYMENT_BOT_USERNAMES = {
    value.lower().lstrip("@")
    for value in (
        item.strip()
        for item in os.getenv("TELEGRAM_ALLOWED_PAYMENT_BOT_USERNAMES", "PayWayByABA_bot").split(",")
    )
    if value
}

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO"))
logger = logging.getLogger("koupreng.telegram_bot")

ORDER_CODE_RE = re.compile(r"\bEVT[0-9]{9,10}\b", re.IGNORECASE)
PAYWAY_TRX_RE = re.compile(
    r"\b(?:Transaction|Txn|Trx)\.?\s*(?:ID|No\.?|Number)?\s*[:#=]?\s*([A-Za-z0-9_-]+)\b",
    re.IGNORECASE,
)
PAYWAY_APV_RE = re.compile(
    r"\b(?:APV|Approval\s*(?:Code|No\.?|Number)?)\s*[:#=]?\s*([A-Za-z0-9_-]+)\b",
    re.IGNORECASE,
)
PAYER_RE = re.compile(r"\bpaid by\s+(.+?)(?:\s+via\b|\s+on\b|[.,]|$)", re.IGNORECASE)
AMOUNT_PATTERNS = [
    re.compile(r"\b(?P<currency>USD|KHR)\s*(?P<amount>[0-9]+(?:\.[0-9]{1,2})?)\b", re.IGNORECASE),
    re.compile(r"\b(?P<amount>[0-9]+(?:\.[0-9]{1,2})?)\s*(?P<currency>USD|KHR)\b", re.IGNORECASE),
    re.compile(r"(?P<currency>\$)\s*(?P<amount>[0-9]+(?:\.[0-9]{1,2})?)\b"),
    re.compile(
        r"\b(?:Amount|Paid|Total|Received)\s*[:=]?\s*(?P<currency>USD|KHR|US\$|\$)\s*(?P<amount>[0-9]+(?:\.[0-9]{1,2})?)\b",
        re.IGNORECASE,
    ),
    re.compile(
        r"\b(?:Amount|Paid|Total|Received)\s*[:=]?\s*(?P<amount>[0-9]+(?:\.[0-9]{1,2})?)\s*(?P<currency>USD|KHR)\b",
        re.IGNORECASE,
    ),
]

app = FastAPI(title="Koupreng payment Telegram webhook")


@app.get("/health")
async def health():
    return {"ok": True}


@app.post("/telegram/webhook")
async def telegram_webhook(request: Request):
    update = await request.json()
    message = (
        update.get("message")
        or update.get("edited_message")
        or update.get("channel_post")
        or update.get("edited_channel_post")
        or {}
    )
    chat = message.get("chat") or {}
    sender = message.get("from") or {}
    chat_id = str(chat.get("id") or "")
    sender_id = str(sender.get("id") or "")
    username = str(sender.get("username") or "").lstrip("@")
    sender_display = username or str(sender.get("first_name") or "").strip() or sender_id or "telegram"
    message_id = str(message.get("message_id") or "")
    text = (message.get("text") or message.get("caption") or "").strip()
    trusted_payment_sender = payment_sender_allowed(sender)

    if not chat_id or not text:
        logger.info("Ignoring update without chat/text: keys=%s", list(update.keys()))
        return {"ok": True}

    if not group_allowed(chat_id):
        logger.info("Ignoring message from disallowed chat_id=%s sender=%s text=%s", chat_id, sender_id, short_text(text))
        return {"ok": True}

    logger.info(
        "Received Telegram message chat_id=%s sender_id=%s username=%s is_bot=%s trusted_payment_bot=%s text=%s",
        chat_id,
        sender_id,
        sender_display,
        sender.get("is_bot"),
        trusted_payment_sender,
        short_text(text),
    )

    if command_payload(text, "/start"):
        await send_message(
            chat_id,
            (
                "Welcome to Koupreng Invitation!\n\n"
                f"Open the website to login and manage invitations:\n{FRONTEND_BASE_URL}\n\n"
                "Use the website login page to authenticate with Google or Telegram."
            ),
            message_id,
        )
        return {"ok": True}

    if text.startswith("/id") or text.startswith("/debug"):
        await send_message(
            chat_id,
            (
                f"Chat ID: {chat_id}\n"
                f"Sender ID: {sender_id}\n"
                f"Sender username: {username or '(none)'}\n"
                f"Sender is bot: {sender.get('is_bot')}\n"
                f"Allowed group: {group_allowed(chat_id)}\n"
                f"Allowed admin: {sender_id in TELEGRAM_ALLOWED_ADMIN_IDS}\n"
                f"Trusted payment bot: {trusted_payment_sender}"
            ),
            message_id,
        )
        return {"ok": True}

    if text.startswith("/paid"):
        if sender_id not in TELEGRAM_ALLOWED_ADMIN_IDS:
            await send_message(chat_id, "You are not allowed to confirm payments.", message_id)
            return {"ok": True}
        await handle_paid_command(chat_id, message_id, text, sender_display)
        return {"ok": True}

    if text.startswith("/detect"):
        if sender_id not in TELEGRAM_ALLOWED_ADMIN_IDS:
            await send_message(chat_id, "You are not allowed to detect payments.", message_id)
            return {"ok": True}
        detect_text = command_payload(text, "/detect")
        if not detect_text:
            await send_message(chat_id, "Usage: /detect ABA alert text with amount and optional EVT order code", message_id)
            return {"ok": True}
        if not looks_like_payment_alert(detect_text):
            await send_message(chat_id, "Could not find a payment amount in that message.", message_id)
            return {"ok": True}
        payment = parse_payment_alert(detect_text)
        if not payment:
            await send_message(chat_id, "Could not find a payment amount in that message.", message_id)
            return {"ok": True}
        if not payment.get("orderCode"):
            logger.info(
                "Payment detected by admin debug but no order code found chat_id=%s sender_id=%s amount=%s %s",
                chat_id,
                sender_id,
                payment.get("amount"),
                payment.get("currency"),
            )
            await send_message(chat_id, "Payment detected but no order code found. Please check manually.", message_id)
            return {"ok": True}
        await handle_detect_message(
            chat_id,
            message_id,
            detect_text,
            username,
            sender_id,
            detected_by=f"telegram-admin-detect:{sender_identity(username, sender_id)}",
            payment=payment,
        )
        return {"ok": True}

    if not looks_like_payment_alert(text):
        logger.info("Message did not look like payment alert: %s", short_text(text))
        return {"ok": True}

    if not trusted_payment_sender:
        logger.warning(
            "Ignoring payment-like message from untrusted sender_id=%s username=%s is_bot=%s text=%s",
            sender_id,
            sender_display,
            sender.get("is_bot"),
            short_text(text),
        )
        return {"ok": True}

    payment = parse_payment_alert(text)
    logger.info(
        "Trusted payment alert candidate chat_id=%s sender_id=%s username=%s trusted=%s order_code=%s amount=%s %s",
        chat_id,
        sender_id,
        username or "(none)",
        True,
        payment.get("orderCode") if payment else None,
        payment.get("amount") if payment else None,
        payment.get("currency") if payment else None,
    )
    if not payment:
        await send_message(chat_id, "Could not find a payment amount in that message.", message_id)
        return {"ok": True}
    if not payment.get("orderCode"):
        logger.info(
            "Trusted payment alert missing order code chat_id=%s sender_id=%s username=%s amount=%s %s",
            chat_id,
            sender_id,
            username or "(none)",
            payment.get("amount"),
            payment.get("currency"),
        )
        await send_message(chat_id, "Payment detected but no order code found. Please check manually.", message_id)
        return {"ok": True}

    await handle_detect_message(
        chat_id,
        message_id,
        text,
        username,
        sender_id,
        detected_by=f"telegram-payway-bot:{sender_identity(username, sender_id)}",
        payment=payment,
    )
    return {"ok": True}


def group_allowed(chat_id: str) -> bool:
    return not TELEGRAM_ALLOWED_GROUP_IDS or chat_id in TELEGRAM_ALLOWED_GROUP_IDS


def looks_like_payment_alert(text: str) -> bool:
    payment_words = re.search(r"\b(ABA|PayWay|payment|paid|received|Trx|APV|approval)\b", text, re.IGNORECASE)
    return payment_words is not None and detect_amount(text) is not None


def detect_amount(text: str) -> str | None:
    payment = parse_payment_alert(text)
    return payment["amount"] if payment else None


def parse_payment_alert(text: str) -> dict | None:
    order_match = ORDER_CODE_RE.search(text)
    amount_match = None
    for pattern in AMOUNT_PATTERNS:
        match = pattern.search(text)
        if match:
            amount_match = match
            break
    if not amount_match:
        return None

    amount_groups = amount_match.groupdict()
    currency = normalize_currency(amount_groups.get("currency") or "USD")
    try:
        amount = str(Decimal(amount_groups["amount"]))
    except InvalidOperation:
        return None

    trx_match = PAYWAY_TRX_RE.search(text)
    apv_match = PAYWAY_APV_RE.search(text)
    payer_match = PAYER_RE.search(text)
    return {
        "orderCode": order_match.group(0).upper() if order_match else None,
        "amount": amount,
        "currency": currency,
        "paywayTransactionId": trx_match.group(1) if trx_match else None,
        "paywayApprovalCode": apv_match.group(1) if apv_match else None,
        "payerName": payer_match.group(1).strip() if payer_match else None,
    }


def payment_sender_allowed(sender: dict) -> bool:
    sender_id = str(sender.get("id") or "")
    username = str(sender.get("username") or "").lower().lstrip("@")
    is_bot = bool(sender.get("is_bot"))
    if TELEGRAM_ALLOWED_PAYMENT_BOT_IDS:
        return sender_id in TELEGRAM_ALLOWED_PAYMENT_BOT_IDS
    if TELEGRAM_ALLOWED_PAYMENT_BOT_USERNAMES and username in TELEGRAM_ALLOWED_PAYMENT_BOT_USERNAMES:
        return is_bot
    return False


def normalize_currency(value: str) -> str:
    marker = (value or "USD").upper()
    return "USD" if marker in {"$", "US$"} else marker


def sender_identity(username: str, sender_id: str) -> str:
    return username or sender_id or "telegram"


def command_payload(text: str, command: str) -> str:
    first, *rest = text.split(maxsplit=1)
    command_name = first.split("@", 1)[0]
    if command_name != command:
        return ""
    return rest[0].strip() if rest else ""


def short_text(text: str, limit: int = 180) -> str:
    normalized = " ".join(text.split())
    return normalized[:limit] + ("..." if len(normalized) > limit else "")


async def handle_paid_command(chat_id: str, message_id: str, text: str, username: str):
    parts = text.split()
    if len(parts) < 3:
        await send_message(chat_id, "Usage: /paid EVT260520001 0.01", message_id)
        return

    order_code = parts[1].upper()
    try:
        amount = str(Decimal(parts[2]))
    except InvalidOperation:
        await send_message(chat_id, "Invalid amount.", message_id)
        return

    result = await post_to_backend(
        "/api/v1/internal/template-payments/confirm",
        {
            "orderCode": order_code,
            "amount": amount,
            "confirmedBy": username,
        },
    )
    await reply_from_backend(chat_id, message_id, result, success_prefix=f"Payment confirmed: {order_code}")


async def handle_detect_message(
    chat_id: str,
    message_id: str,
    text: str,
    username: str,
    sender_id: str,
    detected_by: str = "telegram-bot",
    payment: dict | None = None,
):
    payment = payment or parse_payment_alert(text)
    if not payment:
        await send_message(chat_id, "Could not find a payment amount in that message.", message_id)
        return

    result = await post_to_backend(
        "/api/v1/internal/template-payments/telegram-detect",
        {
            "rawMessage": text,
            "detectedBy": detected_by,
            "telegramChatId": chat_id,
            "telegramMessageId": message_id,
            "telegramSenderUsername": username,
            "telegramSenderId": sender_id,
            "detectedOrderCode": payment.get("orderCode"),
            "detectedAmount": payment["amount"],
            "detectedCurrency": payment["currency"],
            "paywayTransactionId": payment["paywayTransactionId"],
            "paywayApprovalCode": payment["paywayApprovalCode"],
        },
    )
    data = result.get("data") or {}
    order_code = data.get("orderCode") or payment.get("orderCode")
    logger.info(
        "Backend telegram-detect response ok=%s status=%s order_code=%s amount=%s %s message=%s",
        result.get("ok"),
        data.get("status"),
        order_code,
        payment.get("amount"),
        payment.get("currency"),
        result.get("message") or data.get("message"),
    )

    if result.get("ok") and data.get("status") == "PAID":
        await send_message(chat_id, payment_confirmed_reply(order_code, payment), message_id)
        return
    if result.get("ok") and data.get("status") == "PAID_PENDING_REVIEW":
        await send_message(chat_id, payment_pending_review_reply(order_code, payment), message_id)
        return
    await send_message(
        chat_id,
        f"❌ Payment verification failed\nReason: {result.get('message') or data.get('message') or 'Unknown backend response'}",
        message_id,
    )


def payment_confirmed_reply(order_code: str, payment: dict) -> str:
    lines = [
        "✅ Payment confirmed automatically",
        f"Order: {order_code}",
        f"Amount: {payment['currency']} {payment['amount']}",
        "Template unlocked.",
    ]
    append_payment_metadata(lines, payment)
    return "\n".join(lines)


def payment_pending_review_reply(order_code: str, payment: dict) -> str:
    lines = [
        "⚠️ Payment detected but pending review",
        f"Order: {order_code}",
        f"Amount: {payment['currency']} {payment['amount']}",
    ]
    append_payment_metadata(lines, payment)
    return "\n".join(lines)


def append_payment_metadata(lines: list[str], payment: dict):
    if payment.get("paywayTransactionId"):
        lines.append(f"Trx ID: {payment['paywayTransactionId']}")
    if payment.get("paywayApprovalCode"):
        lines.append(f"APV: {payment['paywayApprovalCode']}")


async def post_to_backend(path: str, payload: dict):
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


async def reply_from_backend(chat_id: str, message_id: str, result: dict, success_prefix: str):
    if result.get("ok"):
        data = result.get("data") or {}
        message = data.get("message") or success_prefix
        await send_message(chat_id, f"{success_prefix}\n{message}", message_id)
    else:
        await send_message(chat_id, f"Failed: {result.get('message')}", message_id)


async def send_message(chat_id: str, text: str, reply_to_message_id: str | None = None):
    if not TELEGRAM_BOT_TOKEN:
        return
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    if reply_to_message_id:
        payload["reply_to_message_id"] = reply_to_message_id
        payload["allow_sending_without_reply"] = True
    async with httpx.AsyncClient(timeout=10) as client:
        await client.post(url, json=payload)

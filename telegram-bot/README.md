# Koupreng Payment Telegram Bot

Optional MVP webhook helper for confirming static ABA PayWay template payments.

This is not official ABA PayWay webhook verification. It only helps trusted admins call the Spring Boot admin payment endpoints after checking an order code and amount.

## Run Locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Expose locally:

```bash
ngrok http 8000
```

Set Telegram webhook:

```bash
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://YOUR_NGROK_URL/telegram/webhook
```

## Environment

Copy `.env.example` to `.env` and set:

- `TELEGRAM_BOT_TOKEN`
- `SPRING_API_BASE_URL`
- `ADMIN_PAYMENT_SECRET`
- `TELEGRAM_ALLOWED_ADMIN_IDS`

## Commands

Manual trusted confirmation:

```text
/paid EVT260520001 5.00
```

Forwarded/copied ABA notification text:

```text
ABA payment received USD 5.00 Note: EVT260520001
```

Only Telegram sender IDs in `TELEGRAM_ALLOWED_ADMIN_IDS` can confirm or submit payment notifications.

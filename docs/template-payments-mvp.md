# Template Payments MVP

This MVP uses a static ABA PayWay payment link:

```text
https://link.payway.com.kh/ABAPAYrD450560q
```

It is not official ABA PayWay webhook verification and not dynamic QR/API integration. The user must copy the generated order code into the ABA payment note. Backend status changes to `PAID` only after admin or Telegram-bot confirmation.

## Create Order

```bash
curl -X POST http://localhost:8080/api/v1/template-payments/static/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "templateId": 10,
    "templateName": "Khmer Wedding Gold",
    "packageName": "Premium",
    "amount": 0.01
  }'
```

## Get Order

```bash
curl -X GET http://localhost:8080/api/v1/template-payments/EVT260520001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Manual Confirm

```bash
curl -X POST http://localhost:8080/api/v1/admin/template-payments/confirm \
  -H "Content-Type: application/json" \
  -H "X-ADMIN-PAYMENT-SECRET: your-secret" \
  -d '{
    "orderCode": "EVT260520001",
    "amount": 0.01,
    "confirmedBy": "admin"
  }'
```

## Telegram Detect

```bash
curl -X POST http://localhost:8080/api/v1/admin/template-payments/telegram-detect \
  -H "Content-Type: application/json" \
  -H "X-ADMIN-PAYMENT-SECRET: your-secret" \
  -d '{
    "rawMessage": "ABA payment received USD 0.01 Note: EVT260520001",
    "detectedBy": "telegram_admin"
  }'
```

## Get Paid Templates

```bash
curl -X GET http://localhost:8080/api/v1/me/templates/paid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Check Access

```bash
curl -X GET http://localhost:8080/api/v1/me/templates/10/access \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notes

- Frontend never marks an order as `PAID`.
- `PAID_PENDING_REVIEW` does not unlock a template.
- Only backend `PAID` status creates `user_template_access`.
- `X-ADMIN-PAYMENT-SECRET` is MVP-only protection for admin payment endpoints.

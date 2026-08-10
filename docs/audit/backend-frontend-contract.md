# Backend-to-frontend contract

Audit date: 2026-08-10

This document describes the contracts consumed by `apps/frontend-user`, `apps/frontend-admin`, and `apps/telegram-bot`. The Java DTO classes remain the executable source of request/response field truth. Paths below include the `/api` prefix configured by the frontend clients.

## Common protocol

- Authenticated browser calls send the HttpOnly authentication cookie and may also use a bearer token. Callers must not infer authorization from browser storage.
- Normal JSON responses use `ApiResponse<T>` (`success`, `message`, `data`). File exports and QR/image endpoints return binary content.
- Date/time values are ISO-8601 strings. Money is a JSON decimal backed by `BigDecimal`; callers must not use floating-point equality or invent amounts.
- Enum values are uppercase backend values. Clients must tolerate newly added values and display an explicit fallback.
- List responses are currently arrays unless the endpoint explicitly exposes parameters. Do not assume server pagination until a versioned/additive paging contract is introduced.
- All resource IDs in nested paths are independently authorized. A valid `guestId`, `itemId`, `tableId`, `assignmentId`, or `mediaId` from another invitation is not accepted.

## Error contract

Errors have this additive shape:

```json
{
  "timestamp": "2026-08-10T00:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "code": "VALIDATION_ERROR",
  "message": "Request validation failed",
  "path": "/api/v1/example",
  "fieldErrors": {},
  "fields": {}
}
```

`fields` is retained for existing callers; new callers should prefer `fieldErrors`. Expected status families are `400` validation/domain input, `401` unauthenticated, `403` unauthorized/not owner, `404` unknown or out-of-scope resource, `409` conflicting business state, `429` throttled, and `500` sanitized server failure. No client should parse human-readable `message` to control business state; use `status`, `code`, and response DTO fields.

New stable codes introduced by this audit include `RSVP_RATE_LIMITED`, `RATE_LIMIT_UNAVAILABLE`, `GUEST_DUPLICATE`, `CHECKIN_INVALID_TOKEN`, `CHECKIN_WRONG_INVITATION`, `SEATING_CAPACITY_EXCEEDED`, and `ORGANIZATION_OWNER_ROLE_IMMUTABLE`.

## Authentication and account

| Method/path | Auth | Request -> response | Rules / errors | Callers |
|---|---|---|---|---|
| `POST /api/auth/register` | Public, auth-throttled | `RegisterRequest` -> `ApiResponse<AuthResponse>` plus secure auth cookie | Server owns role, active state, password hash; duplicate/invalid input `400`, throttle `429` | user `authApi.js` |
| `POST /api/auth/login` | Public, auth-throttled | `LoginRequest` -> `AuthResponse` plus secure auth cookie | Invalid credentials/inactive account `401`; throttle `429` | user/admin auth services |
| `POST /api/auth/google`, `POST /api/auth/telegram` | Public, auth-throttled | provider login DTO -> `AuthResponse` | Provider proof is verified server-side; invalid proof `401`/`400` | user auth API |
| `POST /api/auth/logout` | Authenticated | no body -> success with cookie cleared | Invalid/revoked token may return `401` | user/admin auth services |
| `GET /api/auth/me`, `PUT /api/auth/me` | Authenticated/current user | profile request where applicable -> auth/profile response | Current principal only | user auth API |
| `POST /api/auth/change-password`, `/forgot-password`, `/reset-password` | Current user or public as appropriate | password/reset DTO -> success | Token/version invalidation is server-owned; reset response never returns token | user auth API |
| `GET/PATCH /api/users/me`, `POST /api/users/me/change-password`, `POST /api/users/me/profile-image` | Authenticated/current user | profile/password/multipart -> profile/success | File type/size validated; duplicate email/username rejected | user `userApi.js` |

## Invitations, templates, media, and delivery

| Method/path family | Auth | Request -> response | Rules / errors | Callers |
|---|---|---|---|---|
| `POST /api/v1/invitations`; `GET /my`; `GET/PUT/DELETE /{id}` | Authenticated owner/admin | `InvitationRequest` -> `InvitationResponse`; lists return arrays | Template entitlement and organization selection validated; nested IDs scoped | `invitationApi.js` |
| `PATCH /api/v1/invitations/{id}/draft|publish|unpublish`; `GET /preview` | Owner/admin | no body -> invitation/preview response | Status transitions, required publish data, and access settings are server-owned | `invitationApi.js` |
| `GET/PUT /api/v1/invitations/{id}/customization` | Owner/admin | customization DTO -> customization response | JSON/customization is persisted server-side | host editor callers |
| `GET /api/v1/public/invitations/{slug}`; `GET /guest-view`; `POST /access/verify` | Public | access DTO where required -> public invitation/access response | Only public/published/access-authorized data returned; wrong passcode is rejected server-side | public invitation/RVSP features |
| `GET /api/v1/templates`; `GET /{templateId}`; `GET /slug/{code}` | Public | no body -> template DTO(s) | Only active public catalog data; access entitlement is checked on protected use | template services |
| `POST /api/v1/invitations/{id}/media/cover|gallery|video|music`; `PUT .../{mediaId}/replace`; `DELETE .../{mediaId}` | Owner/admin | multipart -> `MediaFileResponse`/success | Media and invitation must match; MIME/size validated | `mediaApi.js` |
| `GET /api/v1/invitations/{id}/media`; `GET /api/v1/public/invitations/{slug}/media` | Owner/admin or public published invitation | no body -> media array | Public route exposes only invitation public media | host/public media callers |
| `/api/v1/invitations/{id}/delivery/*` (`prepare`, `summary`, guest share/mark, `email`, `reminders`, `events`) | Owner/admin | delivery/reminder DTOs -> delivery responses | Guest must belong to invitation; send/share state and delivery events are persisted | `deliveryApi.js` |

## Guests, RSVP, check-in, and seating

| Method/path family | Auth | Request -> response | Rules / errors | Callers |
|---|---|---|---|---|
| `POST/GET /api/v1/invitations/{invitationId}/guests`; `GET/PUT/DELETE .../{guestId}` | Owner/admin | validated `GuestRequest` -> `GuestResponse` | Invitation/guest pair is scoped; seat count nonnegative; duplicate nonblank email/phone returns `409 GUEST_DUPLICATE` | `guestApi.js` |
| `GET .../guests/search?keyword=`; `/grouped`; `/send-list`; `GET .../export` | Owner/admin | query -> arrays or file | Results limited to the owned invitation; currently unpaginated | guest/delivery UI |
| `POST .../guests/import` | Owner/admin | `{guests:[GuestRequest...]}` -> import response | Nested validation; 1-1,000 entries; atomic transaction; duplicates rejected | `guestApi.js` |
| `POST .../guests/import-file` | Owner/admin | CSV/XLSX multipart -> import response | Type/size/signature, required name, and duplicate checks apply; full per-row DTO-validation parity and a 1,000-row cap are open follow-up items | host import UI |
| `POST /api/v1/public/invitations/{slug}/rsvp` | Public, dedicated throttle | `RsvpRequest` -> `RsvpResponse` | Published/access/deadline/status/count rules; throttle `429 RSVP_RATE_LIMITED`; fail-closed limiter outage `503 RATE_LIMIT_UNAVAILABLE` | `rsvpApi.js` |
| `POST /api/v1/public/invitations/{slug}/guests/{inviteToken}/rsvp` | Public, dedicated throttle | `RsvpRequest` -> `RsvpResponse` | Token must belong to invitation; deterministic one-RSVP-per-guest update semantics | `rsvpApi.js` |
| Public RSVP summary/wishes GET routes | Public | filter/query -> summary/wish DTOs | Only approved public fields; caller-provided filters do not bypass publication rules | `rsvpApi.js` |
| Authenticated `/api/v1/invitations/{id}/rsvps*` and `/wishes` | Owner/admin | update DTO where applicable -> RSVP/list/summary | RSVP and invitation IDs are jointly scoped | host RSVP/dashboard UI |
| `POST /api/v1/invitations/{id}/check-in/scan` | Owner/admin | `{token,note}` -> `CheckInResponse` | Locked same-invitation guest; `result` is `CHECKED_IN` or `ALREADY_CHECKED_IN`; wrong invitation `409`; invalid token `404` | `guestApi.js`, check-in page |
| `POST .../guests/{guestId}/check-in`; `GET .../check-in/summary|list` | Owner/admin | optional note -> check-in response; GET -> summary/list | One check-in per guest; repeat returns original record and `ALREADY_CHECKED_IN` | guest/check-in UI |
| Seating `/seating`, `/tables`, `/seating/tables`, `/seating/assignments`, `/tables/{id}/assign-guests`, summaries/exports | Owner/admin | table/assignment DTOs -> plan/table/assignment/summary/file | Table and guest belong to invitation; row-locked capacity; one assignment per guest; over-capacity `409` | `seatingService.js` |

The QR routes `GET /api/v1/invitations/{invitationId}/qr` and `GET /api/v1/invitations/{invitationId}/guests/{guestId}/qr` are owner/admin binary endpoints. Guest QR payloads contain an opaque invite token, not a database ID or private guest record.

## Planning, reports, and notifications

| Method/path family | Auth | Request -> response | Rules / errors | Callers |
|---|---|---|---|---|
| Budget `/api/v1/invitations/{id}/budget`, `/budget/summary`, `/budget/items/*`, `/budget-items/*`, `/budget/export` | Owner/admin | budget/item DTOs -> budget/item/summary/file | Monetary totals are computed/persisted by backend; item belongs to invitation | `budgetApi.js`, `planningApi.js` |
| Gifts `/api/v1/invitations/{id}/gifts/*` | Owner/admin | gift DTO -> gift response/list | Gift ID is invitation-scoped; amounts are decimals | `planningApi.js` |
| Dashboard/report `/api/v1/dashboard/summary`, `/invitations/{id}/dashboard`, `/reports/rsvp|guests` and exports | Authenticated owner/admin | no body -> aggregate DTO/file | Aggregates derive from persisted backend state | `dashboardApi.js` |
| Notifications `/api/v1/notifications`, `/summary`, `/{id}/read`, `/read-all`, invitation notifications | Authenticated current user/owner | status mutation or no body -> notification DTO(s) | Notification is scoped to user/invitation | notification service |

## Payments, entitlements, subscriptions, and organizations

| Method/path family | Auth | Request -> response | Rules / errors | Callers |
|---|---|---|---|---|
| `POST /api/v1/template-payments/static/create` and PayWay create aliases | Authenticated | create DTO -> order/checkout response | Template/package/amount/currency are validated server-side; static mode is exactly USD 0.01 | user `paymentService.js` |
| `GET /api/v1/template-payments/{orderCode}` | Authenticated owner/admin | no body -> status DTO | Client polls only; it cannot change status | payment UI |
| `GET /api/v1/me/templates/paid`; `GET /me/templates/{templateId}/access` | Authenticated current user | no body -> entitlement DTO(s) | Access exists only after backend paid confirmation | payment/template UI |
| `GET /api/v1/me/payments`, `/{orderCode}`, `/{orderCode}/receipt` | Authenticated current user | no body -> history/detail/receipt | Order ownership enforced; currently unpaginated | payment history UI |
| `POST /api/v1/payway/callback` | Public network route, provider signature verified | provider payload/signature -> acknowledgement | Remote provider verification precedes paid transition; replay is handled by current order state | ABA provider only |
| `POST /api/v1/internal/template-payments/confirm|telegram-detect` | Required internal payment secret | confirmation/detection DTO -> confirmation response | Amount, currency, note/order code checked; row lock serializes mutations; Telegram detection defaults to `PAID_PENDING_REVIEW`; no entitlement until admin confirmation | Telegram bot/internal operator |
| `POST /api/v1/admin/template-payments/confirm|telegram-detect`; `GET /admin/template-payments` | Admin | same confirmation DTOs -> response/list | Admin authority required; mutation remains server-side | admin/operator |
| `GET /api/v1/packages`; `GET /me/subscriptions/current|history`; `POST /me/subscriptions/purchase` | Public package read; authenticated user state | package ID -> subscription response | Free activation is server-side; paid purchase remains pending and is not an entitlement | subscription service |
| `/api/v1/organizations` CRUD/member routes | Authenticated | organization/member/role DTO -> organization/member response | Owner alone mutates members; `OWNER` is immutable; inactive member has no access; changes audited | organization API/hooks |

## Admin API

The admin SPA consumes canonical `/api/v1/admin/*` routes for users, templates, invitations/moderation, reports, analytics, health, alerts, audit/system logs, packages, payments, dashboard, and notifications. All require `ROLE_ADMIN`; the frontend route guard is only UX and is not an authorization boundary. Lists presently return arrays and are not server-paginated.

Legacy `/api/admin/users` and `/api/admin/invitations` read/mutation routes still exist. They are not the canonical admin SPA contract and should be deprecated only after usage telemetry and caller search confirm zero consumers.

## AI assistant

Authenticated `POST /api/v1/ai/invitation-copy`, `/invitation/story`, `/invitation/formal-text`, `/invitation/translate`, and `/invitation/timeline-suggestion` accept bounded AI-specific DTOs and return assistant response DTOs. The service is currently a local stub: callers must handle an unavailable/non-generated response gracefully, and invitation creation must continue without it. Do not send guest lists, payment records, tokens, or unrelated PII.

## Compatibility notes from this audit

- No route or request field was removed or renamed.
- Error `code`, `path`, and `fieldErrors` are additive; legacy validation `fields` remains.
- `CheckInResponse.result` is additive; `alreadyCheckedIn` remains for older callers.
- Telegram detection behavior intentionally becomes safer: without an explicit deployment opt-in it returns `PAID_PENDING_REVIEW`, and premium access remains locked until admin confirmation.

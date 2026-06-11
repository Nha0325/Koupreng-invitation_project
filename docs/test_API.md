# Koupreng Backend API — Test Report

- **Base URL:** `${BASE_URL}`
- **Tested:** 2026-05-31, against the live running backend (`./mvnw spring-boot:run`)
- **Auth model:** JWT Bearer token. Obtain a token from `POST /api/auth/register` or `POST /api/auth/login`, then send `Authorization: Bearer <accessToken>` on protected routes. The token is also set as an HTTP-only cookie.

## How to authenticate (do this first)

```bash
# Register (returns accessToken)
curl -X POST ${BASE_URL}/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Tester","email":"tester@example.com","phone":"012345678","password":"Test@1234"}'

# Login (identifier can be email OR phone)
curl -X POST ${BASE_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identifier":"tester@example.com","password":"Test@1234"}'
```

Copy `accessToken` from the response and use it as `Bearer <token>` below.

## Results summary

| # | Method | Endpoint | Auth | Result | Status |
|---|--------|----------|------|--------|--------|
| 1 | GET | `/api/health` | public | OK | ✅ 200 |
| 2 | POST | `/api/auth/register` | public | token returned | ✅ 200 |
| 3 | POST | `/api/auth/login` | public | token returned | ✅ 200 |
| 4 | POST | `/api/auth/login` (bad creds) | public | Invalid credentials | ✅ 401 |
| 5 | GET | `/api/users/me` (no token) | — | rejected | ✅ 401 |
| 6 | GET | `/api/users/me` | user | profile returned | ✅ 200 |
| 7 | PATCH | `/api/users/me` | user | profile updated | ✅ 200 |
| 8 | POST | `/api/v1/events` | user | **table missing** | ❌ 500 |
| 9 | GET | `/api/v1/events` | user | **table missing** | ❌ 500 |
| 10 | GET | `/api/v1/events/{id}` | user | not found | ⚠️ 404 |
| 11 | GET | `/api/v1/events/published` | user | **table missing** | ❌ 500 |
| 12 | GET | `/api/v1/events/drafts` | user | **table missing** | ❌ 500 |
| 13 | POST | `/api/v1/invitations` | user | created | ✅ 201 |
| 14 | GET | `/api/v1/invitations/my` | user | list returned | ✅ 200 |
| 15 | GET | `/api/v1/invitations/{id}` | user | returned | ✅ 200 |
| 16 | PATCH | `/api/v1/invitations/{id}/publish` | user | missing fields (expected) | ⚠️ 400 |
| 17 | GET | `/api/v1/invitations/{id}/preview` | user | returned | ✅ 200 |
| 18 | POST | `/api/v1/invitations/{id}/guests` | user | created | ✅ 201 |
| 19 | GET | `/api/v1/invitations/{id}/guests` | user | list returned | ✅ 200 |
| 20 | GET | `/api/v1/invitations/{id}/guests/search?keyword=` | user | list returned | ✅ 200 |
| 21 | GET | `/api/v1/invitations/{id}/rsvps` | user | empty list | ✅ 200 |
| 22 | GET | `/api/v1/invitations/{id}/rsvps/summary` | user | summary returned | ✅ 200 |
| 23 | GET | `/api/v1/invitations/{id}/media` | user | media returned | ✅ 200 |
| 24 | GET | `/api/invitations/templates` | public | **no handler** | ❌ 404 |
| 25 | POST | `/api/v1/template-payments/payway/create` | user | PayWay upstream failed (expected w/o creds) | ⚠️ 502 |
| 26 | GET | `/api/v1/me/templates/paid` | user | empty list | ✅ 200 |
| 27 | GET | `/api/v1/me/templates/{id}/access` | user | access=false | ✅ 200 |
| 28 | GET | `/api/v1/payway/return` | public | message returned | ✅ 200 |
| 29 | GET | `/api/v1/payway/cancel` | public | message returned | ✅ 200 |
| 30 | GET | `/api/admin/users` (user token) | admin | forbidden (expected) | ✅ 403 |
| 31 | GET | `/api/admin/invitations` (user token) | admin | forbidden (expected) | ✅ 403 |
| 32 | GET | `/api/v1/admin/template-payments` (user token) | admin | forbidden (expected) | ✅ 403 |
| 33 | POST | `/api/auth/logout` | user | logged out | ✅ 200 |

Legend: ✅ working as expected · ⚠️ expected non-2xx (validation/auth/config) · ❌ real bug to fix

---

## Detailed requests and responses

### 1. Health
```bash
curl ${BASE_URL}/api/health
```
```json
{"status":"OK","service":"Spring Boot Backend"}
```

### 2–3. Auth — Register / Login
```bash
curl -X POST ${BASE_URL}/api/auth/register -H "Content-Type: application/json" \
  -d '{"fullName":"Tester","email":"tester@example.com","phone":"012345678","password":"Test@1234"}'
```
```json
{
  "accessToken": "eyJ0eXAiOiJKV1Q...",
  "tokenType": "Bearer",
  "expiresAt": "2026-05-31T03:25:10Z",
  "user": {"id":2,"email":"tester@example.com","phone":"012345678","fullName":"Tester","role":"USER","status":"ACTIVE"}
}
```
> `login` takes `{"identifier": "<email or phone>", "password": "..."}` and returns the same shape.

### 4. Login — invalid credentials
```json
{"timestamp":"...","status":401,"error":"Unauthorized","message":"Invalid credentials"}
```

### 5–7. User profile
```bash
# no token -> 401
curl -i ${BASE_URL}/api/users/me

# with token
curl ${BASE_URL}/api/users/me -H "Authorization: Bearer $TOKEN"

# update name
curl -X PATCH ${BASE_URL}/api/users/me -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"fullName":"Tester Updated"}'
```
```json
{"id":2,"email":"tester@example.com","phone":"012345678","fullName":"Tester Updated","role":"USER","status":"ACTIVE"}
```

### 8–12. Events  ❌ (broken — see Issues)
```bash
curl -X POST ${BASE_URL}/api/v1/events -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"eventName":"My Wedding","templateType":"WEDDING","groom":"A","bride":"B","eventDate":"2026-12-01","location":"Phnom Penh"}'
```
```json
{"timestamp":"...","status":500,"error":"Internal Server Error","message":"Unexpected server error"}
```
> `templateType` enum: `WEDDING, ENGAGEMENT, BIRTHDAY, GRADUATION, CORPORATE, HOUSEWARMING, OPENING`.
> All read/write event endpoints fail with 500 because the `events` table does not exist (no migration). `GET /{id}` returns 404 because the lookup misses before hitting the broken query.

### 13–17. Invitations  ✅
```bash
curl -X POST ${BASE_URL}/api/v1/invitations -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Our Wedding","eventType":"WEDDING","eventDate":"2026-12-01","venueName":"Grand Hall","hostName":"A & B"}'
```
```json
{
  "success": true,
  "message": "Invitation created successfully",
  "data": {"id":1,"title":"Our Wedding","slug":"a-b","eventType":"WEDDING","status":"DRAFT","visibility":"PUBLIC","published":false,"draft":true}
}
```
> `eventType` enum: `WEDDING, ENGAGEMENT, BIRTHDAY, ANNIVERSARY, CORPORATE, OTHER`.
> Publishing requires these fields filled: `eventTime, venueAddress, groomName, brideName` — otherwise:
```json
{"status":400,"message":"Publish requirements missing: eventTime, venueAddress, groomName, brideName"}
```
> List with filter: `GET /api/v1/invitations/my?status=DRAFT` (status: `DRAFT, PUBLISHED, UNPUBLISHED, ARCHIVED`).
> Public read (no auth): `GET /api/v1/public/invitations/{slug}`.

### 18–20. Guests  ✅
```bash
curl -X POST ${BASE_URL}/api/v1/invitations/1/guests -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"guestName":"John Doe","phone":"012999888","guestGroup":"Friends"}'
```
```json
{
  "success": true,
  "message": "Guest created successfully",
  "data": {"id":1,"invitationId":1,"guestName":"John Doe","inviteToken":"54608189...","qrCodeUrl":"/i/a-b?token=54608189..."}
}
```
> Other endpoints: `GET .../guests`, `GET .../guests/{guestId}`, `PUT .../guests/{guestId}`, `DELETE .../guests/{guestId}`, `GET .../guests/search?keyword=`, `POST .../guests/import`.

### 21–22. RSVP  ✅
```bash
curl ${BASE_URL}/api/v1/invitations/1/rsvps/summary -H "Authorization: Bearer $TOKEN"
```
```json
{"success":true,"data":{"totalGuests":1,"attending":0,"notAttending":0,"maybe":0,"pending":1,"totalAttendeeCount":0}}
```
> Public submit (no auth): `POST /api/v1/public/invitations/{slug}/rsvp` and
> `POST /api/v1/public/invitations/{slug}/guests/{inviteToken}/rsvp`
> Body: `{"guestName":"...","responseStatus":"ATTENDING","attendeeCount":2,"message":"..."}` (status: `ATTENDING, NOT_ATTENDING, MAYBE`).

### 23. Media  ✅
```bash
curl ${BASE_URL}/api/v1/invitations/1/media -H "Authorization: Bearer $TOKEN"
```
```json
{"success":true,"data":{"coverImage":null,"galleryImages":[],"video":null,"backgroundMusic":null,"all":[]}}
```
> Uploads use `multipart/form-data` with a `file` field (gallery accepts `files`):
> `POST .../media/cover`, `POST .../media/gallery`, `POST .../media/video`, `POST .../media/music`,
> `PUT .../media/{mediaId}/replace`, `DELETE .../media/{mediaId}`.
> Public read: `GET /api/v1/public/invitations/{slug}/media`.

### 24. Templates  ❌
```bash
curl ${BASE_URL}/api/invitations/templates
```
```json
{"status":404,"error":"Not Found","message":"Resource not found"}
```
> Security permits this path, but no controller handles it (`NoResourceFoundException`). Endpoint is missing or the path differs from what the frontend expects.

### 25–29. Template payments (ABA PayWay)
```bash
curl -X POST ${BASE_URL}/api/v1/template-payments/payway/create -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"templateId":1,"templateName":"Royal","packageName":"Premium","amount":9.99,"currency":"USD"}'
```
```json
{"status":502,"error":"Bad Gateway","message":"ABA PayWay request failed"}
```
> 502 is expected locally — it calls the external ABA PayWay API which needs valid credentials/network. The rest work:
> - `GET /api/v1/me/templates/paid` → `{"data":[]}`
> - `GET /api/v1/me/templates/1/access` → `{"data":{"templateId":1,"hasAccess":false}}`
> - `GET /api/v1/payway/return`, `GET /api/v1/payway/cancel` → message payloads (public)
> - `POST /api/v1/payway/callback` → called by PayWay server with `X-PAYWAY-HMAC-SHA512` header (public)

### 30–32. Admin (require ADMIN role)
A normal user token is correctly rejected with **403**:
- `GET /api/admin/users`
- `GET /api/admin/invitations`
- `GET /api/v1/admin/template-payments`

To test these, you need a user whose `role = ADMIN`. There is no seeded admin; promote a user directly in the DB:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'tester@example.com';
```
Then log in again to get a fresh token with the admin role.

### 33. Logout
```bash
curl -X POST ${BASE_URL}/api/auth/logout -H "Authorization: Bearer $TOKEN"
```
```json
{"message":"Logged out"}
```

---

## Issues found

1. **Events module is broken (500).** Hibernate query fails with `Table 'koupreng_db.events' doesn't exist`. The `Event` entity has no Flyway migration creating the `events` table (migrations jump V1 → V3 and never create it). Add a migration to create `events`, or the whole `/api/v1/events/**` module is unusable.
2. **`GET /api/invitations/templates` returns 404.** The route is whitelisted in `SecurityConfig` but no controller maps it, so Spring treats it as a missing static resource. Either the controller is missing or the frontend is calling the wrong path.
3. **PayWay create returns 502 locally.** Expected without real ABA PayWay credentials/connectivity. Verify `PaymentProperties`/`.env` PayWay settings before relying on this in a real environment.

## Public vs protected routes (quick reference)
- **Public:** `/api/health`, `/api/auth/login|register|google|telegram`, `/api/v1/public/invitations/**`, `/api/v1/payway/callback|return|cancel`, `/uploads/**`, `/actuator/health|info|prometheus`.
- **Authenticated (any user):** everything under `/api/users/me`, `/api/v1/events/**`, `/api/v1/invitations/**`, guests, rsvps (owner views), media, `/api/v1/template-payments/**`, `/api/v1/me/templates/**`.
- **ADMIN only:** `/api/admin/**`, `/api/v1/admin/**`, `/actuator/**` (non-public ones).

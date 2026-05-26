# Koupreng Database and Route Design

This document replaces the raw feature-flow notes with an implementation-ready database and route map.

## Verified Sources

- Current backend database configuration: `backend/src/main/resources/application.properties`
- Current Flyway migrations:
  - `backend/src/main/resources/db/migration/V1__create_auth_schema.sql`
  - `backend/src/main/resources/db/migration/V3__create_event_and_payment_tables.sql`
- Current JPA entities under `backend/src/main/java/com/koupreng/backend/entity`
- Current frontend routes under `frontend-user/src/app/routes`
- Requirement notes from `database.md` before this cleanup and the rendered Gemini share page titled `Digital Invitation Platform Design & URLs`

## Confirmed Current Database Stack

The backend is configured for MySQL by default:

- Default JDBC URL: `jdbc:mysql://localhost:3306/koupreng_db?...`
- Default driver: `com.mysql.cj.jdbc.Driver`
- Default JPA mode: `spring.jpa.hibernate.ddl-auto=update`
- Flyway is present, but disabled by default: `spring.flyway.enabled=${FLYWAY_ENABLED:false}`

If Flyway should be the source of truth, set `FLYWAY_ENABLED=true` and avoid relying on `ddl-auto=update` for production schema changes.

## Core Tables

| Table | Purpose | Primary relationships |
|---|---|---|
| `users` | Auth account, profile, role, status, token version | Parent for invitations, subscriptions, audit logs, payout accounts |
| `templates` | Invitation template catalog | Referenced by invitations |
| `invitations` | Main event/invitation record | Belongs to user, optional template |
| `invitation_sections` | Custom sections/layout/content JSON | Belongs to invitation |
| `media_files` | Cover/gallery/video/music file URLs | Belongs to invitation |
| `guests` | Invitees, grouping, token, QR URL, send/view/contribution status | Belongs to invitation |
| `rsvps` | Guest RSVP response and message | Belongs to invitation, optional guest |
| `notifications` | Invitation/reminder/delivery notifications | Belongs to invitation, optional guest |
| `budgets` | One budget summary per invitation | One-to-one invitation |
| `budget_items` | Budget line items | Belongs to budget |
| `packages` | Subscription package definitions | Referenced by subscriptions |
| `subscriptions` | User subscription state | Belongs to user and package |
| `audit_logs` | Admin/system action history | Optional user |
| `payment_configs` | Digital gift payment settings per invitation | One-to-one invitation |
| `payment_transactions` | ABA/KHQR/payment transaction records | Belongs to invitation, config, optional guest |
| `payment_webhook_logs` | Raw payment callback processing logs | Optional payment transaction |
| `telegram_notifications` | Telegram notification send records | Belongs to payment transaction |
| `organizer_payout_accounts` | Organizer merchant/payout config | Belongs to user |

## Required Constraints

Confirmed in migrations/entities:

- `users.email` is unique.
- `users.phone` is unique.
- `invitations.slug` is unique.
- `guests.invite_token` is unique.
- `budgets.invitation_id` is unique.
- `payment_configs.invitation_id` is unique.
- `payment_transactions.merchant_ref_no` is unique.
- Invitation child data uses cascade delete in the current migration for sections, media, guests, RSVP, notifications, budgets, payment config, and transactions.

## Feature-to-Table Map

| Feature area | Tables |
|---|---|
| User authentication and account management | `users` |
| Role management | `users.role`, `users.status`, `audit_logs` |
| Template browsing and premium templates | `templates`, `packages`, `subscriptions` |
| Invitation create/edit/draft/publish | `invitations`, `invitation_sections`, `media_files` |
| Khmer/English content and custom layout | `invitations.language_mode`, `invitation_sections.content_json` |
| Media upload and retrieval | `media_files` |
| Guest management | `guests` |
| Personalized guest links and QR codes | `guests.invite_token`, `guests.qr_code_url` |
| RSVP submission and reporting | `rsvps`, `guests.invitation_viewed_at` |
| Notification tracking | `notifications` |
| Dashboard summary/reporting | Aggregates from `invitations`, `guests`, `rsvps`, `budgets`, `payment_transactions` |
| Admin management | `users`, `templates`, `invitations`, `audit_logs` |
| Budget management | `budgets`, `budget_items` |
| Digital gift / ABA PayWay / KHQR | `payment_configs`, `payment_transactions`, `payment_webhook_logs`, `telegram_notifications`, `organizer_payout_accounts` |

## Public and Dashboard Routes

### Current frontend routes

Confirmed in `frontend-user/src/app/routes`:

| Area | Route | Purpose |
|---|---|---|
| Marketing | `/` | Landing page |
| Marketing | `/templates` | Template gallery |
| Marketing | `/templates/:id` | Template demo |
| Marketing | `/templates/:id/preview` | Full template preview |
| Auth | `/login` | Login |
| Auth | `/register` | Register |
| Auth | `/forgot-password` | Forgot password |
| Builder | `/create/wedding` | Create new wedding draft |
| Builder | `/create/wedding/:draftId` | Edit draft |
| Builder | `/preview/:draftId` | Preview draft |
| Public invitation | `/w/:slug` | Published invitation page |
| Host dashboard | `/dashboard` | Host dashboard |
| Host dashboard | `/guests` | Guest management |
| Host dashboard | `/events` | Event list |
| Host dashboard | `/events/create` | Create event |
| Host dashboard | `/expenses` | Budget/expense tracking |
| Host dashboard | `/gifts` | Wedding gift tracking |
| Admin | `/admin` | Admin dashboard |
| Admin | `/admin/dashboard` | Admin dashboard |
| Admin | `/admin/users` | User management |
| Admin | `/admin/templates` | Template management |
| Admin | `/admin/subscriptions` | Subscription placeholder |
| Admin | `/admin/venues` | Venue placeholder |
| Admin | `/admin/transactions` | Transaction placeholder |
| Admin | `/admin/logs` | Audit log placeholder |

### Public invitation link rule

Use this public link format:

```text
/w/:slug
```

Use a guest token query string when individual tracking is needed:

```text
/w/:slug?to=:invite_token
```

Database lookup rule:

```sql
SELECT *
FROM invitations
WHERE slug = :slug
  AND status = 'published';
```

If `visibility = 'private'`, require the configured access check before rendering private invitation data.

## Current Backend API Surface

Confirmed in current controllers:

| Endpoint | Access intent |
|---|---|
| `GET /` | Public health/root |
| `GET /api/health` | Public health |
| `POST /api/auth/register` | Public auth |
| `POST /api/auth/login` | Public auth |
| `POST /api/auth/google` | Public auth |
| `POST /api/auth/telegram` | Public auth |
| `POST /api/auth/logout` | Authenticated |
| `GET /api/users/me` | Authenticated user profile |
| `PATCH /api/users/me` | Authenticated profile update |
| `GET /api/admin/users` | Admin only |
| `PATCH /api/admin/users/{userId}/role` | Admin only |

Security config also permits these route patterns, but no matching controller was visible during this cleanup:

- `/api/invitations/templates`
- `/api/invitations/templates/**`
- `/api/invitations/shared/**`

## Target Backend API To Add

These endpoints are required by the feature list but are not confirmed as implemented in the current controller scan.

### Public invitation

| Endpoint | Purpose |
|---|---|
| `GET /api/public/invitations/{slug}` | Fetch published invitation, sections, media, public template data |
| `GET /api/public/invitations/{slug}/guest?token={invite_token}` | Resolve personalized guest link |
| `POST /api/public/rsvps` | Submit RSVP |
| `POST /api/public/payments/charge` | Create digital gift payment request / QR payload |

### Organizer dashboard

| Endpoint | Purpose |
|---|---|
| `GET /api/user/invitations` | List current user's invitations |
| `POST /api/user/invitations` | Create invitation |
| `GET /api/user/invitations/{id}` | View invitation details |
| `PUT /api/user/invitations/{id}` | Update invitation |
| `PATCH /api/user/invitations/{id}/publish` | Publish invitation |
| `PATCH /api/user/invitations/{id}/unpublish` | Unpublish invitation |
| `DELETE /api/user/invitations/{id}` | Delete invitation |
| `POST /api/user/media/upload` | Upload cover/gallery/video/music |
| `GET /api/user/invitations/{id}/guests` | List guests |
| `POST /api/user/invitations/{id}/guests` | Add guest |
| `PUT /api/user/guests/{guestId}` | Edit guest |
| `DELETE /api/user/guests/{guestId}` | Delete guest |
| `GET /api/user/invitations/{id}/rsvps` | RSVP report |
| `GET /api/user/invitations/{id}/budget` | Budget summary |
| `POST /api/user/invitations/{id}/budget/items` | Add budget item |
| `GET /api/user/reports/analytics/{invitation_id}` | Dashboard analytics |

### Admin

| Endpoint | Purpose |
|---|---|
| `GET /api/admin/templates` | List templates |
| `POST /api/admin/templates` | Create template |
| `PUT /api/admin/templates/{id}` | Update template |
| `DELETE /api/admin/templates/{id}` | Delete template |
| `GET /api/admin/invitations` | Admin invitation overview |
| `GET /api/admin/reports` | Admin reporting |
| `GET /api/admin/audit-logs` | Audit log view |

## Authorization Rules

| Area | Authentication | Authorization rule |
|---|---|---|
| Public marketing | None | Anyone can view |
| Public invitation | None by default | If invitation is private, require invitation access check |
| Public RSVP | None by default | Validate slug/token and prevent duplicate RSVP per guest token |
| Organizer dashboard | JWT/session required | User can access only invitations where `invitations.user_id` matches token user |
| Admin dashboard | JWT/session required | Require `users.role = ADMIN` |
| Payment webhooks | Provider callback authentication required | Store raw callback in `payment_webhook_logs` before/while processing |

## Implementation Notes

- Keep `/w/:slug` as the public invitation URL because the current frontend constants, publish flow, and route docs already use `/w/{slug}`.
- Do not expose `access_password`, `password_hash`, payment provider secrets, or raw callback internals in public invitation responses.
- Add indexes before production traffic for common lookups:
  - `invitations(user_id, status)`
  - `guests(invitation_id, send_status)`
  - `rsvps(invitation_id, response_status)`
  - `payment_transactions(invitation_id, status)`
  - `notifications(invitation_id, status)`
- Keep payment amounts as `DECIMAL`, not floating-point types.
- Store complex template section data in `invitation_sections.content_json`; keep frequently filtered fields as normal columns on `invitations`, `guests`, `rsvps`, or payment tables.

## Known Gaps

- Canonical public invitation route is `/w/:slug` across the frontend route, route constants, publish links, and documentation.
- Backend CRUD controllers for invitations, guests, RSVP, budget, media, templates, reports, payments, and public invitation views are not visible in the current controller scan.
- The root README mentions Supabase/PostgreSQL, but current backend configuration and migrations are MySQL-based.



wedding-site.css (line 1540): Moved the pinned preview image upward.

wedding-site.css (line 1540): Made the pinned image smaller.

wedding-site.css (line 1540): Adjusted overlay so the image is more visible.
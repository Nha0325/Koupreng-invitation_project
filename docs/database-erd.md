# Koupreng Database ERD

This document describes the Flyway-managed relational schema used by the backend.
Flyway migrations are the source of truth; Hibernate should validate the schema, not create it.

## Core Tables

| Table | Primary key | Main columns | Important foreign keys |
| --- | --- | --- | --- |
| `users` | `user_id` | `email`, `password_hash`, `full_name`, `role`, `status`, `created_at`, `updated_at` | none |
| `password_reset_tokens` | `token_id` | `token_hash`, `expires_at`, `used_at`, `created_at` | `user_id -> users.user_id` |
| `templates` | `template_id` | `code`, `name`, `category`, `description`, `thumbnail_url`, `preview_url`, `is_premium`, `price`, `currency`, `status`, `sort_order`, `created_at`, `updated_at` | none |
| `invitations` | `invitation_id` | `title`, `slug`, `event_type`, `event_date`, `event_time`, `venue_name`, `visibility`, `access_token`, `status`, `moderation_status`, `published_at`, `created_at`, `updated_at` | `user_id -> users.user_id`, `template_id -> templates.template_id`, `organization_id -> organizations.organization_id` |
| `invitation_sections` | `section_id` | `section_key`, `section_title`, `content_json`, `sort_order`, `is_enabled` | `invitation_id -> invitations.invitation_id` |
| `media_files` | `media_id` | `media_type`, `file_url`, `public_id`, `sort_order`, `is_cover`, `created_at` | `invitation_id -> invitations.invitation_id` |
| `guests` | `guest_id` | `guest_name`, `phone`, `email`, `guest_group`, `side_type`, `table_number`, `invite_token`, `send_status`, `created_at` | `invitation_id -> invitations.invitation_id` |
| `rsvps` | `rsvp_id` | `response_status`, `attendee_count`, `message`, `responded_at` | `invitation_id -> invitations.invitation_id`, `guest_id -> guests.guest_id` |
| `notifications` | `notification_id` | `channel`, `subject`, `message_body`, `scheduled_at`, `sent_at`, `status` | `invitation_id -> invitations.invitation_id`, `guest_id -> guests.guest_id` |
| `invitation_delivery_events` | `delivery_event_id` | `channel`, `recipient`, `status`, `provider_message_id`, `error_message`, `created_at` | `invitation_id -> invitations.invitation_id`, `guest_id -> guests.guest_id` |
| `events` | `id` | `event_name`, `template_type`, `groom`, `bride`, `event_date`, `eating_time`, `location`, `description`, `cover_image_url`, `status`, `deleted`, `created_at`, `updated_at`, `published_at` | none |

## Planning And Operations Tables

| Table | Primary key | Main columns | Important foreign keys |
| --- | --- | --- | --- |
| `budgets` | `budget_id` | `total_budget`, `notes`, `created_at`, `updated_at` | `invitation_id -> invitations.invitation_id` |
| `budget_items` | `budget_item_id` | `category`, `item_name`, `estimated_cost`, `actual_cost`, `vendor_name`, `notes` | `budget_id -> budgets.budget_id` |
| `event_tables` | `table_id` | `table_name`, `table_label`, `capacity`, `sort_order`, `notes`, `created_at`, `updated_at` | `invitation_id -> invitations.invitation_id` |
| `guest_seat_assignments` | `assignment_id` | `seat_label`, `seat_count`, `notes`, `assigned_at` | `invitation_id -> invitations.invitation_id`, `table_id -> event_tables.table_id`, `guest_id -> guests.guest_id` |
| `guest_check_ins` | `check_in_id` | `check_in_token`, `checked_in_at`, `checked_in_by`, `note` | `invitation_id -> invitations.invitation_id`, `guest_id -> guests.guest_id` |

## Organization Tables

| Table | Primary key | Main columns | Important foreign keys |
| --- | --- | --- | --- |
| `organizations` | `organization_id` | `name`, `slug`, `status`, `created_at`, `updated_at` | `owner_user_id -> users.user_id` |
| `organization_members` | `member_id` | `email`, `role`, `status`, `invited_at`, `joined_at`, `created_at`, `updated_at` | `organization_id -> organizations.organization_id`, `user_id -> users.user_id` |

## Subscription And Payment Tables

| Table | Primary key | Main columns | Important foreign keys |
| --- | --- | --- | --- |
| `packages` | `package_id` | `code`, `package_name`, `description`, `price`, `currency`, `billing_interval`, `duration_days`, `max_invitations`, `max_guests`, `features_json`, `active`, `sort_order` | none |
| `subscriptions` | `subscription_id` | `order_code`, `start_date`, `end_date`, `amount`, `currency`, `payment_status`, `status`, `is_active`, `created_at`, `updated_at` | `user_id -> users.user_id`, `package_id -> packages.package_id` |
| `template_orders` | `order_id` | `order_code`, `template_id`, `template_name`, `amount`, `currency`, `status`, `created_at` | `user_id -> users.user_id` |
| `template_payment_orders` | `order_id` | `order_code`, `transaction_id`, `template_id`, `template_name`, `package_name`, `amount`, `paid_amount`, `currency`, `status`, `provider`, `payment_link`, `paid_at`, `expires_at`, `created_at` | `user_id -> users.user_id` |
| `user_template_access` | `access_id` | `template_id`, `access_type`, `active`, `granted_at`, `expires_at` | `user_id -> users.user_id` |
| `payment_configs` | `payment_config_id` | `provider`, `payment_mode`, `is_enabled`, `fixed_amount`, `currency`, `telegram_notify_enabled`, `created_at`, `updated_at` | `invitation_id -> invitations.invitation_id` |
| `payment_transactions` | `payment_id` | `merchant_ref_no`, `payway_transaction_id`, `amount`, `currency`, `qr_payload`, `payment_link`, `status`, `requested_at`, `paid_at`, `expired_at` | `invitation_id -> invitations.invitation_id`, `guest_id -> guests.guest_id`, `payment_config_id -> payment_configs.payment_config_id` |
| `payment_webhook_logs` | `webhook_log_id` | `provider`, `event_type`, `request_headers`, `request_body`, `received_at`, `processed_status` | `payment_id -> payment_transactions.payment_id` |
| `telegram_notifications` | `telegram_notification_id` | `chat_id`, `message_text`, `status`, `sent_at`, `response_json`, `created_at` | `payment_id -> payment_transactions.payment_id` |
| `organizer_payout_accounts` | `payout_account_id` | `provider`, `merchant_id`, `merchant_name`, `is_active`, `created_at`, `updated_at` | `user_id -> users.user_id` |

## Audit Tables

| Table | Primary key | Main columns | Important foreign keys |
| --- | --- | --- | --- |
| `audit_logs` | `log_id` | `action`, `target_type`, `target_id`, `details`, `created_at` | `user_id -> users.user_id` |
| `system_audit_logs` | `audit_log_id` | `actor_user_id`, `actor_email`, `action`, `target_type`, `target_id`, `description`, `ip_address`, `created_at` | none |

## Relationship Notes

- One user owns many invitations.
- One template can be used by many invitations.
- One organization can own many invitations through `invitations.organization_id`; the database FK is `invitations.organization_id -> organizations.organization_id ON DELETE SET NULL`.
- One invitation owns guests, media, sections, budget, seating tables, check-ins, delivery events, notifications, and RSVP records.
- Guests can have one RSVP and one seat assignment in the current schema.
- Budgets are one-to-one with invitations. Budget items belong to a budget.
- Packages are purchased through subscriptions. Template purchases use `template_payment_orders` and grant access through `user_template_access`.
- `events` is a legacy/general event module exposed by `/api/v1/events/**`. It is now backed by a Flyway table, but invitations remain the richer wedding-event model.
- Wedding gift tracking in the host UI is currently localStorage-backed. The backend has payment contribution infrastructure (`payment_configs`, `payment_transactions`) and guest contribution summary fields, but it does not yet expose CRUD endpoints matching `WeddingGiftPage`.

## Integration Status

| Area | Database / backend status | Frontend status |
| --- | --- | --- |
| Public templates | `GET /api/v1/templates`, `/api/v1/templates/{templateId}`, and `/api/v1/templates/slug/{code}` read ACTIVE rows from `templates` through public DTOs. Admin-only template operations remain under `/api/v1/admin/templates`. | Template grid loads backend templates first and keeps static templates only as a fallback. Premium templates route to checkout; free templates route to the wedding builder. |
| Admin templates | Managed through `templates` with `code`, `category`, `thumbnail_url`, `preview_url`, premium flags, price, currency, status, and sort order. | Admin app uses `/api/v1/admin/templates/**`. |
| Invitations | `invitations` is the primary wedding event table and includes template, owner, organization, visibility, customization JSON, status, and moderation status. | Host dashboard, events, guests, expenses, builder sync, preview, and public invitation routes use `/api/v1/invitations/**` and `/api/v1/public/invitations/**`. |
| Guests and RSVP | `guests` and `rsvps` are invitation-scoped with guest invite tokens and one RSVP per guest after hardening. | Guest manager, RSVP manager, public RSVP, check-in, and QR flows use backend APIs. |
| Media | `media_files` stores cover, gallery, video, and music metadata for invitations. | Upload/list/replace/delete flows use `/api/v1/invitations/{invitationId}/media/**`; public media uses `/api/v1/public/invitations/{slug}/media`. |
| Budget | `budgets` and `budget_items` are invitation-scoped. | Budget pages use backend APIs with local fallback only for legacy pages. |
| Seating and check-in | `event_tables`, `guest_seat_assignments`, and `guest_check_ins` support table plans and QR check-in. | Seating and check-in pages use backend APIs. |
| Payments | Template purchases use `template_payment_orders` and template access grants; contribution infrastructure uses `payment_configs` and `payment_transactions`. | Template checkout and payment history use backend APIs. Wedding gift list is not yet connected to contribution/payment endpoints. |
| Packages and subscriptions | `packages` and `subscriptions` support plan management and purchase records. | User package pages and admin package pages use backend APIs. |
| Wedding gifts | No dedicated Flyway table or CRUD controller exists for the local host gift list. | `WeddingGiftPage` remains localStorage-only. TODO: define whether gifts should map to payment transactions, guest contribution fields, or a new dedicated gift table before backend integration. |

## Optional Table Verification

| Candidate table | Exists now? | Current need |
| --- | --- | --- |
| `refresh_tokens` | No | Not needed for the current auth flow. `AuthResponse` returns only an access token, and logout invalidates existing tokens by incrementing `users.token_version`. Add this table only if long-lived refresh-token rotation/revocation is implemented. |
| `social_accounts` / `oauth_accounts` | No | Google and Telegram login exist, but `AuthService` currently upserts users by email and does not persist provider IDs from `ExternalAuthIdentity`. Add one of these tables if users must link multiple providers, preserve provider IDs, or support social login where email is missing/untrusted. |
| `payment_settings` | No | Not needed for the current backend. ABA/PayWay gateway settings come from Spring configuration properties/env (`app.payment.*`, `app.payment.payway.*`). Existing `payment_configs` is invitation-scoped contribution/payment setup, not global admin gateway configuration. Add `payment_settings` only if admins must edit global ABA/PayWay settings from the UI. |
| `template_categories` | No | Not needed while categories are controlled by the `TemplateCategory` enum and stored as `templates.category`. Add this table only if template categories need admin-managed names, ordering, translations, or icons. |
| `template_assets` | No | Not needed for current template catalog records. `templates` stores `thumbnail_url` and `preview_url`; invitation-specific images/audio/videos are stored in `media_files`. Add this table if each template needs multiple managed demo images, audio tracks, videos, or downloadable asset variants. |
| `wedding_gifts` / `gift_contributions` | No | Not needed for the current frontend behavior because wedding gifts are localStorage-only. The backend has `payment_transactions` plus guest contribution summary fields, but there is no repository/controller/service for a dedicated gift list. Add one dedicated table only after deciding whether gifts are manual host records, verified payment transactions, or both. |
| `email_verification_tokens` | No | Not needed because registration does not require email verification today. `password_reset_tokens` exists only for password reset. Add this table if account activation or email-change verification becomes required. |

## Mermaid ERD

```mermaid
erDiagram
    users ||--o{ invitations : owns
    users ||--o{ password_reset_tokens : requests
    users ||--o{ subscriptions : buys
    users ||--o{ template_payment_orders : pays
    users ||--o{ user_template_access : unlocks
    users ||--o{ organizations : owns
    users ||--o{ organization_members : joins

    templates ||--o{ invitations : selected_by
    organizations ||--o{ organization_members : has
    organizations ||--o{ invitations : owns

    invitations ||--o{ invitation_sections : contains
    invitations ||--o{ media_files : has
    invitations ||--o{ guests : invites
    invitations ||--o{ rsvps : receives
    invitations ||--o{ notifications : sends
    invitations ||--o{ invitation_delivery_events : records
    invitations ||--|| budgets : plans
    invitations ||--o{ event_tables : seats
    invitations ||--o{ guest_seat_assignments : assigns
    invitations ||--o{ guest_check_ins : checks_in
    invitations ||--o{ payment_configs : configures
    invitations ||--o{ payment_transactions : receives

    guests ||--o| rsvps : responds
    guests ||--o| guest_seat_assignments : seated
    guests ||--o{ guest_check_ins : checked_in
    guests ||--o{ invitation_delivery_events : receives
    guests ||--o{ payment_transactions : contributes

    budgets ||--o{ budget_items : includes
    event_tables ||--o{ guest_seat_assignments : contains

    packages ||--o{ subscriptions : sold_as
    payment_configs ||--o{ payment_transactions : configures
    payment_transactions ||--o{ payment_webhook_logs : logs
    payment_transactions ||--o{ telegram_notifications : notifies
```

## Important Indexes And Constraints

- `invitations.slug` is unique for public invitation URLs.
- `invitations.access_token` is unique for private access links.
- `templates.code` is unique for public template lookup.
- `invitations.organization_id` is indexed and has `ON DELETE SET NULL` FK behavior to `organizations.organization_id`.
- `guests.invite_token` is unique for guest-specific RSVP/check-in links.
- `rsvps.guest_id` is unique after the RSVP hardening migration, enforcing one RSVP per invited guest.
- `budgets.invitation_id` is unique, enforcing one budget per invitation.
- `event_tables` has a unique `(invitation_id, table_name)` constraint.
- `guest_seat_assignments.guest_id` is unique, enforcing one table assignment per guest.
- `events` has indexes for status/deleted filtering, event date, standalone deleted filtering, and created-at reporting.
- `organizations.slug` is unique.
- `organization_members` has a unique `(organization_id, email)` constraint.
- `packages.code` is unique.
- `subscriptions.order_code`, `template_orders.order_code`, and `template_payment_orders.order_code` are unique payment references.

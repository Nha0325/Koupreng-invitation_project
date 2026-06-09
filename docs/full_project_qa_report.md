# Full Project QA Report

Date/time: 2026-06-09 15:04:26 +07:00

Branch: `audit/full-project-qa-after-pr4`

Base commit audited: `fc20ce9`

Scope: post-merge audit after PR #4 for Koupreng E-Invitation Platform, covering Parts A-N across backend, frontend user, frontend admin, Telegram bot, payment flow, Flyway migrations, and browser route rendering.

## Executive Summary

The project is buildable and testable on latest `main`. Baseline backend compile, backend tests, both frontend builds, Telegram syntax, whitespace checks, and browser DOM smoke all pass after this QA pass.

Concrete issues found and fixed:

- Admin app did not expose `/admin/login`; it only exposed `/login`.
- Admin auth guard redirected unauthenticated users to `/login`, outside the admin route namespace.
- Browser smoke was not committed as a reusable tool.
- A-N QA checklist had stale payment history endpoint paths.

No forced pushes, rebases, or history resets were used.

## Baseline Results Before Fixes

| Command | Result | Notes |
| --- | --- | --- |
| `backend/.\\mvnw.cmd -DskipTests compile` | Pass | Build success |
| `backend/.\\mvnw.cmd test` | Pass | 124 tests, 0 failures, 0 errors |
| `frontend-user/npm install` | Pass | 0 vulnerabilities |
| `frontend-user/npm run build` | Pass | Existing large chunk warning only |
| `frontend-admin/npm install` | Pass | 0 vulnerabilities |
| `frontend-admin/npm run build` | Pass | Build success |
| `telegram-bot/python -m py_compile main.py` | Pass | Syntax OK |
| `git diff --check` | Pass | No whitespace errors |

## Final Validation Results

| Command | Result | Notes |
| --- | --- | --- |
| `backend/.\\mvnw.cmd -DskipTests compile` | Pass | Build success |
| `backend/.\\mvnw.cmd test` | Pass | 124 tests, 0 failures, 0 errors |
| `frontend-user/npm install` | Pass | 0 vulnerabilities |
| `frontend-user/npm run build` | Pass | Existing large chunk warning only |
| `frontend-admin/npm install` | Pass | 0 vulnerabilities |
| `frontend-admin/npm run build` | Pass | Build success |
| `telegram-bot/python -m py_compile main.py` | Pass | Syntax OK |
| `node scripts/browser-smoke.mjs` | Pass | 22 routes rendered a nonblank React root |
| `git diff --check` | Pass | No whitespace errors |

No requested validation command failed.

## Bugs Found

| Area | Bug | Impact | Status |
| --- | --- | --- | --- |
| Admin frontend | `/admin/login` route missing | QA/admin users using admin namespaced URL landed on protected app redirect instead of login route | Fixed |
| Admin frontend | `RequireAuth` redirected to `/login` | Admin app route namespace was inconsistent | Fixed |
| QA tooling | Browser DOM smoke was only ad hoc | Regressions could reappear without repeatable command | Fixed |
| Documentation | Checklist used stale `/api/v1/payments` paths | Manual QA could test wrong API path | Fixed |

## Bugs Remaining

| Area | Issue | Reason not fixed in this pass |
| --- | --- | --- |
| Frontend user bundle size | Vite reports main JS chunk larger than 500 kB and large media assets | Performance optimization is a separate refactor; current build passes |
| Full public invitation content verification | `/i/{slug}` requires a real published invitation and optional guest token | Smoke verifies nonblank route rendering only without seeded data |
| Part M advanced features | AI assistant, organizations, seating, QR check-in, analytics are foundation/beta quality | Large feature completion is outside the requested safe QA/fix scope |
| Clean DB migration execution | Version uniqueness is tested; full MySQL clean migration was not run locally | Requires a disposable MySQL database configured for migration-only QA |

## Files Changed

| File | Purpose |
| --- | --- |
| `frontend-admin/src/App.jsx` | Added `/admin/login` route alias |
| `frontend-admin/src/auth/RequireAuth.jsx` | Redirect unauthenticated admins to `/admin/login` |
| `scripts/browser-smoke.mjs` | Added dependency-free Chrome/Edge DOM smoke runner |
| `docs/manual_browser_smoke_checklist.md` | Added manual fallback route checklist |
| `docs/qa_a_to_n_checklist.md` | Corrected payment history paths and added post-merge QA notes |
| `docs/full_project_qa_report.md` | Added this report |

## Part A-K Status

| Part | Area | Status | Evidence |
| --- | --- | --- | --- |
| A | Auth and Account | Pass | `AuthEndpointSecurityTests`, `AccountServiceTests`, routes `/auth/forgot-password`, `/auth/reset-password`, `/dashboard/profile`, `/dashboard/change-password` smoke |
| B | Event / Invitation | Pass with seeded-data limitation | Controllers and routes exist; owner checks covered in service tests; full public content needs seeded invitation |
| C | Template and Customization | Pass with beta limitations | Template routes build/smoke; customization endpoints exist; premium checkout fixed to static USD 0.01 |
| D | Media / File | Pass | `FileUploadValidatorTests`, `MediaServiceTests`; extension/MIME/size/signature paths covered |
| E | Guest Management | Pass | `GuestServiceTests`; guest import/export endpoints exist |
| F | Delivery Preparation | Pass with integration limitation | Delivery endpoints exist; real email delivery depends on configured mail provider |
| G | RSVP | Pass | `RsvpServiceTests`; public and token RSVP endpoints exist |
| H | Notifications | Pass with data limitation | User/admin notification endpoints and frontend route exist; no duplicate-spam load test run |
| I | Dashboard / Reporting | Pass with data limitation | Dashboard/report endpoints and CSV exports exist; counts require seeded scenario for manual confirmation |
| J | Admin Management | Pass | `/api/v1/admin/**` and `/api/admin/**` require ADMIN; admin routes smoke; admin login alias fixed |
| K | Budget Management | Pass | `BudgetServiceTests`; full budget endpoints, summary, CSV export, ownership checks, negative-cost rejection covered |

## Part L Status

| Feature | Status | Notes |
| --- | --- | --- |
| Public invitation page | Pass for nonblank smoke | Real published invitation needed for content QA |
| Mobile responsive layout | Manual checklist added | Automated DOM smoke does not validate viewport screenshots |
| Countdown, map, gallery, timeline, wishes | Present/foundation | Needs seeded published invitation for final visual QA |
| Music play button | Build/smoke pass | Browser autoplay behavior remains user-agent dependent |
| Khmer/English support | Pass baseline | i18n endpoint is public and frontend route builds |

## Part M Status

| Feature | Status | Notes |
| --- | --- | --- |
| Guest import/export | Present | Backend endpoints and tests exist |
| QR invitation / check-in | Present beta | Endpoints and routes exist; needs real event QA |
| Subscription/package system | Present beta | User/admin routes and endpoints exist |
| Premium templates | Present beta | Access check and static payment flow verified |
| ABA PayWay/KHQR payment | Pass for static MVP | Frontend uses only static create endpoint |
| Telegram sharing/payment verification | Pass for payment verification path | Bot calls internal endpoints with secret |
| Payment history/receipt | Present | Correct path is `/api/v1/me/payments` |
| Seating/table management | Present beta | Routes/endpoints exist; full scenario needs seeded guest/table data |
| Organization/team account | Present beta | CRUD and role endpoint exist; needs workflow QA |
| AI invitation assistant | Foundation | Deterministic assistant endpoints exist; not an external AI integration |

## Part N Security Status

| Security Area | Status | Evidence |
| --- | --- | --- |
| Private invitation access | Pass with service coverage | Access token/invite token validation exists in `InvitationService` |
| Invitation access token | Pass | Guest token lookup is invitation-scoped |
| RSVP validation | Pass | RSVP service tests and public/token endpoints |
| File upload validation | Pass | Extension, MIME, size, and signature checks covered |
| RBAC | Pass | Security config requires ADMIN for admin APIs; service ownership checks cover invitations/budget/media/guests |
| Payment protection | Pass | Internal endpoints require secret; admin endpoints require ADMIN; Telegram no-order-code and amount mismatch tests pass |

## Static ABA Payment Verification

Verified by static inspection and tests:

- Frontend user payment service calls only `POST /api/v1/template-payments/static/create`.
- No frontend code calls `/api/v1/template-payments/payway/create` or `/api/v1/payway/callback`.
- `TemplateCheckoutPage` sends amount `"0.01"` and explains the fixed static ABA test payment.
- Backend static payment path creates pending orders and rejects non-USD-0.01 amounts.
- User template access is created only after backend marks the order paid.
- Telegram bot calls `/api/v1/internal/template-payments/telegram-detect` and sends `X-ADMIN-PAYMENT-SECRET`.

## Browser Smoke Results

Automated command:

```powershell
node scripts/browser-smoke.mjs
```

Result: pass.

Routes checked:

- User: `/`, `/templates`, `/templates/royal/preview`, `/templates/royal/checkout`
- User protected: `/dashboard/events`, `/dashboard/profile`, `/dashboard/change-password`, `/dashboard/notifications`, `/dashboard/packages`, `/dashboard/payments`
- Invitation-specific: `/dashboard/invitations/1/budget`, `/dashboard/invitations/1/check-in`, `/dashboard/invitations/1/seating`
- Public invitation placeholders: `/i/demo-invitation`, `/i/demo-invitation?token=demo-token`
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/templates`, `/admin/invitations`, `/admin/reports`, `/admin/system-logs`

All routes rendered a nonblank React root.

## Flyway / Database Safety

Migration directory contains unique versions with no duplicates. Current published sequence preserves the existing main-branch history and adds forward migration `V13__add_account_planning_and_notification_schema.sql`.

Observed versions:

- V1
- V3
- V4
- V5
- V6
- V7
- V8
- V9
- V10
- V11
- V12
- V13

Note: there is no V2 in the current published main history. This is a historical gap, not a duplicate conflict.

## API Areas Audited

- Auth/account: `/api/auth/**`
- Invitations/customization/public view: `/api/v1/invitations/**`, `/api/v1/public/invitations/**`
- Media: `/api/v1/invitations/{id}/media/**`
- Guests/import/export: `/api/v1/invitations/{id}/guests/**`
- Delivery: `/api/v1/invitations/{id}/delivery/**`
- RSVP/wishes: `/api/v1/public/invitations/**`, `/api/v1/invitations/{id}/rsvps/**`
- Notifications: `/api/v1/notifications/**`
- Dashboard/reports: `/api/v1/dashboard/**`, `/api/v1/invitations/{id}/reports/**`
- Admin: `/api/v1/admin/**`, `/api/admin/**`
- Budget: `/api/v1/invitations/{id}/budget/**`
- QR/check-in/seating: `/api/v1/invitations/{id}/qr`, `/check-in/**`, `/seating/**`, `/tables/**`
- Payment: `/api/v1/template-payments/static/create`, `/api/v1/internal/template-payments/**`, `/api/v1/admin/template-payments/**`, `/api/v1/me/payments/**`

## Recommended Next Tasks

1. Add a CI job to run `node scripts/browser-smoke.mjs` after frontend builds.
2. Add seeded end-to-end fixtures for invitation publishing, RSVP, check-in, seating, budget, and public token pages.
3. Add viewport screenshot smoke for 360px, 390px, 768px, and desktop widths.
4. Split the large frontend user bundle with route-level dynamic imports.
5. Run Flyway against a disposable MySQL database in CI.

## Merge Recommendation

Safe to review and merge. Final backend, frontend, Telegram, browser smoke, and whitespace checks passed on this branch.

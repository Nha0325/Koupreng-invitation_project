# A-K and Extra QA Test Report

Date: 2026-06-16 Asia/Phnom Penh  
Branch: `test/a-to-k-full-qa`  
Source docs inspected: `docs/qa_a_to_k_checklist.md`, `docs/qa_a_to_n_checklist.md`, `docs/manual_browser_smoke_checklist.md`, `docs/features/feature-map.md`, `packages/api-contracts/openapi.yaml`

## Summary

Result: PASS for automated backend tests, backend package, both frontend linters, both frontend production builds, and browser smoke.

Live API curl commands are prepared in `docs/testing/a-to-k-api-smoke-commands.md`. They were not run against the developer's root `.env` database because that would create or mutate local application data. Backend verification used the Maven test profile and in-process automated tests.

## Changes Made During QA

- Added user dashboard route aliases for events, profile, change password, notifications, packages, payments, invitation budget, check-in, and seating.
- Fixed lint blockers in user/admin frontends: generated Vite cache ignores, route/barrel Fast Refresh exceptions, unused imports/variables, duplicate draft template key, and a missing hook dependency.
- Added a copy-invite action in the guest QR modal so the existing helper is reachable.

## Command Results

| Area | Command | Result |
| --- | --- | --- |
| User install | `npm install --no-audit --no-fund` in `apps/frontend-user` | PASS, up to date |
| Admin install | `npm install --no-audit --no-fund` in `apps/frontend-admin` | PASS, up to date |
| Backend tests | `.\mvnw.cmd clean test` in `apps/backend` | PASS, 127 tests |
| Backend package | `.\mvnw.cmd clean package` in `apps/backend` | PASS, 127 tests, jar built |
| User lint | `npm run lint` in `apps/frontend-user` | PASS |
| Admin lint | `npm run lint` in `apps/frontend-admin` | PASS |
| User build | `npm run build` in `apps/frontend-user` | PASS, Vite chunk-size warning only |
| Admin build | `npm run build` in `apps/frontend-admin` | PASS |
| Browser smoke | `node scripts/browser-smoke.mjs` | PASS, 22/22 routes rendered |

## A-K Coverage Map

| Part | Feature Area | Backend Surface | Frontend Surface | QA Result |
| --- | --- | --- | --- | --- |
| A | Auth and account | `AuthController`, `UserController`, auth/security tests | login, register, profile, change-password | PASS via backend tests, lint/build, route smoke |
| B | Invitation CRUD and publishing | `InvitationController`, `EventController` | invitations list/create/edit/preview routes | PASS via backend tests, lint/build |
| C | Guest management | `GuestController` | guests manager, QR modal | PASS via backend tests, lint/build |
| D | Public invitation and RSVP | `InvitationController`, `RsvpController` | `/i/:slug`, public invitation views | PASS via backend tests and browser smoke |
| E | Delivery and sharing | `InvitationDeliveryController` | invitation delivery route | PASS via controller mapping and build |
| F | Dashboard and reports | `DashboardReportController` | dashboard/events/report links | PASS via browser smoke and build |
| G | Media uploads | `MediaController`, `MediaServiceTests`, upload validator tests | invitation media route | PASS via backend tests and build |
| H | Budget | `BudgetController`, `BudgetServiceTests` | `/dashboard/invitations/:id/budget` | PASS via backend tests, route smoke |
| I | QR and check-in | `QrCodeController`, `CheckInController` | `/dashboard/invitations/:id/check-in` | PASS via route smoke and controller mapping |
| J | Admin management | `AdminManagementController`, admin controllers | admin dashboard/users/templates/invitations/reports/logs | PASS via admin build and smoke |
| K | Security and hardening | security filters, WAF, auth endpoint tests | protected route redirects | PASS via backend security tests and smoke |

## Extra Implemented Areas

| Area | Evidence | QA Result |
| --- | --- | --- |
| L Organizations | `OrganizationController`, organization frontend pages | Build verified, API smoke commands prepared |
| M Payments/packages | `TemplatePaymentController`, `PaymentHistoryController`, `SubscriptionController`, `TemplatePaymentServiceTests` | Backend tests, payment/package route smoke, build verified |
| N AI assistant | `AiInvitationAssistantController` | Controller mapping verified, API smoke command prepared |

## Browser Smoke Routes

All smoke routes returned a rendered React root:

- User: `/`, `/templates`, `/templates/royal/preview`, `/templates/royal/checkout`, `/dashboard/events`, `/dashboard/profile`, `/dashboard/change-password`, `/dashboard/notifications`, `/dashboard/packages`, `/dashboard/payments`, `/dashboard/invitations/1/budget`, `/dashboard/invitations/1/check-in`, `/dashboard/invitations/1/seating`, `/i/demo-invitation`, `/i/demo-invitation?token=demo-token`
- Admin: `/admin/login`, `/admin/dashboard`, `/admin/users`, `/admin/templates`, `/admin/invitations`, `/admin/reports`, `/admin/system-logs`

## Notes and Residual Risk

- The user production build still reports Vite's default chunk-size warning for the main JavaScript bundle; this is not a test failure.
- Maven logs include Mockito/JDK dynamic-agent warnings; tests still pass.
- Full live API mutation testing should be run on a throwaway database or staging environment using `docs/testing/a-to-k-api-smoke-commands.md`.

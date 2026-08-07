# Current Gap Status Reconciliation

This document reconciles previous audit findings against the current codebase state on `main` branch.

**Reconciliation Date:** 2026-08-07  
**Branch:** `main`

---

## Audit Item Reconciliation Table

| Finding ID | Finding Description | Audit Status | Current Status | Evidence | Affected Files | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FINDING-FRONT-HIGH-01** | `GuestsList.jsx` monolithic implementation combining UI, storage, API, and QR handling | PLANNED FOR REFACTORING | **ALREADY_FIXED** | Refactored in Phase 4 into modular domain architecture under `features/guests/` (`useGuests`, `useGuestMutations`, `GuestTable`, `GuestCard`, `GuestsPage`). | `apps/frontend-user/src/features/guests/` | Maintain modular Guest domain architecture and unit test coverage. |
| **FINDING-FRONT-HIGH-02** | Unconnected backend capabilities for Organization Management and AI Invitation Assistant | PLANNED FOR IMPLEMENTATION | **ALREADY_FIXED** | Organization Management UI complete in Phase 6 (`/dashboard/organizations`). AI Assistant UI complete in Phase 7 (`/dashboard/invitations/:id/assistant`). | `apps/frontend-user/src/features/organizations/`, `features/ai-assistant/`, `hostRoutes.jsx` | Maintain backend API integration and test coverage. |
| **FINDING-FRONT-MED-01** | Duplicate route aliases in `hostRoutes.jsx` (`/events`, `/event/list`, `/gift`, `/gifts`, `/profile`) | AUDITED & DOCUMENTED | **ALREADY_FIXED** | Canonicalized in Phase 2 under `/dashboard/*` with `<Navigate replace />` redirects for legacy aliases. | `apps/frontend-user/src/app/routes/hostRoutes.jsx` | Maintain canonical `/dashboard/*` paths. |
| **FINDING-FRONT-MED-02** | Ambiguity between unsaved `localStorage` drafts and backend authoritative data | AUDITED & DOCUMENTED | **ALREADY_FIXED** | Cleaned in Phase 5: Spring Boot endpoints are primary authoritative source for Guests, Budget, Gifts, and RSVPs. `localStorage` is kept solely for UI preferences and unsaved builder drafts. | `apps/frontend-user/src/shared/storage/`, `budgetApi.js`, `giftApi.js`, `rsvpApi.js` | Maintain server authority for domain state. |
| **FINDING-FRONT-LOW-01** | Form toast & modal backdrop style variances across features | AUDITED | **ALREADY_FIXED** | Standardized in Phase 3 with 11 core shared UI primitives (`Modal`, `ConfirmDialog`, `ToastContainer`, `Skeleton`, `StatusBadge`, `FormField`, `LoadingButton`). | `apps/frontend-user/src/shared/ui/` | Reuse shared UI primitives across new features. |
| **FINDING-CRIT-01** | Leaked Telegram Bot Token in historical Git commits | OPEN (RELEASE BLOCKER) | **STILL_VALID** | Commits `f99c9370`, `aeca1528` contain active token in commit diff. | `.env`, `.env.example`, Git history | Revoke token via `@BotFather`, run `git filter-repo`, and rotate dependent secrets. |
| **FINDING-HIGH-01** | Internal payment endpoint secret filter dependency | VERIFIED & MITIGATED | **ALREADY_FIXED** | `AdminPaymentSecretFilter.java` uses `constantTimeEquals` and enforces mandatory non-blank header validation. | `AdminPaymentSecretFilter.java`, `SecurityConfig.java` | Maintain current filter checks and test coverage. |
| **FINDING-HIGH-02** | Cross-invitation IDOR protection in Guest & RSVP operations | VERIFIED & MITIGATED | **ALREADY_FIXED** | `GuestService` and `CheckInService` strictly mandate `requireGuest(invitationId, guestId)`. | `GuestService.java`, `CheckInService.java` | Retain unit tests for ownership validation. |
| **FINDING-MED-01** | In-memory seating capacity concurrency check | OPEN (MEDIUM) | **STILL_VALID** | `SeatingService.java` calculates assigned seats in Java memory during assignment. | `SeatingService.java`, `EventTable.java` | Add optimistic locking (`@Version`) or DB lock on `EventTable`. |
| **FINDING-MED-02** | Public RSVP rate limiting | OPEN (MEDIUM) | **STILL_VALID** | WAF global 120 req/min applies, but dedicated per-slug RSVP submission rate limiting is absent. | `RsvpController.java`, `AuthRateLimitFilter.java` | Add dedicated rate limiting for public RSVP endpoint. |
| **FINDING-FRONT-MED-03** | Admin frontend gap audit & operational workflows | AUDITED & IMPLEMENTED | **ALREADY_FIXED** | Completed Phase 13: Added Admin Notification management UI, wired all admin pages to Spring Boot backend APIs, eliminated mock data, and verified responsive layout across 320px–1440px. | `apps/frontend-admin/src/` | Maintain admin test coverage. |

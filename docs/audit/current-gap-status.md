# Current Gap Status Reconciliation

This document reconciles previous audit findings against the current codebase state on `main` branch.

**Reconciliation Date:** 2026-08-07  
**Branch:** `main`

---

## Audit Item Reconciliation Table

| Finding ID | Finding Description | Audit Status | Current Status | Evidence | Affected Files | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **FINDING-FRONT-HIGH-01** | `GuestsList.jsx` monolithic implementation combining UI, storage, API, and QR handling | PLANNED FOR REFACTORING | **STILL_VALID** | `GuestsList.jsx` is 1,449 lines combining manual storage, API sync, RSVP, QR modal, and table views. | `apps/frontend-user/src/features/guests/GuestsList.jsx` | Refactor incrementally into `features/guests/` (api, hooks, model, components, GuestsPage). |
| **FINDING-FRONT-HIGH-02** | Unconnected backend capabilities for Organization Management and AI Invitation Assistant | PLANNED FOR IMPLEMENTATION | **PARTIALLY_FIXED** | `organizationApi.js` was added under `features/organizations/api/`, but Organization UI components, pages (`/dashboard/organizations`), and AI Assistant UI (`/dashboard/invitations/:id/assistant`) are missing. | `apps/frontend-user/src/features/organizations/`, `hostRoutes.jsx`, `AiInvitationAssistantController.java` | Implement Organization UI screens, AI Assistant UI screen, and register routes. |
| **FINDING-FRONT-MED-01** | Duplicate route aliases in `hostRoutes.jsx` (`/events`, `/event/list`, `/gift`, `/gifts`, `/profile`) | AUDITED & DOCUMENTED | **STILL_VALID** | `hostRoutes.jsx` lines 57–65 register duplicate top-level routes alongside `/dashboard/*`. | `apps/frontend-user/src/app/routes/hostRoutes.jsx` | Canonicalize host routes to `/dashboard/*` and use `<Navigate replace />` for legacy aliases. |
| **FINDING-FRONT-MED-02** | Ambiguity between unsaved `localStorage` drafts and backend authoritative data | AUDITED & DOCUMENTED | **STILL_VALID** | `weddingStorage.js` persists builder state in `localStorage` without forced backend sync on edit. | `apps/frontend-user/src/shared/storage/weddingStorage.js` | Treat `localStorage` solely as ephemeral unsaved draft buffer; mandate backend save on explicit publish/save actions. |
| **FINDING-FRONT-LOW-01** | Form toast & modal backdrop style variances across features | AUDITED | **STILL_VALID** | Independent modal and toast implementations in `GuestsList.jsx` vs `SeatingPage.jsx`. | `GuestsList.jsx`, `SeatingPage.jsx`, `BudgetPage.jsx` | Standardize modal overlay, backdrop blur, and toast components across shared UI. |
| **FINDING-CRIT-01** | Leaked Telegram Bot Token in historical Git commits | OPEN (RELEASE BLOCKER) | **STILL_VALID** | Commits `f99c9370`, `aeca1528` contain active token in commit diff. | `.env`, `.env.example`, Git history | Revoke token via `@BotFather`, run `git filter-repo`, and rotate dependent secrets. |
| **FINDING-HIGH-01** | Internal payment endpoint secret filter dependency | VERIFIED & MITIGATED | **ALREADY_FIXED** | `AdminPaymentSecretFilter.java` uses `constantTimeEquals` and enforces mandatory non-blank header validation. | `AdminPaymentSecretFilter.java`, `SecurityConfig.java` | Maintain current filter checks and test coverage. |
| **FINDING-HIGH-02** | Cross-invitation IDOR protection in Guest & RSVP operations | VERIFIED & MITIGATED | **ALREADY_FIXED** | `GuestService` and `CheckInService` strictly mandate `requireGuest(invitationId, guestId)`. | `GuestService.java`, `CheckInService.java` | Retain unit tests for ownership validation. |
| **FINDING-MED-01** | In-memory seating capacity concurrency check | OPEN (MEDIUM) | **STILL_VALID** | `SeatingService.java` calculates assigned seats in Java memory during assignment. | `SeatingService.java`, `EventTable.java` | Add optimistic locking (`@Version`) or DB lock on `EventTable`. |
| **FINDING-MED-02** | Public RSVP rate limiting | OPEN (MEDIUM) | **STILL_VALID** | WAF global 120 req/min applies, but dedicated per-slug RSVP submission rate limiting is absent. | `RsvpController.java`, `AuthRateLimitFilter.java` | Add dedicated rate limiting for public RSVP endpoint. |

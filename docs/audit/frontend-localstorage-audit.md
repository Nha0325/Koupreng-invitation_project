# Frontend LocalStorage & Domain State Audit

This document classifies every browser storage usage (`localStorage`, `sessionStorage`) and state store across `apps/frontend-user` after Phase 4 & Phase 5 domain state cleanup:

* **Category A: UI Preference** (`KEPT_UI_PREFERENCE`) — Retained for instant client initialization.
* **Category B: Legitimate Unsaved Draft** (`KEPT_UNSAVED_DRAFT`) — Client draft buffer before server save.
* **Category C: Server-Owned Domain Data** (`MIGRATED_TO_BACKEND`) — Spring Boot backend endpoints are primary authoritative source; browser fallback removed for authenticated users.

---

## Storage Key & State Classification Status

| Storage Key / Module | Current Usage | Classification | Current Status | Target Architecture & Remediation |
| :--- | :--- | :--- | :--- | :--- |
| `koupreng.lang` / `koupreng.locale` | UI language selection (Khmer vs English) | **Category A: UI Preference** | `KEPT_UI_PREFERENCE` | Retain in `localStorage` for instant i18n initialization on app boot. |
| `koupreng.auth.mode` / `koupreng_access_token` | Client session token storage mode | **Category A: UI Preference** | `KEPT_UI_PREFERENCE` | Retain in `sessionStorage`/`localStorage` based on `VITE_AUTH_STORAGE` configuration. |
| `koupreng_invitation_access_{slug}` | Verified passcode token for password-protected invitations | **Category A: UI Preference** | `KEPT_UI_PREFERENCE` | Retain in `sessionStorage` for active guest session duration. |
| `koupreng.wedding.drafts` (`weddingStorage.js`) | Unsaved wedding builder form inputs before publishing | **Category B: Legitimate Unsaved Draft** | `KEPT_UNSAVED_DRAFT` | Keep for local draft editing. Upon clicking "Save" or "Publish", sync to `POST /api/v1/invitations`. |
| `koupreng.host.activeEvent` (`hostPlanningStorage.js`) | Selected active event ID in host dashboard shell | **Category A: UI Preference** | `KEPT_UI_PREFERENCE` | Retain in `localStorage` to keep dashboard context during browser navigation. |
| `koupreng.host.manualGuests.{eventId}` | Host guest list stored locally when offline or unlinked | **Category C: Server-Owned Domain Data** | `MIGRATED_TO_BACKEND` | **Refactored in Phase 4:** Backend `GET /api/v1/invitations/{id}/guests` is authoritative. |
| `koupreng.host.guestGroups.{eventId}` / `guestCategories` | Guest category custom groupings | **Category A: UI Preference** | `KEPT_UI_PREFERENCE` | Host UI preference setting for custom local labels. |
| `koupreng.host.expenses.{eventId}` | Budget expenses stored in localStorage | **Category C: Server-Owned Domain Data** | `MIGRATED_TO_BACKEND` | **Refactored in Phase 5:** `BudgetService` backend endpoints (`GET /api/v1/invitations/{id}/budget`) are authoritative. |
| `koupreng.host.gifts.{eventId}` | Wedding gifts list stored in localStorage | **Category C: Server-Owned Domain Data** | `MIGRATED_TO_BACKEND` | **Refactored in Phase 5:** `WeddingGiftService` backend endpoints (`GET /api/v1/invitations/{id}/gifts`) are authoritative. |
| `koupreng.rsvps.{targetId}` | RSVP responses stored locally in `rsvpApi.js` | **Category C: Server-Owned Domain Data** | `MIGRATED_TO_BACKEND` | **Refactored in Phase 5:** `RsvpService` backend endpoints (`POST /v1/public/invitations/{slug}/rsvp`, `GET /wishes`) are authoritative. |
| `lastTemplatePaymentOrder` | Snapshotted order code during PayWay checkout flow | **Category B: Legitimate Unsaved Draft** | `KEPT_UNSAVED_DRAFT` | Retain in `sessionStorage` until payment confirmation completes. |

---

## Domain State Guidelines

1. **Backend Authoritative Source:** Authenticated dashboard screens (Guests, Budget, Gifts, RSVP, Seating, Check-in) fetch state directly from Spring Boot REST endpoints.
2. **Offline / Unsaved Draft Policy:** Unsaved wedding builder forms are kept in `weddingStorage.js` only until the user explicitly saves or publishes, at which point the backend ID becomes the primary key.
3. **No Blind Data Wiping:** UI preferences (`koupreng.lang`, active event filter) and active unsaved builder drafts remain intact to maintain a responsive user experience.

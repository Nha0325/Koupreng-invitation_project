# Koupreng Frontend Master Audit Report

**Date:** 2026-08-07  
**Role:** Chief Frontend Engineering + Product UX Agent  
**Repository:** `Ny-Panha/Koupreng-invitation_project`  
**Primary Applications:** `apps/frontend-user`, `apps/frontend-admin`  
**Backend Target:** `apps/backend`

---

## Executive Summary

A thorough 12-phase frontend engineering and product UX audit was performed on `apps/frontend-user` and `apps/frontend-admin`. The frontend applications are built with React, React Router v6, Axios, and custom CSS design systems, connecting to a Spring Boot 3 REST API.

The frontend demonstrates strong visual identity, modern Khmer/English typography, and rich interactive wedding template experiences. However, several architectural gaps exist where domain data (guest lists, budget items, rsvp responses) is duplicated between local storage and backend endpoints. Additionally, two backend capabilities (Organization / Team Management and AI Invitation Assistant) exist in the Spring Boot backend but lack frontend UI routes and components.

---

## Audit Findings & Risk Breakdown

### HIGH Severity

#### [FINDING-FRONT-HIGH-01] Guest Domain Monolith & State Duplication
* **Problem:** `GuestsList.jsx` is a 1,450-line monolithic component that combines manual local storage persistence (`hostPlanningStorage.js`), backend API synchronization (`guestApi.js`), RSVP aggregation, QR link generation, modal managers, and UI rendering in a single file.
* **Evidence:** `apps/frontend-user/src/features/guests/GuestsList.jsx`.
* **Affected Files:** `GuestsList.jsx`, `hostPlanningStorage.js`, `guestApi.js`.
* **Business Impact:** High risk of data desynchronization between browser storage and MySQL database, potential data loss during browser cache clear, and maintenance difficulty.
* **Recommended Fix:** Refactor `GuestsList.jsx` into a modular domain structure under `features/guests/`:
  - `features/guests/api/guestApi.js`
  - `features/guests/hooks/useGuests.js`
  - `features/guests/model/guestMappers.js`
  - `features/guests/components/GuestTable.jsx`, `GuestModal.jsx`, `GuestImportModal.jsx`
  - `features/guests/GuestsPage.jsx`
* **Status:** **PLANNED FOR REFACTORING**

#### [FINDING-FRONT-HIGH-02] Unconnected Backend Capabilities (Organizations & AI Assistant)
* **Problem:** The Spring Boot backend exposes complete controllers for Organization / Team Accounts (`OrganizationController.java`) and AI Copy Writing (`AiInvitationAssistantController.java`), but `apps/frontend-user` has no routes or UI components connecting to them.
* **Evidence:** `OrganizationController.java`, `AiInvitationAssistantController.java`, `hostRoutes.jsx`.
* **Affected Files:** `hostRoutes.jsx`, `apps/frontend-user/src/app/routes/hostRoutes.jsx`.
* **Business Impact:** Users cannot utilize team collaboration (role-based access for wedding planners/collaborators) or AI invitation text generation despite backend support.
* **Recommended Fix:** Implement frontend feature modules and routes:
  1. `/dashboard/organizations` (`OrganizationPage.jsx`, `OrganizationDetailPage.jsx`, `organizationApi.js`)
  2. `/dashboard/invitations/:invitationId/assistant` (`AiAssistantPage.jsx`, `aiApi.js`)
* **Status:** **PLANNED FOR IMPLEMENTATION**

---

### MEDIUM Severity

#### [FINDING-FRONT-MED-01] Duplicate Route Aliases & Path Inconsistencies
* **Problem:** `hostRoutes.jsx` defines duplicate aliases for events (`/dashboard/events`, `/events`, `/event/list`), gifts (`/gift`, `/gifts`), and profile (`/dashboard/profile`, `/profile`).
* **Evidence:** `hostRoutes.jsx` lines 39, 58, 59, 61, 62, 65.
* **Affected Files:** `hostRoutes.jsx`, `Sidebar.jsx`, `HostShell.jsx`.
* **Business Impact:** Confusing navigation state, broken active tab styling in navigation bars, and potential route mismatch.
* **Recommended Fix:** Consolidate routes into canonical `/dashboard/*` paths and add explicit `<Navigate replace />` redirects for legacy paths.
* **Status:** **AUDITED & DOCUMENTED**

#### [FINDING-FRONT-MED-02] Unsaved Local Draft vs Server Authority Ambiguity
* **Problem:** `weddingStorage.js` stores draft wedding builder forms in `localStorage.setItem("koupreng.wedding.drafts", ...)`. When editing existing published invitations, changes can remain in `localStorage` without syncing to `PUT /api/v1/invitations/{id}`.
* **Evidence:** `weddingStorage.js`, `EventsFeature.jsx`.
* **Affected Files:** `weddingStorage.js`, `CreateWeddingPage.jsx`, `InvitationEditPage.jsx`.
* **Business Impact:** User edits made on desktop are invisible on mobile or after logging in on another device.
* **Recommended Fix:** Treat `localStorage` solely as an ephemeral unsaved form buffer. Require explicit backend API save when switching screens or navigating away.
* **Status:** **AUDITED & DOCUMENTED**

---

### LOW Severity

#### [FINDING-FRONT-LOW-01] Form Toast & Modal Backdrop Style Variances
* **Problem:** Minor variations in modal backdrop opacity and toast timeout behavior between `GuestsList.jsx`, `SeatingPage.jsx`, and `BudgetPage.jsx`.
* **Evidence:** Compare modal overlays in `GuestsList.jsx` vs `SeatingPage.jsx`.
* **Affected Files:** `GuestsList.jsx`, `SeatingPage.jsx`, `BudgetPage.jsx`.
* **Recommended Fix:** Reuse shared `Modal` and `Toast` components from `src/shared/components/`.
* **Status:** **AUDITED**

---

## Refactoring Plan & Next Steps

1. **Phase 4 Execution:** Modularize `GuestsList.jsx` into `features/guests/` without breaking any existing UX or QR link behaviors.
2. **Phase 5 Execution:** Implement Organization management routes (`/dashboard/organizations`) and AI Invitation Assistant route (`/dashboard/invitations/:id/assistant`).
3. **Phase 9 Execution:** Clean up duplicate route aliases in `hostRoutes.jsx` with canonical redirects.
4. **Verification & Quality Gates:** Run `npm test`, lint, and build checks across `apps/frontend-user` and `apps/frontend-admin`.

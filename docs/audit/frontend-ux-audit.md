# Frontend UX / UI Quality Audit

This document details the visual hierarchy, typography (Khmer & English), responsiveness, routing aliases, accessibility, and performance audit for `apps/frontend-user` and `apps/frontend-admin`.

---

## 1. Typography & Internationalization (Khmer + English)

* **Khmer Typography:** Modern Khmer fonts (`Kantumruy Pro`, `Battambang`, `Moul` for headings) are integrated via CSS tokens.
* **Line Height & Line Wrapping:** Khmer text requires `line-height: 1.6` to 1.8 to prevent diacritic clipping (above and below base characters).
* **Word Breaking:** Long Khmer compound words in mobile tables and button labels require `word-break: break-word` and `overflow-wrap: anywhere` to prevent layout overflow in mobile viewports (<375px).
* **Bilingual UI Consistency:** Ensure all form field labels, error tooltips, toast notifications, and table headers dynamically translate when switching languages between Khmer (`km`) and English (`en`).

---

## 2. Canonical Routing & Aliases Resolution

The route audit identified several duplicate path aliases causing inconsistent browser history and potential state fragmentation.

| Canonical Route | Duplicate Alias(es) to Deprecate / Redirect | Reason & Remediation |
| :--- | :--- | :--- |
| `/dashboard/events` | `/events`, `/event/list` | `/dashboard/events` is the canonical route inside `HostShell`. Add `<Navigate to="/dashboard/events" replace />` for legacy routes. |
| `/dashboard/invitations/:id/gifts` | `/gift`, `/gifts` | Gift tracking belongs under specific invitation context. Redirect `/gift` and `/gifts` to `/dashboard/invitations`. |
| `/dashboard/profile` | `/profile` | Dashboard profile is canonical under `HostShell`. Add redirect from `/profile` to `/dashboard/profile`. |
| `/dashboard/invitations/:id/guests` | `/guests` | Guests management should scope to invitation ID. `/guests` should prompt or redirect to active invitation context. |

---

## 3. Visual Hierarchy, Spacing & Responsiveness

* **Mobile (320px – 480px):**
  * Data tables in `GuestsList.jsx`, `SeatingPage.jsx`, and `BudgetPage.jsx` require horizontal scrolling containers (`overflow-x: auto`) or card-view transformations on small screens.
  * Form action buttons in modals should stack vertically on narrow devices.
* **Empty & Loading States:**
  * Implement unified Skeleton loaders (`SkeletonCard`, `SkeletonTable`) instead of raw spinner text during API fetch states.
  * Ensure clear Khmer/English empty state illustrations for zero invitations, empty guest lists, and empty rsvp responses.
* **Modal & Toast Consistency:**
  * Standardize modal overlays across `GuestsList`, `SeatingPage`, `OrganizationPage`, and `AiAssistantPage` with backdrop blur, focus lock, and `Escape` key listeners.

---

## 4. Payment UX State Machine

The frontend must strictly adhere to server-authoritative payment states:

1. `CREATED` / `PENDING`: Order created; display static ABA KHQR link or PayWay QR code with order code note prompt.
2. `CONFIRMED` / `PAID`: Payment verified by backend callback or admin confirmation. Unlock template access.
3. `FAILED` / `EXPIRED` / `CANCELLED`: Show clear failure/expiration message with options to retry or select another package.
4. **Security Enforcement:** Never use query parameters (e.g. `?status=success`) or client-side flags to grant premium template entitlement. Entitlement checks must always verify against `GET /api/v1/me/templates/{templateId}/access`.

---

## 5. Performance & Asset Optimization

* **Code Splitting:** Apply route-level lazy loading (`React.lazy` + `Suspense`) for heavy feature routes (`WeddingSite.jsx`, `GuestsList.jsx`, `CanvaKhmerWeddingTemplate.jsx`, `SeatingPage.jsx`).
* **Media Compression:** Heavy audio files (`music/`), video files, and high-res cover photos in templates should utilize lazy loading and compressed WebP/WebM formats via Cloudinary or local upload handlers.

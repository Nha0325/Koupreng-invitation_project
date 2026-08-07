# Frontend ↔ Backend Capability Matrix

This document provides a comprehensive mapping between frontend routes, UI components, state managers, API clients, Spring Boot backend endpoints, services, and database tables across `apps/frontend-user`, `apps/frontend-admin`, and `apps/backend`.

---

## Capability Status Classifications

* **`IMPLEMENTED_AND_CONNECTED`**: Fully wired end-to-end between frontend UI, API client, backend controller, service, and database.
* **`IMPLEMENTED_FRONTEND_INCOMPLETE`**: Backend fully exists; frontend has UI or partial client but lacks full UI flows.
* **`BACKEND_EXISTS_FRONTEND_MISSING`**: Backend controller and service exist and are tested, but no frontend route/UI exists.
* **`FRONTEND_EXISTS_BACKEND_MISSING`**: Frontend UI exists relying on `localStorage` or mock data because backend support is missing.
* **`PARTIAL`**: Connected but missing key features (e.g. pagination, error states, or field mappings).
* **`DEAD_CODE`**: Frontend route or backend endpoint exists but is unreachable or superseded.
* **`DUPLICATE`**: Multiple frontend routes or API clients pointing to the same backend capability.
* **`EXPERIMENTAL`**: Feature flag or stubbed service (e.g. AI assistant stub).

---

## Capability Mapping Matrix

| Domain Capability | Status | Frontend Route / Component | Frontend API Client / Storage | Backend Endpoint | Backend Service | Database Entity / Table |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **User Login / Reg** | `IMPLEMENTED_AND_CONNECTED` | `/login`, `/register` (`AuthPage.jsx`) | `authApi.js` | `POST /api/auth/login`, `POST /api/auth/register` | `AuthService` | `AppUser` (`users`) |
| **OAuth (Google / Telegram)** | `IMPLEMENTED_AND_CONNECTED` | `/login` (`SocialAuthButtons.jsx`) | `authApi.js` | `POST /api/auth/google`, `POST /api/auth/telegram` | `AuthService`, `GoogleIdentityVerifier`, `TelegramIdentityVerifier` | `AppUser` (`users`) |
| **User Profile / Password** | `IMPLEMENTED_AND_CONNECTED` | `/dashboard/profile`, `/profile`, `/dashboard/change-password` | `userApi.js` | `GET /api/users/me`, `PATCH /api/users/me`, `POST /api/users/me/profile-image` | `UserService`, `AccountService` | `AppUser` (`users`) |
| **Events Management** | `DUPLICATE` / `PARTIAL` | `/dashboard/events`, `/events`, `/event/list` (`EventsPage.jsx`) | `eventApi.js` + `hostPlanningStorage.js` | `GET /api/v1/events`, `POST /api/v1/events`, `DELETE /api/v1/events/{id}` | `EventService` | `Event` (`events`) |
| **Invitation List & CRUD** | `IMPLEMENTED_AND_CONNECTED` | `/dashboard/invitations`, `/dashboard/invitations/new`, `/dashboard/invitations/:id/edit` | `invitationApi.js` | `GET /api/v1/invitations/my`, `POST /api/v1/invitations`, `PUT /api/v1/invitations/{id}` | `InvitationService` | `UserInvitation` (`user_invitations`) |
| **Invitation Preview / Public View** | `IMPLEMENTED_AND_CONNECTED` | `/w/:slug`, `/i/:slug`, `/dashboard/invitations/:id/preview` | `invitationApi.js` | `GET /api/v1/public/invitations/{slug}`, `POST /api/v1/public/invitations/{slug}/access/verify` | `InvitationService` | `UserInvitation` (`user_invitations`) |
| **Template Catalog** | `IMPLEMENTED_AND_CONNECTED` | `/templates/browse`, `/templates/browse/:id` | `templateCatalogApi.js` | `GET /api/v1/templates`, `GET /api/v1/templates/{id}` | `TemplateCatalogService` | `InvitationTemplate` (`invitation_templates`) |
| **Template Payments (PayWay/Static)**| `IMPLEMENTED_AND_CONNECTED` | `/dashboard/templates/paid`, `/payments/:orderCode/status` | `templatePaymentApi.js` | `POST /api/v1/template-payments/create`, `GET /api/v1/template-payments/{orderCode}` | `TemplatePaymentService`, `AbaPayWayService` | `TemplatePaymentOrder` (`template_payment_orders`) |
| **Internal Telegram Payments** | `IMPLEMENTED_AND_CONNECTED` | `apps/telegram-bot` (`main.py`) | Python `httpx` + `X-ADMIN-PAYMENT-SECRET` | `POST /api/v1/internal/template-payments/confirm`, `POST /api/v1/internal/template-payments/telegram-detect` | `TemplatePaymentService` | `TemplatePaymentOrder`, `UserTemplateAccess` |
| **Media Gallery / Uploads** | `IMPLEMENTED_AND_CONNECTED` | `/dashboard/invitations/:id/media` | `mediaApi.js` | `POST /api/v1/invitations/{id}/media/gallery`, `DELETE /api/v1/invitations/{id}/media/{mediaId}` | `MediaService`, `LocalStorageService`, `CloudinaryStorageService` | `MediaFile` (`media_files`) |
| **Guest Management** | `PARTIAL` | `/guests`, `/dashboard/invitations/:id/guests` | `guestApi.js` + `GuestsList.jsx` local state | `GET /api/v1/invitations/{id}/guests`, `POST /api/v1/invitations/{id}/guests`, `POST /api/v1/invitations/{id}/guests/import` | `GuestService` | `Guest` (`guests`) |
| **RSVP Submissions & Wishes** | `IMPLEMENTED_AND_CONNECTED` | `/i/:slug` (RSVP modal / wishes section) | `rsvpApi.js` | `POST /api/v1/public/invitations/{slug}/rsvp`, `GET /api/v1/public/invitations/{slug}/wishes` | `RsvpService` | `Rsvp` (`rsvps`) |
| **Check-in (QR & Manual)** | `IMPLEMENTED_AND_CONNECTED` | `/dashboard/invitations/:id/check-in` | `checkInApi.js` | `POST /api/v1/invitations/{id}/check-in/scan`, `POST /api/v1/invitations/{id}/guests/{guestId}/check-in` | `CheckInService` | `GuestCheckIn` (`guest_check_ins`) |
| **Seating & Table Allocation** | `IMPLEMENTED_AND_CONNECTED` | `/dashboard/invitations/:id/seating` | `seatingApi.js` | `GET /api/v1/invitations/{id}/seating`, `POST /api/v1/invitations/{id}/seating/tables`, `POST /api/v1/invitations/{id}/seating/assignments` | `SeatingService` | `EventTable`, `GuestSeatAssignment` |
| **Budget & Expense Tracker** | `DUPLICATE` / `PARTIAL` | `/dashboard/invitations/:id/budget`, `/expenses` | `budgetApi.js` + `hostPlanningStorage.js` | `GET /api/v1/invitations/{id}/budget`, `POST /api/v1/invitations/{id}/budget/items` | `BudgetService` | `Budget`, `BudgetItem` |
| **Wedding Gift Tracker** | `DUPLICATE` / `PARTIAL` | `/gift`, `/gifts` | `giftApi.js` + `hostPlanningStorage.js` | `GET /api/v1/invitations/{id}/gifts`, `POST /api/v1/invitations/{id}/gifts` | `WeddingGiftService` | `WeddingGift` (`wedding_gifts`) |
| **Subscription Packages** | `IMPLEMENTED_AND_CONNECTED` | `/dashboard/packages`, `/dashboard/subscriptions` | `subscriptionApi.js` | `GET /api/v1/packages`, `GET /api/v1/me/subscriptions`, `POST /api/v1/me/subscriptions/purchase` | `SubscriptionService` | `SubscriptionPackage`, `Subscription` |
| **Notifications** | `IMPLEMENTED_AND_CONNECTED` | `/dashboard/notifications` | `notificationApi.js` | `GET /api/v1/notifications`, `PATCH /api/v1/notifications/{id}/read` | `NotificationService` | `Notification` (`notifications`) |
| **Organizations / Team Accounts** | `BACKEND_EXISTS_FRONTEND_MISSING` | Missing (`/dashboard/organizations`) | Missing (`organizationApi.js`) | `GET /api/v1/organizations`, `POST /api/v1/organizations`, `POST /api/v1/organizations/{id}/members` | `OrganizationService` | `Organization`, `OrganizationMember` |
| **AI Invitation Assistant** | `BACKEND_EXISTS_FRONTEND_MISSING` | Missing (`/dashboard/invitations/:id/assistant`) | Missing (`aiApi.js`) | `POST /api/v1/invitation-copy`, `POST /api/v1/invitation/story`, `POST /api/v1/invitation/translate` | `AiInvitationAssistantService` | None (Stateless) |
| **Admin Operations** | `IMPLEMENTED_AND_CONNECTED` | `apps/frontend-admin` (`/admin/users`, `/admin/templates`, `/admin/payments`) | `adminManagementService.js` | `GET /api/v1/admin/users`, `GET /api/v1/admin/templates`, `GET /api/v1/admin/payments` | `AdminManagementService` | `AppUser`, `InvitationTemplate`, `TemplatePaymentOrder` |

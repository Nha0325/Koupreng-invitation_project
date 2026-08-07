# Backend & Frontend Contract Specification

This document maps all backend REST endpoints to their respective frontend callers (`apps/frontend-user`, `apps/frontend-admin`, and `apps/telegram-bot`), verifying HTTP methods, URIs, authentication rules, request/response DTO formats, and business error conditions.

---

## 1. Authentication & Account Management

### `POST /api/auth/login`
* **Caller:** `frontend-user` (`authApi.js`), `frontend-admin` (`authService.js`)
* **Auth Requirement:** `permitAll()` (`skipAuth: true`)
* **Request DTO:** `{ identifier: string, password: string }`
* **Response DTO:** `ApiResponse<AuthResponse>` containing `token`, `user: { id, email, username, fullName, role }`
* **Error States:** `401 Unauthorized` (Invalid credentials), `429 Too Many Requests` (Rate limit exceeded)

### `POST /api/auth/register`
* **Caller:** `frontend-user` (`authApi.js`)
* **Auth Requirement:** `permitAll()` (`skipAuth: true`)
* **Request DTO:** `{ email: string, username: string, password: string, fullName: string }`
* **Response DTO:** `ApiResponse<AuthResponse>`
* **Error States:** `400 Bad Request` (Email or username already exists / invalid format)

### `POST /api/auth/google`
* **Caller:** `frontend-user` (`authApi.js`)
* **Auth Requirement:** `permitAll()` (`skipAuth: true`)
* **Request DTO:** `{ idToken: string }`
* **Response DTO:** `ApiResponse<AuthResponse>`

### `POST /api/auth/telegram`
* **Caller:** `frontend-user` (`authApi.js`)
* **Auth Requirement:** `permitAll()` (`skipAuth: true`)
* **Request DTO:** `{ id, first_name, last_name, username, photo_url, auth_date, hash }`
* **Response DTO:** `ApiResponse<AuthResponse>`

---

## 2. Public Invitation & RSVP Endpoints

### `GET /api/v1/public/invitations/{slug}`
* **Caller:** `frontend-user` (`invitationApi.js`)
* **Auth Requirement:** `permitAll()` (`skipAuth: true`)
* **Query Params:** `?token={inviteToken}`
* **Response DTO:** `ApiResponse<PublicInvitationResponse>`
* **Error States:** `404 Not Found` (Invitation not published or deleted)

### `POST /api/v1/public/invitations/{slug}/rsvp`
* **Caller:** `frontend-user` (`rsvpApi.js`)
* **Auth Requirement:** `permitAll()` (`skipAuth: true`)
* **Query Params:** `?token={inviteToken}`
* **Request DTO:** `{ guestName: string, phone?: string, email?: string, responseStatus: "ATTENDING" | "NOT_ATTENDING" | "MAYBE", attendeeCount?: number, message?: string }`
* **Response DTO:** `ApiResponse<RsvpResponse>`
* **Error States:** `400 Bad Request` (RSVP deadline passed, attendee count invalid)

---

## 3. Template Payments & Internal Bot Integration

### `POST /api/v1/template-payments/create`
* **Caller:** `frontend-user` (`templateCatalogApi.js`)
* **Auth Requirement:** `authenticated()`
* **Request DTO:** `{ templateId: number, templateName: string, packageName: string, amount: number, currency: "USD" | "KHR" }`
* **Response DTO:** `ApiResponse<CreateTemplatePaymentResponse>` containing `orderCode`, `checkoutUrl`, `expiresAt`

### `POST /api/v1/internal/template-payments/confirm`
* **Caller:** `telegram-bot` (`main.py`)
* **Auth Requirement:** Internal Header Filter (`X-ADMIN-PAYMENT-SECRET`)
* **Request DTO:** `{ orderCode: string, amount: number, confirmedBy: string }`
* **Response DTO:** `ApiResponse<PaymentConfirmResponse>`
* **Error States:** `401 Unauthorized` (Missing secret header), `403 Forbidden` (Invalid secret header), `400 Bad Request` (Amount mismatch)

### `POST /api/v1/internal/template-payments/telegram-detect`
* **Caller:** `telegram-bot` (`main.py`)
* **Auth Requirement:** Internal Header Filter (`X-ADMIN-PAYMENT-SECRET`)
* **Request DTO:** `{ rawMessage: string, detectedBy: string, telegramChatId: string, telegramMessageId: string, detectedOrderCode: string, detectedAmount: number, detectedCurrency: string, paywayTransactionId?: string, paywayApprovalCode?: string }`
* **Response DTO:** `ApiResponse<PaymentConfirmResponse>`

---

## 4. Admin API Endpoints

### `GET /api/v1/admin/users`
* **Caller:** `frontend-admin` (`adminManagementService.js`)
* **Auth Requirement:** `hasRole('ADMIN')`
* **Response DTO:** `ApiResponse<List<UserManagementResponse>>`

### `PATCH /api/v1/admin/users/{userId}/activate`
* **Caller:** `frontend-admin` (`adminManagementService.js`)
* **Auth Requirement:** `hasRole('ADMIN')`
* **Response DTO:** `ApiResponse<UserManagementResponse>`

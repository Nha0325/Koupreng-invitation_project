# Koupreng Business Invariants

This document codifies the mandatory business domain rules and invariants enforced strictly by the Spring Boot backend service.

---

## 1. Domain Ownership Invariants
* **Authority:** All domain data (Users, Invitations, Guests, RSVPs, Seating, Payments, Subscriptions, Organizations) is owned and persisted exclusively by the Spring Boot backend. Client-side state and browser storage (`localStorage`) must never be treated as authoritative business data.
* **Passcode & Token Enforcement:** Private or password-protected invitations must be validated server-side during slug verification (`/api/v1/public/invitations/{slug}/access/verify`).

## 2. Guest & Invitation Ownership Invariants
* **Cross-Invitation IDOR Prevention:** The backend must never accept a `(invitationId, guestId)` tuple without validating that `guest.getInvitation().getId()` matches `invitationId`.
* **Guest Uniqueness:** Within a single invitation, guests must have unique email addresses and phone numbers.
* **Invite Token Security:** Every guest record generates a unique `inviteToken` (`UUID` hex string) used to resolve public personalized links without exposing raw database IDs.

## 3. RSVP Domain Invariants
* **Deadline Enforcement:** RSVPs submitted past `invitation.rsvpDeadline` must be rejected with `400 Bad Request`.
* **Attendee Count Invariants:**
  * `NOT_ATTENDING` RSVPs must automatically set `attendeeCount = 0`.
  * `ATTENDING` RSVPs must mandate `attendeeCount >= 1`.
  * Negative attendee counts are strictly forbidden.

## 4. Check-in Business Invariants
* **Transactional State Machine:** Check-in status transitions between `CHECKED_IN`, `ALREADY_CHECKED_IN`, `INVALID_TOKEN`, and `WRONG_INVITATION`.
* **Idempotent Scans:** Rescanning a previously checked-in QR token returns `ALREADY_CHECKED_IN` with the original arrival timestamp without duplicating check-in log records.

## 5. Seating Domain Invariants
* **Table Belonging:** An `EventTable` must belong to the specified `invitationId`.
* **Seat Capacity Limits:** Table assignment enforces `assignedSeats + requestedSeats <= table.capacity`. Over-allocation must be rejected with `400 Bad Request` or `409 Conflict`.
* **Cascade Unassignment:** Deleting a guest automatically deletes associated seat assignments and clears `guest.tableNumber`. Deleting a table with assigned guests is rejected until guests are unassigned.

## 6. Payment & Entitlement State Machine
* **Payment States:** `CREATED` → `PENDING` / `QR_CREATED` → `PAID` (or `FAILED` / `EXPIRED` / `REJECTED`).
* **Frontend Non-Authority:** The frontend cannot mark a payment successful or unlock premium templates directly.
* **Backend Transactional Unlock:** Premium template access (`UserTemplateAccess`) is created in the exact same database transaction that transitions `TemplatePaymentOrder` to `PAID`.
* **Static ABA Fixed Amount:** Static ABA payments are strictly fixed to `USD 0.01` with order code matching in the payment note.

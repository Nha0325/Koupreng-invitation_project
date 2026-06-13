# RSVP API

Verified controller: `RsvpController`.

Public routes:
- `POST /api/v1/public/invitations/{slug}/rsvp` role: `PUBLIC`
- `POST /api/v1/public/invitations/{slug}/guests/{inviteToken}/rsvp` role: `PUBLIC`
- `GET /api/v1/public/invitations/{slug}/rsvp-summary-public` role: `PUBLIC`
- `GET /api/v1/public/invitations/{slug}/wishes` role: `PUBLIC`

Private routes:
- `GET /api/v1/invitations/{invitationId}/rsvps` role: `USER`
- `GET /api/v1/invitations/{invitationId}/rsvps/summary` role: `USER`
- `PATCH /api/v1/invitations/{invitationId}/rsvps/{rsvpId}` role: `USER`
- `DELETE /api/v1/invitations/{invitationId}/rsvps/{rsvpId}` role: `USER`
- `GET /api/v1/invitations/{invitationId}/wishes` role: `USER`

Ownership:
- RSVP rows are scoped to one `invitationId`.

Schemas:
- Insufficient data to verify full request and response schemas in this document.

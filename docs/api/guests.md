# Guests API

Verified controller: `GuestController`.

Base path: `/api/v1/invitations/{invitationId}/guests`

Routes:
- `POST /` role: `USER`
- `GET /` role: `USER`
- `GET /grouped` role: `USER`
- `GET /send-list` role: `USER`
- `GET /{guestId}` role: `USER`
- `PUT /{guestId}` role: `USER`
- `DELETE /{guestId}` role: `USER`
- `GET /search` role: `USER`
- `POST /import` role: `USER`
- `POST /import-file` role: `USER`
- `GET /export` role: `USER`

Ownership:
- Guests are scoped to one `invitationId`.

Schemas:
- Insufficient data to verify full request and response schemas in this document.

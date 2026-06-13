# Delivery API

Verified controller: `InvitationDeliveryController`.

Base path: `/api/v1/invitations/{invitationId}/delivery`

Routes:
- `POST /prepare` role: `USER`
- `GET /summary` role: `USER`
- `GET /guests/{guestId}/share-message` role: `USER`
- `POST /guests/{guestId}/mark-shared` role: `USER`
- `POST /email` role: `USER`
- `POST /reminders` role: `USER`
- `GET /events` role: `USER`

Ownership:
- Delivery events are scoped to one `invitationId`.

Schemas:
- Insufficient data to verify full request and response schemas in this document.

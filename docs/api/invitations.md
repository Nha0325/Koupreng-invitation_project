# Invitations API

Verified controller: `InvitationController`.

Routes:
- `POST /api/v1/invitations` role: `USER`
- `GET /api/v1/invitations/my` role: `USER`
- `GET /api/v1/invitations/my/status/{status}` role: `USER`
- `GET /api/v1/invitations/{id}` role: `USER`
- `PUT /api/v1/invitations/{id}` role: `USER`
- `DELETE /api/v1/invitations/{id}` role: `USER` or `ADMIN`
- `PATCH /api/v1/invitations/{id}/draft` role: `USER`
- `PATCH /api/v1/invitations/{id}/publish` role: `USER`
- `PATCH /api/v1/invitations/{id}/unpublish` role: `USER`
- `GET /api/v1/invitations/{id}/preview` role: `USER`
- `GET /api/v1/invitations/{id}/customization` role: `USER`
- `PUT /api/v1/invitations/{id}/customization` role: `USER`
- `GET /api/v1/public/invitations/{slug}` role: `PUBLIC`
- `GET /api/v1/public/invitations/{slug}/guest-view` role: `PUBLIC`
- `POST /api/v1/public/invitations/{slug}/access/verify` role: `PUBLIC`

Ownership rule:
- Private invitation APIs must verify owner or admin before mutation.
- Child records must use `invitationId`.

Delete flow:
1. Verify authenticated user.
2. Verify invitation owner or `ADMIN`.
3. Delete delivery events, notifications, RSVPs, guest check-ins, seat assignments, guests, budget items, budget, wedding gifts, media files, event tables.
4. Delete the invitation.

Request and response bodies:
- Insufficient data to verify full schemas in this document.

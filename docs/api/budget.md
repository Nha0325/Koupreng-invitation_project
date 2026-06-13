# Budget API

Verified controller: `BudgetController`.

Routes:
- `GET /api/v1/invitations/{invitationId}/budget` role: `USER`
- `PUT /api/v1/invitations/{invitationId}/budget` role: `USER`
- `GET /api/v1/invitations/{invitationId}/budget/summary` role: `USER`
- `POST /api/v1/invitations/{invitationId}/budget/items` role: `USER`
- `PUT /api/v1/invitations/{invitationId}/budget/items/{itemId}` role: `USER`
- `DELETE /api/v1/invitations/{invitationId}/budget/items/{itemId}` role: `USER`
- `GET /api/v1/invitations/{invitationId}/budget/export` role: `USER`
- `GET /api/v1/admin/invitations/{invitationId}/budget` role: `ADMIN`
- `GET /api/v1/invitations/{invitationId}/budget-items` role: `USER`
- `POST /api/v1/invitations/{invitationId}/budget-items` role: `USER`
- `PUT /api/v1/invitations/{invitationId}/budget-items/{itemId}` role: `USER`
- `DELETE /api/v1/invitations/{invitationId}/budget-items/{itemId}` role: `USER`

Ownership:
- Budget and budget items are scoped to one `invitationId`.

Schemas:
- Insufficient data to verify full request and response schemas in this document.

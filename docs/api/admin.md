# Admin API

Verified controllers: `AdminManagementController`, `AdminInvitationController`, `AdminNotificationController`, `AdminUserController`, plus admin routes in `TemplatePaymentController`, `BudgetController`, and `DashboardReportController`.

Role requirement:
- `/api/v1/admin/**` requires `ADMIN`.
- `/api/admin/**` requires `ADMIN`.

Representative verified routes:
- `GET /api/v1/admin/users`
- `GET /api/v1/admin/users/{userId}`
- `PATCH /api/v1/admin/users/{userId}/activate`
- `PATCH /api/v1/admin/users/{userId}/deactivate`
- `PATCH /api/v1/admin/users/{userId}/role`
- `GET /api/v1/admin/templates`
- `POST /api/v1/admin/templates`
- `PUT /api/v1/admin/templates/{templateId}`
- `DELETE /api/v1/admin/templates/{templateId}`
- `GET /api/v1/admin/invitations`
- `GET /api/v1/admin/invitations/{invitationId}`
- `PATCH /api/v1/admin/invitations/{invitationId}/moderate`
- `GET /api/v1/admin/reports/users`
- `GET /api/v1/admin/reports/invitations`
- `GET /api/v1/admin/reports/payments`
- `GET /api/v1/admin/system-logs`
- `GET /api/v1/admin/payments`
- `GET /api/admin/invitations`
- `GET /api/admin/users`

Schemas:
- Insufficient data to verify full request and response schemas in this document.

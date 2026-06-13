# System Overview

Components:
- `apps/frontend-user`: public and authenticated host-facing React app.
- `apps/frontend-admin`: separate React admin app.
- `apps/backend`: Spring Boot API.
- `apps/telegram-bot`: Telegram bot service.
- MySQL: backend persistence.

Data flow:
- Browser apps call `/api` through Vite proxy during local development.
- Backend exposes `/api/auth`, `/api/v1/**`, `/api/admin/**`, and `/api/users/me`.
- Invitation child data is scoped by `invitationId`.

Security boundaries verified from code:
- `/api/v1/admin/**` requires `ADMIN`.
- `/api/admin/**` requires `ADMIN`.
- Public invitation/template/auth routes are explicitly permitted in `SecurityConfig`.

Insufficient data to verify:
- Production deployment topology.
- Cloud provider.
- Complete module package refactor.

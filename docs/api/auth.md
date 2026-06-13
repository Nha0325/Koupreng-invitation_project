# Auth API

Verified controller: `AuthController`.

Routes:
- `POST /api/auth/register` role: `PUBLIC`
- `POST /api/auth/login` role: `PUBLIC`
- `POST /api/auth/google` role: `PUBLIC`
- `POST /api/auth/telegram` role: `PUBLIC`
- `POST /api/auth/logout` role: `USER`
- `GET /api/auth/me` role: `USER`
- `PUT /api/auth/me` role: `USER`
- `POST /api/auth/change-password` role: `USER`
- `POST /api/auth/forgot-password` role: `PUBLIC`
- `POST /api/auth/reset-password` role: `PUBLIC`

Request and response bodies:
- Insufficient data to verify full schemas in this document. See DTOs under `apps/backend/src/main/java/com/koupreng/backend/dto`.

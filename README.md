# Koupreng

Koupreng is a Khmer invitation platform with a user frontend, admin frontend, Spring Boot backend, and Telegram bot.

## Folder Structure

```text
Koupreng-invitation_project/
├── apps/
│   ├── frontend-user/
│   ├── frontend-admin/
│   ├── backend/
│   └── telegram-bot/
├── packages/
│   ├── shared-types/
│   ├── shared-ui/
│   ├── shared-utils/
│   └── api-contracts/
├── docs/
├── infra/
├── scripts/
├── tools/
├── .github/
├── .env.example
├── README.md
└── CHANGELOG.md
```

## Tech Stack

- `apps/frontend-user`: React, Vite, Axios.
- `apps/frontend-admin`: React, Vite, Axios.
- `apps/backend`: Spring Boot, Spring Security, JWT, Spring Data JPA, MySQL.
- `apps/telegram-bot`: Python bot service.

## Setup

Linux/macOS:

```bash
chmod +x scripts/setup.sh scripts/dev.sh scripts/git-pull.sh scripts/git-push.sh scripts/git-sync.sh
./scripts/setup.sh
```

Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\setup.ps1
```

## Run Locally

Backend:

```bash
cd apps/backend
./mvnw spring-boot:run
```

Frontend user:

```bash
cd apps/frontend-user
npm install
npm run dev
```

Frontend admin:

```bash
cd apps/frontend-admin
npm install
npm run dev
```

All local services:

```bash
./scripts/dev.sh
```

Default local URLs:

- Backend: `http://localhost:8080`
- Frontend user: `http://localhost:5173`
- Frontend admin: `http://localhost:5174`
- Telegram bot: `http://localhost:8000`

## Environment

Do not commit `.env` files. Use committed `.env.example` files as templates only.

Backend local env:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Frontend user local env:

```bash
cp apps/frontend-user/.env.example apps/frontend-user/.env.local
```

Frontend admin local env:

```bash
cp apps/frontend-admin/.env.example apps/frontend-admin/.env.local
```

Root `.env.example` is kept for shared deployment-level examples.

## API Clients

- User frontend API client: `apps/frontend-user/src/shared/api/client.js`
- Admin frontend API client: `apps/frontend-admin/src/shared/api/adminHttpClient.js`

Local Vite requests use `/api` and proxy to the backend.

## Invitation Ownership Rule

Invitation child data is scoped by `invitationId`. Guests, budget items, wedding gifts, RSVPs, media files, delivery events, and invitation notifications must not be queried or deleted across invitations.

Safe delete endpoint:

```text
DELETE /api/v1/invitations/{invitationId}
```

The backend verifies the authenticated owner or `ADMIN`, deletes invitation-scoped child rows, then deletes that invitation.

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
chmod +x scripts/dev/*.sh scripts/maintenance/*.sh
./scripts/dev/setup.sh
```

Windows PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\dev\setup.ps1
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
./scripts/dev/dev.sh
```

Default local URLs:

- Backend: `http://localhost:8080`
- Frontend user: `http://localhost:5173`
- Frontend admin: `http://localhost:5174`
- Telegram bot: `http://localhost:8000`

## Environment

Do not commit `.env`. Backend, frontend user, and frontend admin all read configuration from the root `.env` file.

```bash
cp .env.example .env
```

Use `VITE_*` keys in the root `.env` for browser-exposed frontend settings. Keep secrets such as `DB_PASSWORD`, `JWT_SECRET`, and `TELEGRAM_BOT_TOKEN` in root `.env` only.

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

# Koupreng - Khmer Wedding Invitation Platform

Koupreng is a Khmer wedding invitation platform with a user-facing invitation builder, a separate admin frontend, and a Spring Boot API backed by MySQL.

## Project Structure

```text
Koupreng-invitation_project/
├── frontend-user/        ← User-facing site, React + Vite
├── frontend-admin/       ← Admin dashboard, React + Vite
├── backend/              ← Spring Boot API + MySQL
├── setup.ps1             ← Windows setup script
├── setup.sh              ← Linux/macOS setup script
├── git-pull.ps1          ← Windows safe pull script
├── git-pull.sh           ← Linux/macOS safe pull script
├── git-push.ps1          ← Windows safe push script
├── git-push.sh           ← Linux/macOS safe push script
└── README.md
```

If a historical `supabase/` folder exists in an older checkout, leave it alone unless it is empty and clearly unused.

## Technology Stack

Frontend:
- React + Vite
- Tailwind CSS
- Fetch API client

Backend:
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- MySQL
- Flyway, optional for migrations
- Redis, optional for rate limiting if configured

Database:
- MySQL only

## Prerequisites

- Git
- Node.js 20+
- Java 25
- MySQL Server
- Maven wrapper from this repository, or Maven 3.9+

## Setup

### Windows

Run setup:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1
```

If automatic tool install fails:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1 -SkipToolInstall
```

If MySQL is already configured and you do not want database setup:

```powershell
powershell -ExecutionPolicy Bypass -File .\setup.ps1 -SkipDatabaseSetup
```

Pull safely:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-pull.ps1
```

Push safely:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-push.ps1 "my commit message"
```

Emergency main push only if the project lead approves:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-push.ps1 "hotfix message" -AllowMain
```

### Linux/macOS

Make scripts executable:

```bash
chmod +x setup.sh git-pull.sh git-push.sh
```

Run setup:

```bash
./setup.sh
```

Pull safely:

```bash
./git-pull.sh
```

Push safely:

```bash
./git-push.sh "my commit message"
```

Emergency main push only if the project lead approves:

```bash
./git-push.sh "hotfix message" --allow-main
```

### Manual Start Commands

Start backend:

```powershell
cd backend
.\mvnw spring-boot:run
```

Start frontend user:

```powershell
cd frontend-user
npm run dev
```

Start frontend admin:

```powershell
cd frontend-admin
npm run dev
```

## MySQL Setup

Install MySQL Server, then create the local database:

```sql
CREATE DATABASE koupreng_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Default local backend database config:

```env
DB_URL=jdbc:mysql://localhost:3306/koupreng_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Phnom_Penh&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=change_me
```

Each teammate should:
- Install MySQL Server.
- Create database `koupreng_db`.
- Copy `backend/.env.example` to `backend/.env`.
- Update `backend/.env` with their local MySQL username and password.
- Start the backend.

## Run The Project

Clone:

```bash
git clone https://github.com/Nha0325/Koupreng-invitation_project.git
cd Koupreng-invitation_project
```

Create a feature branch before coding:

```bash
git checkout -b feature/my-work
```

### Backend

```bash
cd backend
cp .env.example .env
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
cd backend
Copy-Item .env.example .env
.\mvnw spring-boot:run
```

Backend URL:

```text
http://localhost:8080
```

### Frontend User

```bash
cd frontend-user
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell:

```powershell
cd frontend-user
npm install
Copy-Item .env.example .env.local
npm run dev
```

User frontend URL:

```text
http://localhost:5173
```

### Frontend Admin

```bash
cd frontend-admin
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell:

```powershell
cd frontend-admin
npm install
Copy-Item .env.example .env.local
npm run dev
```

Admin frontend URL:

```text
http://localhost:5174
```

## Frontend Environment

Use `VITE_API_URL` for both frontends.

`frontend-user/.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
```

`frontend-admin/.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
```

Do not use `VITE_API_BASE_URL`.

## Backend Environment

Copy `backend/.env.example` to `backend/.env`, then edit local values:

```env
DB_URL=jdbc:mysql://localhost:3306/koupreng_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Phnom_Penh&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=change_me

JWT_ISSUER=koupreng-backend
JWT_SECRET=change_this_to_a_random_64_character_or_longer_secret
JWT_ACCESS_TOKEN_MINUTES=60

FIRST_USER_ADMIN_ENABLED=false

CORS_ENABLED=true
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174

HTTPS_REQUIRED=false
HSTS_ENABLED=true

FLYWAY_ENABLED=false
JPA_DDL_AUTO=update

GOOGLE_CLIENT_IDS=
GOOGLE_JWK_SET_URI=https://www.googleapis.com/oauth2/v3/certs

TELEGRAM_BOT_TOKEN=
TELEGRAM_CLIENT_ID=
TELEGRAM_AUTH_MAX_AGE_SECONDS=86400
TELEGRAM_EMAIL_DOMAIN=telegram.local
TELEGRAM_JWK_SET_URI=https://oauth.telegram.org/.well-known/jwks.json

RATE_LIMIT_BACKEND=memory
WAF_ENABLED=true
WAF_AUDIT_ONLY=false
```

The backend also supports additional upload, logging, mail, WAF, and rate limit settings in `application.properties`. Keep local secrets in `.env`, not in committed files.

## Team Git Workflow

Recommended workflow:

1. Clone repo:

```bash
git clone https://github.com/Nha0325/Koupreng-invitation_project.git
cd Koupreng-invitation_project
```

2. Create feature branch:

```bash
git checkout -b feature/my-work
```

3. Pull before coding.

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-pull.ps1
```

Linux/macOS:

```bash
./git-pull.sh
```

4. Code your task.

5. Push safely.

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-push.ps1 "my commit message"
```

Linux/macOS:

```bash
./git-push.sh "my commit message"
```

6. Open Pull Request to `main`.

Team rules:
- Do not push directly to `main`.
- Always create a feature branch.
- Always pull before coding.
- Never commit `.env` files.
- Never commit secrets like DB password, JWT secret, Telegram bot token, Google OAuth secrets, ABA PayWay credentials, or merchant credentials.
- Do not force push.
- If conflict happens, run `git status` and fix carefully.

## Production Security Warning

For production:
- Do not use `DB_PASSWORD=school`.
- Do not use `DB_PASSWORD=change_me`.
- Do not use default JWT secret.
- Set `JWT_SECRET` from server environment.
- Use a random 64+ character JWT secret.
- Set `HTTPS_REQUIRED=true` behind real HTTPS/proxy.
- Use exact production CORS origin only.
- Use `JPA_DDL_AUTO=validate`.
- Use `FLYWAY_ENABLED=true` after migrations are ready.
- Never commit production `.env` files.
- Never commit database passwords, JWT secrets, Telegram bot token, Google OAuth secrets, ABA PayWay credentials, or merchant credentials.

## Security TODO

- Host routes should be protected by `RequireAuth`.
- Admin routes should be protected by `RequireAdmin`.
- Backend already protects `/api/admin/**` with `ADMIN` role.
- Before production, avoid storing JWT in `localStorage`. Prefer HttpOnly Secure SameSite cookies or another hardened token strategy.

## Troubleshooting

If a pull or push stops for conflicts:

```bash
git status
```

Open the conflicted files, fix markers, then continue the rebase:

```bash
git add .
git rebase --continue
```

Cancel the rebase only when you intentionally want to stop the pull:

```bash
git rebase --abort
```

If PowerShell blocks scripts, run them with:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-pull.ps1
```

## License

Private project for the Koupreng team.

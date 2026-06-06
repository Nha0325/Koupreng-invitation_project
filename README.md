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
├── git-sync.ps1          ← Windows safe pull + push script
├── git-sync.sh           ← Linux/macOS safe pull + push script
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

Pull and push safely in one command:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-sync.ps1 "my commit message"
```

The push and sync scripts always rebase on `origin/main`, commit your local changes, and push to `origin/main`. They only run from the local `main` branch.

### Linux/macOS

Make scripts executable:

```bash
chmod +x setup.sh git-pull.sh git-push.sh git-sync.sh
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

Pull and push safely in one command:

```bash
./git-sync.sh "my commit message"
```

The push and sync scripts always rebase on `origin/main`, commit your local changes, and push to `origin/main`. They only run from the local `main` branch.

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
- Copy `.env.example` to `.env` in the project root.
- Update root `.env` with their local MySQL username and password.
- Start the backend.

## Run The Project

Clone:

```bash
git clone https://github.com/Nha0325/Koupreng-invitation_project.git
cd Koupreng-invitation_project
```

Run `git-pull` before coding so your local work starts from the latest `origin/main`.

### Backend

```bash
cp .env.example .env
cd backend
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
cd backend
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
npm run dev
```

Windows PowerShell:

```powershell
cd frontend-user
npm install
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
npm run dev
```

Windows PowerShell:

```powershell
cd frontend-admin
npm install
npm run dev
```

Admin frontend URL:

```text
http://localhost:5174
```

## Environment

Use one root `.env` for normal local development. The backend reads `../.env` when run from `backend/`, and both Vite frontends read the project root env through their Vite config.

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Edit root `.env`:

```env
DB_URL=jdbc:mysql://localhost:3306/koupreng_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=Asia/Phnom_Penh&allowPublicKeyRetrieval=true
DB_USERNAME=root
DB_PASSWORD=change_me

JWT_ISSUER=koupreng-backend
JWT_SECRET=change_this_to_a_random_64_character_or_longer_secret
JWT_ACCESS_TOKEN_MINUTES=15

AUTH_COOKIE_ENABLED=false
AUTH_COOKIE_NAME=koupreng_access_token
AUTH_COOKIE_SECURE=false
AUTH_COOKIE_HTTP_ONLY=true
AUTH_COOKIE_SAME_SITE=Lax
AUTH_COOKIE_MAX_AGE_SECONDS=900

FIRST_USER_ADMIN_ENABLED=false

CORS_ENABLED=true
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
CORS_ALLOW_CREDENTIALS=false

BACKEND_BASE_URL=http://localhost:8080
VITE_API_URL=/api
VITE_AUTH_STORAGE=localStorage

HTTPS_REQUIRED=false
HSTS_ENABLED=true

FLYWAY_ENABLED=true
JPA_DDL_AUTO=validate

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

Do not use `VITE_API_BASE_URL`.

Security boundary:
- Backend secrets are variables like `DB_PASSWORD`, `JWT_SECRET`, `TELEGRAM_BOT_TOKEN`, and mail credentials.
- Browser-visible frontend values must be prefixed with `VITE_`.
- Never put secrets in `VITE_*` variables because Vite can expose them to browser JavaScript.
- `backend/.env`, `frontend-user/.env.local`, and `frontend-admin/.env.local` are optional advanced overrides only. Do not create them unless you intentionally need per-app overrides.

The backend also supports additional upload, logging, mail, WAF, and rate limit settings in `application.properties`. Keep local secrets in root `.env`, not in committed files.

## Static ABA KHQR Template Payments

Template/package checkout currently uses one ABA-hosted static KHQR link:

```text
https://link.payway.com.kh/ABAPAYrD450560q
```

The user frontend must create a backend order with `POST /api/v1/template-payments/static/create`, then redirect the browser to the `paymentLink` returned by the backend. The frontend must never mark an order paid or unlock a template. Payment confirmation is backend-only through Telegram/internal verification.

The current static link is fixed at USD 0.01. A static ABA-hosted link cannot dynamically set different prices. For different package prices, use separate ABA static links per price or implement the future dynamic PayWay API flow with server-side verification.

Required local payment env values:

```env
ABA_PAYWAY_STATIC_LINK=https://link.payway.com.kh/ABAPAYrD450560q
PAYMENT_PROVIDER_MODE=static
ADMIN_PAYMENT_SECRET=change_this_to_random_secret
AUTO_CONFIRM_TELEGRAM_DETECTED=true
```

Generate a local JWT secret before starting the backend. The example placeholder is intentionally rejected at startup.

OpenSSL:

```bash
openssl rand -base64 64
```

Windows PowerShell:

```powershell
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

For production, use a short access token lifetime such as 15 minutes.

## Postman Authentication Testing

Login:

```http
POST http://localhost:8080/api/auth/login
```

Body:

```json
{
  "identifier": "user@example.com",
  "password": "password123"
}
```

Bearer token mode:
- Keep `AUTH_COOKIE_ENABLED=false`.
- Copy `accessToken` from the JSON response.
- Send protected requests with `Authorization: Bearer <token>`.

Cookie mode:
- Set `AUTH_COOKIE_ENABLED=true`.
- For local HTTP testing, keep `AUTH_COOKIE_SECURE=false`; for production HTTPS, set it to `true`.
- Postman should save the `koupreng_access_token` cookie from the login response automatically.
- Send protected requests with the saved cookie.

Protected profile test:

```http
GET http://localhost:8080/api/users/me
```

Admin test:

```http
GET http://localhost:8080/api/admin/users
```

Logout:

```http
POST http://localhost:8080/api/auth/logout
```

Logout increments `token_version`, so older JWTs fail after logout. When cookie mode is enabled, logout also clears the auth cookie.

## Team Git Workflow

Recommended workflow:

1. Clone repo:

```bash
git clone https://github.com/Nha0325/Koupreng-invitation_project.git
cd Koupreng-invitation_project
```

2. Pull from `origin/main` before coding.

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-pull.ps1
```

Linux/macOS:

```bash
./git-pull.sh
```

3. Code your task.

4. Push safely to `origin/main`.

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-push.ps1 "my commit message"
```

Linux/macOS:

```bash
./git-push.sh "my commit message"
```

Or pull and push in one command:

Windows:

```powershell
powershell -ExecutionPolicy Bypass -File .\git-sync.ps1 "my commit message"
```

Linux/macOS:

```bash
./git-sync.sh "my commit message"
```

Team rules:
- Use `git-pull` before coding.
- Use `git-push` to rebase on `origin/main`, commit, and push to `origin/main`.
- Use `git-sync` when you want one command that pulls first, then commits and pushes.
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
- Keep `JWT_ACCESS_TOKEN_MINUTES` short, for example `15`.
- Set `HTTPS_REQUIRED=true` behind real HTTPS/proxy.
- Use exact production CORS origins only.
- For cookie auth, set `AUTH_COOKIE_ENABLED=true`, `AUTH_COOKIE_SECURE=true`, `AUTH_COOKIE_HTTP_ONLY=true`, and `AUTH_COOKIE_SAME_SITE=Lax` or `Strict`.
- For cookie auth, set `CORS_ALLOW_CREDENTIALS=true` and keep `CORS_ALLOWED_ORIGINS` as exact origins such as `https://koupreng.com` and `https://admin.koupreng.com`.
- Do not use `*` in `CORS_ALLOWED_ORIGINS` when credentials are enabled.
- Use `JPA_DDL_AUTO=validate`.
- Keep `FLYWAY_ENABLED=true` so Flyway remains the schema source.
- Never commit production `.env` files.
- Never commit database passwords, JWT secrets, Telegram bot token, Google OAuth secrets, ABA PayWay credentials, or merchant credentials.

## Security TODO

- Host routes should be protected by `RequireAuth`.
- Admin routes should be protected by `RequireAdmin`.
- Backend already protects `/api/admin/**` with `ADMIN` role.
- Avoid `dangerouslySetInnerHTML` unless the content is sanitized.
- Sanitize user-generated invitation content before rendering it.
- Add a Content Security Policy before production.
- Do not store long-lived tokens in `localStorage`.
- Do not log JWT tokens in browser console or backend logs.
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

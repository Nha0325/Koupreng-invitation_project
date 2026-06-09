# Production Deployment Checklist

This document guides the release manager through the steps required to deploy the **Koupreng E-Invitation Platform** securely and successfully.

---

## 1. Pre-Deployment Validation Checklist

Verify the following on the release branch before initiating deployment:
- [ ] CI pipeline is green (all tests pass, frontend builds succeed).
- [ ] No local modifications remain in the code repository.
- [ ] All database migration files have unique, incremental version prefixes.
- [ ] No static credentials or plaintext secrets exist in resource files.

---

## 2. Environment Variables Checklist

Configure the following environment variables on the target production servers or orchestration platform:

### Database Settings
- `DB_URL`: JDBC connector string. E.g., `jdbc:mysql://prod-db:3306/koupreng_db?useSSL=true`
- `DB_USERNAME`: Database username.
- `DB_PASSWORD`: Strong password.

### JWT Cryptography Settings
- `JWT_SECRET`: Minimum 256-bit random alphanumeric sequence.
- `AUTH_COOKIE_SECURE`: Enforce secure flag `true` for cookies.
- `AUTH_COOKIE_HTTP_ONLY`: Must be set to `true`.

### PayWay Payment Integration
- `ADMIN_PAYMENT_SECRET`: Shared secret used for callback verification.
- `PAYMENT_PROVIDER_MODE`: `static` (in current static setup).
- `ABA_PAYWAY_STATIC_LINK`: ABA Merchant URL link.

### Telegram Confirmations
- `TELEGRAM_BOT_TOKEN`: Token obtained from BotFather.
- `TELEGRAM_ALLOWED_GROUP_IDS`: Array/list of trusted chat IDs.

### Host Services
- `SPRING_MAIL_HOST` / `PORT` / `USERNAME` / `PASSWORD` for notification delivery.

---

## 3. Step-by-Step Deployment Execution

### Step 1: Database Migration
- Trigger the backend application startup with the production environment active.
- Verify Flyway runs all pending migrations and records successful entries in `flyway_schema_history`.

### Step 2: Backend Deployment
- Startup the Java JAR service:
  ```bash
  java -jar target/backend-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
  ```
- Verify the logs output: `Started BackendApplication in X seconds`.

### Step 3: Frontend Deployment
- Build user and admin bundles:
  ```bash
  npm run build
  ```
- Deploy the resulting `/dist` folders to static host storage (e.g., Nginx static directory, AWS S3, Cloudflare Pages).
- Set up route redirects so that all unmatched requests serve `index.html` (supporting SPA router history modes).

### Step 4: Reverse Proxy Configuration (Nginx / Cloudflare)
- Configure path rewrites: `/api/**` targets the backend port (`8080`).
- Force HTTPS on all incoming traffic.
- Strip incoming client-provided `X-Forwarded-For` headers at the edge to prevent spoofing.

---

## 4. Post-Deployment Smoke Testing

Verify the following endpoints immediately after startup:
- [ ] `GET /actuator/health` returns `{"status":"UP"}`.
- [ ] `POST /api/auth/login` works with test account credentials.
- [ ] `GET /api/v1/admin/users` triggers `403 Forbidden` for non-admin accounts.
- [ ] `GET /i/demo-invitation` renders the template successfully.

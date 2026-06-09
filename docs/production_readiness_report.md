# Production Readiness Report

This report outlines the production configuration status, database migration strategies, security controls, and operational observability standards for the **Koupreng E-Invitation Platform**.

---

## 1. Production Configuration Status

All configuration properties are parameterized to resolve from environment variables or a secure key manager in the production profile.

### Backend Configurations
- **Database Connection**: Managed via `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`. Production environments disable SSL verification options only behind secure VPC boundaries.
- **JWT Configurations**:
  - `JWT_SECRET`: Handled exclusively via environment variables. Recommends a minimum of 256-bit keys (32+ characters).
  - `AUTH_COOKIE_SECURE`: Must be set to `true` in production to enforce HTTPS transport.
  - `AUTH_COOKIE_SAME_SITE`: Parameterized to `Lax` or `Strict` depending on domain configuration.
- **API Secret Keys**:
  - `ADMIN_PAYMENT_SECRET`: Required to authorize merchant payment callbacks. Exposes `401/403` on failure.
- **Third-Party Providers**:
  - `TELEGRAM_BOT_TOKEN` & `TELEGRAM_ALLOWED_GROUP_IDS` for Telegram automated confirmations.
  - Cloudinary asset options and Spring SMTP mail servers.
- **Reverse Proxy and IP Resolution**:
  - `app.audit.trust-forwarded-headers`: Defaults to `false`. Enable only behind trusted proxies that forcefully rewrite incoming headers.

### Frontend Configurations
- `VITE_API_URL` and `VITE_TELEGRAM_BOT_USERNAME` are compiled during build time. Secrets are never exposed to the frontend browser bundle.

---

## 2. Database Migration History & Baseline Strategy

- **Flyway Setup**:
  - Main history has been consolidated into baseline scripts under `backend/src/main/resources/db/migration/`:
    - `V1__core_schema.sql` (baseline)
    - `V2__planning_and_operations_schema.sql`
    - `V3__payments_subscriptions_and_audit_schema.sql`
    - `V4__seed_initial_data.sql`
  - Subsequent version increments (e.g. `V5` through `V13`) follow sequential, forward-only naming conventions.
  - Duplicate versions or modification of already applied migrations are strictly prohibited.
  - Baseline on migrate is active (`flyway.baseline-on-migrate=true`) to enable upgrading existing non-empty development databases.

---

## 3. Security Audits & Vulnerability Mitigation

### A. CSV Formula Injection (Patched)
- Direct spreadsheet rendering of user input strings starting with `= | + | - | @ | \t | \r | \n` and their full-width variants (`＝ | ＋ | － | ＠`) is mitigated.
- Centralized `CsvExportUtils` encapsulates escaping logic: double quotes are doubled, cells are quoted, and malicious characters are escaped with a prepended single quote (`'`).

### B. Audit IP Spoofing (Patched)
- `AuditLogService` secures client logging via `request.getRemoteAddr()`. Header values like `X-Forwarded-For` are ignored unless explicit authorization is mapped.

### C. File Upload Security
- Multi-part file endpoints validate:
  - Allowed extensions (e.g., `.jpg`, `.png`, `.webp`, `.pdf`).
  - MIME signatures.
  - Maximum upload size (5MB).
  - Path traversal attempts (`..` in filenames).

---

## 4. Observability & Operations

- **Health Monitoring**: `/actuator/health` endpoint is configured to report app state safely. Sensitive metrics and full environment info Actuators are restricted behind admin authentication.
- **Structured Logging**: Logback patterns enforce request logging templates, tracking client requests, HTTP methods, response codes, and query processing metrics.
- **Global Error Handling**: Rejects raw stack trace disclosure to the client browser by implementing custom Spring controllers.

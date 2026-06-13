# Security Checklist

Verified:
- `/api/v1/admin/**` and `/api/admin/**` require `ADMIN`.
- Auth public endpoints are explicitly permitted.
- Public invitation routes are explicitly permitted.
- Backend tests include security and WAF tests.
- `.gitignore` ignores `.env` and app-local env files.

Changed:
- Admin frontend routes now use `RequireAdmin`.
- Admin API client lives in `apps/frontend-admin/src/shared/api/adminHttpClient.js`.
- Invitation delete verifies owner or `ADMIN`.

Remaining TODOs:
- Prefer HttpOnly Secure SameSite cookies for production auth.
- Reduce or eliminate long-lived JWT storage in browser storage.
- Review every `dangerouslySetInnerHTML` usage and sanitize user-generated invitation content.
- Verify production CORS exact domains.
- Verify upload type and size limits for every upload endpoint.

Insufficient data to verify:
- Production CSP.
- Production CORS domain list.
- Runtime secret redaction in every deployment log sink.

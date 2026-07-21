# Security Checklist

## Verified in repository tests/source

- [x] Admin route families require `ADMIN`; frontend admin routes also use `RequireAdmin`.
- [x] Invitation deletion and child-resource behavior have ownership/security tests.
- [x] Internal payment endpoints enforce the admin payment secret before service logic.
- [x] CSV export hardening and trusted-forwarded-header behavior have regression tests.
- [x] `.env`, runtime logs, build output, local databases, and dependency caches are ignored.
- [x] Executable Telegram source does not print token-bearing URLs and validates callbacks/amounts.
- [x] Current tracked tree passes Gitleaks.

## Release blockers

- [ ] Rotate the historically exposed Telegram token and verify revocation.
- [ ] Triage the 29 historical Gitleaks findings and coordinate the documented history rewrite.
- [ ] Obtain a successful Java dependency vulnerability report.
- [ ] Verify production CORS/CSP, cookies, TLS/HSTS, WAF, proxy headers, rate-limit storage, and log sinks.
- [ ] Complete staging/provider tests for OAuth, payment, Telegram, email, storage, uploads, backup, restore, and monitoring.

## Continuing review

- Sanitize any user-generated content passed to `dangerouslySetInnerHTML`.
- Keep upload signature/type/size limits covered for each provider path.
- Prefer HttpOnly Secure SameSite cookies and minimize long-lived browser token storage.
- Do not log secrets, complete bodies, personal data, or reset links at any level.

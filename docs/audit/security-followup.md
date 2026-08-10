# Backend security follow-up register

Audit date: 2026-08-10

This register contains no credential values, tokens, authorization headers, reset tokens, payment secrets, or guest data. Security scan output must remain redacted; a filename-only result is preferred in shared logs.

## Release decision

**NOT READY FOR RELEASE until CRITICAL-S01 is verified complete by the repository/deployment owner.** Code hardening in this working copy cannot revoke provider credentials or rewrite remote Git history.

## Required actions

### CRITICAL-S01 — Verify credential revocation, rotation, and history remediation

- **Finding:** The repository previously contained a Telegram credential-shaped value. It remains compromised regardless of current-tree removal.
- **Evidence:** `docs/security/credential-incident-response.md`; no external completion evidence was supplied to this audit.
- **Affected files/systems:** Git history, Telegram provider account, bot deployment, CI/deployment secret stores, mirrors/forks/caches.
- **Exploit/business scenario:** Reuse permits bot impersonation or abuse of a trusted payment-notification channel.
- **Root cause:** Secret material was placed in tracked content.
- **Fix owner:** repository owner plus deployment/security owner.
- **Required fix:** revoke and replace at the provider; update only secret stores/untracked local environment; prove the old value fails; inspect bot admins/webhooks/audit events; coordinate a protected history rewrite across every branch/tag; invalidate caches and require fresh clones.
- **Tests/evidence:** provider revocation timestamp/reference, redacted old-credential rejection result, successful replacement deployment, redacted current-tree/history scan, remote ref verification, contributor acknowledgement of reclone procedure.
- **Status:** **OPEN / RELEASE BLOCKER.** Do not paste any old or replacement value into this repository, commands, issues, PRs, or chat.

Safe owner procedure and history-rewrite coordination are documented in `docs/security/credential-incident-response.md`. The replacement map must be stored outside the repository and never committed.

### HIGH-S02 — Make the browser authentication/CSRF policy explicit

- **Finding:** JWT authentication may come from an HttpOnly cookie while Spring CSRF protection is disabled.
- **Evidence:** `SecurityConfig`, cookie bearer resolver, auth cookie writer.
- **Affected files/systems:** every state-changing browser endpoint, CORS/proxy/cookie deployment settings.
- **Exploit/business scenario:** A future SameSite/domain/origin change can enable cross-site authenticated mutations.
- **Root cause:** Cookie transport was added to a stateless bearer model without a separate CSRF contract.
- **Fix owner:** backend/security plus frontend platform.
- **Fix:** select bearer-header-only or cookie-plus-CSRF; document trusted origins; implement token/origin enforcement and browser tests before deployment.
- **Tests:** hostile-origin unsafe methods, valid-origin flow, cookie flags, missing/invalid CSRF token, logout.
- **Status:** **OPEN.** SameSite/Secure/HttpOnly provide current defense but do not close the design item.

### HIGH-S03 — Finish organization authorization before enabling team operations

- **Finding:** Organization roles do not yet define effective downstream permissions.
- **Evidence:** organization roles/member API compared with owner/admin checks in invitation, guest, media, planning, payment, and export services.
- **Affected files/systems:** all organization-owned business resources and role-aware frontend controls.
- **Exploit/business scenario:** A broad membership check over-authorizes viewers; current owner-only checks under-deliver staff roles.
- **Root cause:** Role labels exist without action-level policy.
- **Fix owner:** product/domain security.
- **Fix:** approve a permission matrix; implement centralized decisions and return effective permissions; add allow/deny/IDOR tests.
- **Tests:** every role x action, inactive membership, self-escalation, owner immutability, cross-org resources.
- **Status:** **PARTIAL.** This batch prevents owner reassignment/mutation, denies inactive members, and audits membership changes.

### HIGH-S04 — Complete paid-subscription confirmation

- **Finding:** Paid subscription purchases have no complete trusted payment-to-active transition.
- **Evidence:** subscription and template-payment service flow inventory.
- **Affected files/systems:** subscription/package/payment/entitlement state and frontend purchase UX.
- **Exploit/business scenario:** paid customers remain pending or a future UI bypass is introduced.
- **Root cause:** No cross-module subscription payment contract.
- **Fix owner:** payments/domain engineering.
- **Fix:** server-owned order and confirmation state machine; idempotent locked confirmation; transactional activation/expiry/entitlements; reconciliation and audit.
- **Tests:** ownership, amount/currency/package match, duplicate/replay, expiry, cancellation/refund, rollback.
- **Status:** **OPEN.** Client-side unlock remains forbidden.

### MEDIUM-S05 — Keep Telegram confirmation review-first and reduce retained data

- **Finding:** Telegram notification text is not independent payment truth and raw message metadata has no bounded retention policy.
- **Evidence:** bot parsing, internal detect endpoint, template payment metadata fields.
- **Affected files/systems:** bot, internal secret route, payment orders, backups/logging/admin UI.
- **Exploit/business scenario:** forged/replayed trusted-channel text or retained payer content affects entitlement/privacy.
- **Root cause:** Notification reconciliation was originally auto-confirming and retained raw evidence indefinitely.
- **Fix owner:** payment/security operations.
- **Fix:** leave `AUTO_CONFIRM_TELEGRAM_DETECTED` unset/false; require admin/provider reconciliation; rotate internal secret on schedule; minimize/redact stored payload and add retention cleanup; consider signed request timestamp/nonce replay protection.
- **Tests:** forged secret, replay/duplicate message, amount/currency/order mismatch, review state, admin confirmation, cleanup.
- **Status:** **PARTIAL/FIXED DEFAULT.** Default is now `false`; row locking prevents concurrent double-confirm; data minimization/replay protocol remains.

### MEDIUM-S06 — Add explicit provider timeout and transaction boundaries

- **Finding:** Cloud media requests lack explicit timeouts, and PayWay verification occurs inside a DB transaction.
- **Evidence:** default JDK HTTP client in the cloud media adapter; transactional payment callback invoking remote verification.
- **Affected files/systems:** request threads, DB pool/locks, external media and payment providers.
- **Exploit/business scenario:** upstream stalls exhaust resources and amplify retries.
- **Root cause:** remote adapters lack a uniform resilience policy.
- **Fix owner:** backend/platform.
- **Fix:** set connect/request timeouts and cancellation; bounded retry only where idempotent; perform PayWay verification outside the short locked paid-transition transaction; add metrics.
- **Tests:** connect/read timeout, callback duplicate/race, state recheck, provider failure, no duplicate upload.
- **Status:** **OPEN.** No speculative remote-flow refactor was made in this batch.

### MEDIUM-S07 — Add dedicated scanner policy and revoke state

- **Finding:** Check-in is owner/admin-only and idempotent, but explicit staff authorization, revoke semantics, and a scanner-specific rate budget are absent.
- **Evidence:** check-in controller/service/entity and organization role inventory.
- **Affected files/systems:** venue scanner sessions, guest QR lifecycle, audit records.
- **Exploit/business scenario:** intended staff cannot scan securely; revoked access cannot be represented; compromised sessions can issue excessive scan requests.
- **Root cause:** incomplete check-in lifecycle/permission model.
- **Fix owner:** domain/security product.
- **Fix:** approved `CHECK_IN` permission, revoke state/reason, audit transitions, measured per-scanner throttle.
- **Tests:** staff allow/deny, revoked token, wrong invitation, duplicates, throttle, audit.
- **Status:** **PARTIAL.** Locked guest resolution and additive deterministic results are implemented.

### MEDIUM-S08 — Make disposable MySQL security/data gates mandatory

- **Finding:** fresh schema validation is environment-gated; local Flyway allows out-of-order migrations.
- **Evidence:** application properties and `FreshDatabaseMigrationTests` environment prerequisites.
- **Affected files/systems:** CI, migrations, production schema rollout.
- **Exploit/business scenario:** schema/index/constraint drift appears only after deployment.
- **Root cause:** no always-on disposable MySQL release gate.
- **Fix owner:** backend/CI.
- **Fix:** provision MySQL in CI; validate empty migration and upgrade; keep production out-of-order disabled; inspect constraints/indexes.
- **Tests:** `FreshDatabaseMigrationTests`, Flyway validate, representative upgrade dataset.
- **Status:** **OPEN / ENVIRONMENT-GATED.** Applied migrations remain unchanged.

### LOW-S09 — Deprecate duplicate endpoints with security parity tests

- **Finding:** legacy/canonical admin and budget paths coexist.
- **Evidence:** controller mapping inventory and frontend caller search.
- **Affected files/systems:** admin and planning APIs.
- **Exploit/business scenario:** future authorization/validation fixes diverge across aliases.
- **Root cause:** backward-compatible evolution without formal retirement.
- **Fix owner:** backend/API governance.
- **Fix:** instrument usage, declare canonical routes, add parity tests, communicate migration, then remove in a versioned release.
- **Tests:** same role/ownership/validation/error behavior across aliases.
- **Status:** **OPEN / LOW.** Existing contracts were preserved.

## Hardening completed in this batch

- Public RSVP POSTs have a dedicated per-invitation/per-client limiter. Personalized invite tokens are not used in rate-limit keys.
- Guest create/update/import boundaries share validation and duplicate rules; nested JSON import is bounded.
- Check-in, seating assignment, and internal/admin payment mutation use row locks at their invariant boundary.
- Organization owner identity/role cannot be assigned, changed, or removed through member APIs; inactive membership no longer grants organization access; membership changes are audited without email content.
- Telegram detection defaults to `PAID_PENDING_REVIEW`; premium access remains locked until a trusted confirmation.
- Errors expose stable safe codes/path/field errors without SQL, stack trace, or internal secret content.

## Verification commands

Run from `apps/backend` with the repository-supported Java 25 toolchain:

```powershell
.\mvnw.cmd clean verify
.\mvnw.cmd -Pdependency-security org.owasp:dependency-check-maven:check
```

Run the Telegram bot's configured Python test/lint commands from `apps/telegram-bot`. Run the fresh MySQL test only with disposable nonproduction database settings. Current-tree and history secret scans must use redaction and should not emit matched values into shared logs.

## Verification outcome for this audit

| Gate | Result |
|---|---|
| Backend `mvnw.cmd clean verify` | **PASS** — 151 tests, 0 failures/errors, 1 skipped; JAR built |
| SpotBugs / PMD | **PASS** — 0 SpotBugs findings/errors; PMD check passed |
| JaCoCo | Report generated — 38.89% line, 34.93% instruction, 24.87% branch coverage; no configured minimum |
| Fresh MySQL Flyway test | **NOT RUN** — disposable MySQL environment variables were absent; this is the one skipped test |
| OWASP Dependency-Check | **UNVERIFIED** — timed out at four minutes and again at six minutes; no report was produced; audit-owned workers were stopped |
| Telegram bot tests/lint | **PASS** — 24 pytest tests; Ruff and Bandit passed; `pip check` clean |
| Telegram bot dependency audit | **PASS for declared runtime requirements** — `pip-audit` found no known vulnerabilities |
| Frontend contract subset | **PASS** — 10 payment/organization/guest-authority tests |
| Current-tree token-shape scan | Two test files only; three masked occurrences confirmed as explicit test fixtures; no value emitted |

The backend and bot code gates are green, but these results do not override CRITICAL-S01 or substitute for the missing fresh-MySQL and Java dependency reports.

## Evidence checklist for release sign-off

- [ ] CRITICAL-S01 owner evidence attached privately and old credential rejected.
- [ ] Redacted remote-history scan covers branches/tags and replacement deployment is healthy.
- [ ] Full Maven verify, SpotBugs, PMD, and JaCoCo are recorded; configured dependency scan must still complete.
- [ ] Fresh disposable MySQL migration/validation passes.
- [x] Telegram bot unit/lint tests pass with fake fixtures only.
- [x] Repository production default for `AUTO_CONFIRM_TELEGRAM_DETECTED` is `false`; deployment override still requires operator verification.
- [x] Audited frontend callers cannot directly mark template payment/entitlement state paid or active.
- [ ] Open HIGH findings are accepted by named owners or fixed before the affected capability is marketed/enabled.

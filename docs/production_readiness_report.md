# Production Readiness Report

Assessment date: 2026-07-21. Current decision: **NOT READY FOR RELEASE**.

## Ready at repository level

- Four components have repeatable install/build/test commands.
- The backend has unit/integration tests, coverage, High-threshold SpotBugs, PMD, and a fresh MySQL migration test.
- Both frontends have lint, unit, unused-code/dependency analysis, production builds, and controlled desktop/mobile browser tests.
- The Telegram service has pinned dependencies, unit tests, lint, static security analysis, compile checks, and Python vulnerability audit.
- CI defines ten jobs covering secrets, component builds/tests, backend static analysis, migration, browser, vulnerabilities, and configuration.
- Environment examples contain placeholders; local secrets/build products are ignored.

## Blocking conditions

- Rotate the exposed Telegram token and complete the coordinated Git-history incident response.
- Obtain a successful OWASP Java dependency report.
- Supply Railway project/service access, actual failure logs, and intended service topology; correct and re-run the failed deployment.
- Establish redistribution rights for retained music/photo assets.
- Execute staging/provider journeys for auth, payment, Telegram, email, storage, database backup/restore, proxy/TLS/CORS/CSP, monitoring, and rate limiting.

## Non-blocking improvement backlog

- Reduce the user frontend's roughly 989 kB minified main JavaScript chunk through measured code splitting.
- Review 104 Medium-threshold SpotBugs findings.
- Plan a forward-only normalization for Flyway's `outOfOrder` naming warning.
- Add explicit accessibility, visual-regression, and performance budgets.

The authoritative blocker detail is `qa/known-limitations.md`; the release manager must not convert a blocked item to PASS without attaching the missing evidence.

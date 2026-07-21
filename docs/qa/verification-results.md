# Verification Results

Evidence date: 2026-07-21. These results describe local execution on Windows unless the command explicitly names CI. No GitHub Actions or Railway result is claimed before the branch is pushed and those external systems run.

## Automated results

| Area | Command/check | Result |
| --- | --- | --- |
| Backend full gate | `apps/backend/mvnw.cmd clean verify` | PASS: 128 tests, 0 failures/errors, 1 opt-in skip; JaCoCo report; SpotBugs High 0; PMD 0 |
| Backend security focus | selected security/reset/logging tests | PASS: 6 tests |
| Fresh database | `-Dtest=FreshDatabaseMigrationTests test` with a newly created MySQL 8 database | PASS: 15 Flyway migrations, Hibernate `ddl-auto=validate`, 1 test; temporary DB dropped |
| Backend dependency use | `mvnw.cmd dependency:analyze` | PASS with documented Spring starter aggregation warnings |
| Backend Java advisory feed | `mvnw.cmd -Pdependency-security -DskipTests verify` | INCOMPLETE: no report before 10-minute timeout; release blocker |
| User frontend | lint, 3 Vitest tests, Knip, depcheck, Vite build | PASS; 724 modules; JS 988.81 kB/275.73 kB gzip; CSS 404.99 kB/73.13 kB gzip |
| Admin frontend | lint, 3 Vitest tests, Knip, depcheck, Vite build | PASS; 125 modules; JS 335.49 kB/103.44 kB gzip; CSS 9.04 kB/2.55 kB gzip |
| Browser E2E | Playwright desktop Chromium and Pixel 7 projects | PASS: 8 tests |
| Browser route smoke | `node scripts/ci/browser-smoke.mjs` | PASS on public/user/admin route inventory |
| Telegram service | pytest, Ruff, Bandit, compileall | PASS: 24 tests and all static/compile gates |
| Python vulnerability audit | `pip-audit -r requirements.txt` | PASS: no known vulnerabilities |
| Node vulnerability audits | both `npm audit --audit-level=high` | PASS: 0 vulnerabilities |
| Secret scan, current tree | Gitleaks 8.30.1 on a clean exported tree | PASS: 0 findings |
| Secret scan, Git history | Gitleaks full-history diagnostic | FAIL/INCIDENT: 29 findings across 12 path/rule groups; remediation required |
| Workflow syntax | PyYAML parse plus actionlint 1.7.12 | PASS: 9 jobs, no actionlint finding |
| Script syntax | Bash `-n`, PowerShell parser, Node `--check` | PASS |

## Coverage by critical flow

| Flow | Evidence present | What is not claimed |
| --- | --- | --- |
| Authentication/authorization | Backend auth/security tests; user/admin guard tests and redirect journeys | No live Google/Telegram OAuth provider session |
| Public invitation | Route contract; controlled API success/error interception; desktop/mobile render journey | No production slug/database/provider journey |
| User dashboard/builder | Protected-route contract, route smoke, production build; builder/custom media code preserved | No manual create/edit/publish transaction against a staging backend |
| Admin | Admin route constants, guard/session unit tests, login redirect/browser form | No live admin moderation transaction |
| Payment | Backend payment/security test suite and Telegram parsing tests | No live ABA payment/callback or real Telegram delivery |
| Upload/media | Backend validation tests and frontend build/path evidence | No live Cloudinary/storage upload |
| Database | Complete test suite plus fresh MySQL Flyway/Hibernate validation | No production clone, backup/restore, or provider migration |

## Warnings retained as evidence

- User production JavaScript remains above Vite's 500 kB chunk warning; code splitting is recommended but was not mixed into deletion work.
- Flyway reports `outOfOrder` mode active because version `V1_1` sorts after the integer migrations. The fresh migration is reproducible in the tested repository state, but migration naming should be normalized only through an approved forward strategy.
- Mockito/Byte Buddy warns that future JDKs will restrict dynamic agent attachment.

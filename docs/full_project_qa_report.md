# Full Project QA Report

Evidence date: 2026-07-21. This report distinguishes automated evidence from live-provider/manual evidence. Detailed commands and outputs are in `qa/verification-results.md`; unresolved items are in `qa/known-limitations.md`.

## Outcome

All four application components compile/build and their available automated suites pass. Current-tree secret scanning passes, a new MySQL schema accepts every Flyway migration and Hibernate validation, frontend route/dead-code checks pass, and controlled desktop/mobile browser journeys pass. The repository is materially cleaner and more testable, but it is **not approved for production release** while credential/history remediation, Java advisory scanning, Railway diagnosis, asset licensing, and staging/provider journeys remain open.

## Functional evidence map

| Area | Automated evidence | Status/limit |
| --- | --- | --- |
| A. Auth/account | Backend auth/security tests; user/admin guard and redirect tests | Automated PASS; live OAuth/provider flow not run |
| B. Invitations | Backend service/controller tests; route contract/build | Automated PASS; live CRUD/publish journey not run |
| C. Templates/customization | Catalog/builder source preserved; active renderers build; route/browser tests | Automated PASS; pixel-level Canva comparison open |
| D. Media | Backend validation tests; asset/import/dynamic-path audit | Automated PASS; live storage upload open |
| E. Guests | Backend suite and route contract | Automated PASS; live import/export journey open |
| F. Delivery | Backend suite | Automated PASS; email/messaging providers open |
| G. RSVP | Backend suite; public invitation browser journey | Automated PASS; live public submission open |
| H. Notifications | Backend suite and active-route analysis | Automated PASS; live delivery open |
| I. Dashboard/reports | Backend suite; protected-route smoke | Automated PASS; representative staging data open |
| J. Admin | Backend RBAC tests; admin guard/routes/build/browser redirect | Automated PASS; live moderation open |
| K. Budget | Backend suite and route smoke | Automated PASS; live CRUD/export open |
| L. Public/mobile | Desktop and Pixel 7 Playwright; route smoke | Controlled PASS; accessibility/visual review open |
| M. Advanced features | Backend suite and active route/build analysis | Automated PASS where tests exist; provider workflows open |
| N. Security | Focused backend tests, Bandit/Ruff, Gitleaks current tree, dependency audits | Partial PASS; history incident and Java feed are blockers |

## Test totals

- Backend: 128 tests discovered, 0 failures/errors, 1 fresh-database test skipped by default; the same test passes when opted in against a new MySQL 8 schema.
- User frontend: 3 Vitest tests and 8 Playwright cases across desktop/mobile projects.
- Admin frontend: 3 Vitest tests; admin redirect/form coverage is also included in Playwright.
- Telegram service: 24 pytest tests.

These totals are execution evidence, not a claim that every business branch or third-party integration is covered.

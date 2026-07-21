# Dependency and Static Analysis Audit

Audit date: 2026-07-21.

## User frontend

- `npm update` refreshed the lockfile to the newest versions permitted by existing semver ranges; `npm outdated --json` then returned `{}`.
- 378 packages audited; `npm audit --audit-level=high` reported 0 vulnerabilities.
- Removed unused `lenis` after import graph, Knip, and depcheck agreed it was unused.
- ESLint, Vitest (3 tests), Knip files/dependencies/unlisted/binaries, depcheck, and Vite build pass.

## Admin frontend

- `npm update` refreshed the lockfile to the newest versions permitted by existing semver ranges; `npm outdated --json` then returned `{}`.
- 356 packages audited; `npm audit --audit-level=high` reported 0 vulnerabilities.
- ESLint, Vitest (3 tests), Knip files/dependencies/unlisted/binaries, depcheck, and Vite build pass.

## Telegram service

- Runtime and development requirements are exactly pinned.
- `pip-audit -r requirements.txt` reported no known vulnerabilities.
- Ruff, 24 pytest tests, Bandit against `main.py`/`start.py`, and compileall pass.

## Backend

- `mvnw dependency:analyze` succeeds but reports Spring Boot starter aggregation warnings. Those warnings are not safe evidence for removing starters or adding each transitive module directly, so no blind dependency rewrite was made.
- JaCoCo 0.8.15 reports 36.02% line, 22.01% branch, and 72.17% class coverage.
- SpotBugs 4.10.3.0 at High threshold reports 0 findings. A diagnostic Medium-threshold run reports 104 findings, dominated by Spring constructor-injection exposure patterns; this is a documented improvement baseline, not silently waived evidence.
- PMD 3.28.0 reports 0 violations after two source-level cleanups.
- OWASP Dependency-Check 12.2.2 is available through the opt-in `dependency-security` Maven profile and fails the build at CVSS 8 or higher.

## Incomplete external feed result

The first local OWASP Dependency-Check advisory synchronization produced no report or finding before the 10-minute process timeout. Two exact repository-scoped Maven JVMs left by the timeout were stopped. Java vulnerability status is therefore **not verified**, not “zero vulnerabilities.” CI retries this audit with Maven caching and accepts an optional `NVD_API_KEY`; a successful report is required before release.

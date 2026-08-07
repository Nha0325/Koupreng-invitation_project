# Changelog

All notable repository changes are documented here.

## Unreleased

### Security

- Removed a plaintext Telegram credential artifact and credential-bearing runtime logs from the current tree.
- Redacted reset-token and request-body logging; hardened Telegram callback and amount validation.
- Added a current-tree Gitleaks gate and documented mandatory token rotation/history remediation.

### Changed

- Consolidated user/admin route authorities and removed unreachable legacy implementations.
- Removed generated caches, a local database snapshot, unused/duplicate media, and misplaced source documentation.
- Organized reusable scripts under `scripts/ci`, `scripts/dev`, and `scripts/maintenance`.
- Refreshed frontend lockfiles to the newest versions allowed by existing semver ranges.

### Quality

- Added frontend route/guard unit tests, Knip/depcheck gates, and desktop/mobile Playwright journeys.
- Added bot unit tests, Ruff, Bandit, pip-audit, and compile gates.
- Added JaCoCo, SpotBugs, PMD, a fresh-MySQL Flyway test, and an opt-in OWASP dependency audit for the backend.
- Expanded CI to enforce repository-wide security, build, test, analysis, migration, browser, and configuration gates.

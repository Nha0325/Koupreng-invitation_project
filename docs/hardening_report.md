# Hardening Report

Audit date: 2026-07-21.

## Completed in the current tree

- Removed a credential-bearing root artifact, tracked runtime logs, tracked frontend cache output, and a local database snapshot.
- Replaced bot token examples with placeholders; removed token-bearing URL logging; validated callback identifiers and numeric amounts.
- Removed reset-token/PII debug logging and disabled serialized request-body logging.
- Added current-tree Gitleaks in CI, pinned bot dependencies, pytest/Ruff/Bandit/pip-audit, backend SpotBugs/PMD/JaCoCo, and frontend lint/unit/dead-code/browser gates.
- Preserved backend authorization/security tests and verified the focused security set passes.
- Added a real fresh-MySQL Flyway/Hibernate validation test.

## Security incident status

The exposed Telegram credential remains an incident until it is rotated and historical Git findings are rewritten after maintainer coordination. Current-tree removal alone is insufficient. Follow `security/credential-incident-response.md` and `../SECURITY.md`.

## Evidence and open work

- Detailed results: `qa/verification-results.md`
- Dependency/static analysis: `qa/dependency-audit.md`
- Release blockers: `qa/known-limitations.md`
- Operational controls: `security_hardening_ops.md`

No claim is made that live payment, Telegram, email, storage, proxy, or deployment-provider controls were verified during this repository-only audit.

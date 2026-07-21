# Known Limitations and Release Blockers

## Release blockers

1. **Credential rotation:** a Telegram token exposed in Git history must be revoked/rotated through BotFather, deployment secrets updated, and the old token verified dead.
2. **History remediation:** full-history Gitleaks found 29 findings across 12 path/rule groups. Maintainers must triage each item, coordinate a `git filter-repo` rewrite, force-push, and require collaborators to re-clone. The safe procedure is in `docs/security/credential-incident-response.md`.
3. **Java vulnerability report:** the local OWASP advisory database did not finish in ten minutes. A successful CI/provider scan is required; no zero-vulnerability claim is made for Maven dependencies.
4. **Railway diagnosis:** no Railway CLI, authentication/binding environment, `railway.toml`/`railway.json`, Procfile, Dockerfile, project ID, service topology, deployment log, or verified deployment URL was available. The failed Railway deployment cannot be reproduced or corrected from repository evidence alone.
5. **Asset rights:** redistribution/production rights for the retained music and Facebook gallery photos are not documented.

## Required Railway evidence

Provide read access or sanitized outputs for:

```text
railway status
railway service
railway variables --kv            # redact values before sharing
railway logs --deployment <id>
```

Also identify which repository component maps to each Railway service, its root directory, build command, start command, health-check path, generated domain, database service, and migration policy. Do not add a guessed monorepo deployment manifest until that topology is confirmed.

## External/manual validation still required

- Live Google and Telegram authentication.
- Live ABA checkout/callback reconciliation and Telegram payment detection.
- SMTP/email delivery, Cloudinary or selected storage provider, public DNS/TLS, CORS/CSP, trusted proxy header behavior, rate-limit backend, monitoring, backup, and restore.
- Full create/edit/publish/RSVP/admin workflows against a staging database with representative data.
- Pixel-level comparison with the original Canva source, keyboard/screen-reader accessibility, focus order, reduced motion, and contrast review.
- Performance budgets for the large user JS/CSS bundle, Canva SVG, gallery media, video, and music.
- SpotBugs Medium baseline (104 findings), Flyway `outOfOrder` warning, and future-JDK Mockito agent warning.

## Environment constraints during this audit

Docker CLI was unavailable and Docker Desktop was stopped, so Docker/Testcontainers validation was not applicable locally. The repository contains no Dockerfile; CI explicitly reports Docker build validation as not applicable unless a Dockerfile is later tracked. Local MySQL 8 was available and was used for the fresh-database test.

The legacy standalone `scripts/ci/browser-smoke.mjs` uses serial Chrome `--dump-dom` processes and did not return within six minutes on this Windows Chrome installation. Its complete 22-route matrix is now enforced by `tests/e2e/route-smoke.spec.js`, which passed 44 desktop/mobile cases. Playwright's first Windows web-server readiness process also required reuse of already healthy preview servers; Ubuntu CI retains the standard self-managed server flow.

# Contributing

## Scope first

Keep changes component-scoped and preserve existing routes and invitation behavior. Before deleting code or assets, prove non-use from entrypoints, route configuration, static imports, dynamic public paths, and the relevant test/build gates.

## Local workflow

1. Create a focused branch from the intended base.
2. Copy `.env.example` to an untracked `.env`; never put real credentials in examples, fixtures, logs, or commits.
3. Install with lockfile-respecting commands (`npm ci`, Maven wrapper, and pinned Python requirements).
4. Run the component gates documented in `README.md`.
5. Run `git diff --check` and inspect `git status --short` before committing.
6. Use small, logical commits and explain any unverified external dependency in the pull request.

## Component expectations

- Backend: `./mvnw clean verify`; add a new Flyway migration instead of changing a shared migration.
- User/admin frontends: lint, Vitest, Knip, depcheck, and production build. Route or rendering changes also require Playwright.
- Telegram bot: pytest, Ruff, Bandit for executable source, compileall, and pip-audit.
- Documentation: use repository-relative paths and state whether evidence is automated, manually observed, or blocked.

## Security and destructive changes

Do not commit secrets or rewrite shared history without maintainer coordination. Deletions require evidence and a manifest entry. Do not represent a deployment as healthy without provider logs and a verified service URL.

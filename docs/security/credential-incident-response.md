# Credential Incident Response

## Incident summary

A Telegram bot token-shaped credential was committed in the former root `install` file. Treat that credential as compromised even if the bot still appears to work. Removing it from the current branch does not invalidate it and does not remove it from Git history, forks, caches, CI logs, or existing clones.

The current cleanup removes the file, standardizes examples on `<TELEGRAM_BOT_TOKEN>`, and prevents the Telegram start helper from printing token-bearing API URLs or token-bearing HTTP exceptions. Backend password-reset tokens are no longer written to application logs.

## Required owner action now

1. Open BotFather from the Telegram account that owns the bot.
2. Revoke the exposed token and generate a replacement.
3. Store the replacement only in the deployment secret store and local untracked `.env` files.
4. Rotate `ADMIN_PAYMENT_SECRET`, JWT signing material, database passwords, OAuth client secrets, webhook secrets, and any private keys if the history review confirms that real values were committed.
5. Restart affected services and verify the old Telegram token and other rotated credentials are rejected.
6. Review Telegram bot administrators, webhook URL, recent updates, and payment-confirmation audit records for misuse.

Do not paste replacement credentials into issues, pull requests, commit messages, documentation, or chat transcripts.

## Current-tree verification

Run both a purpose-built scanner and targeted checks from the repository root:

```bash
gitleaks git --redact --no-banner --exit-code 1
git grep -n -I -E '([0-9]{7,12}:[A-Za-z0-9_-]{20,}|BEGIN ([A-Z ]+)?PRIVATE KEY|github_pat_|gh[pousr]_)' -- .
```

Review placeholders manually; a scanner result is not safe merely because it appears in an example file. Never print the matched secret into CI logs.

## History cleanup procedure

History rewriting is a repository-owner operation. Coordinate a maintenance window, require all contributors to stop pushing, archive the pre-rewrite object IDs, and work from a fresh mirror. Do not run this against an ordinary working copy.

Create `credential-replacements.txt` outside the repository. Put each confirmed leaked value in that file using `git filter-repo` replacement syntax and replace it with a non-secret marker such as `<REDACTED>`. Do not commit the replacement file.

```bash
git clone --mirror https://github.com/Ny-Panha/Koupreng-invitation_project.git koupreng-cleanup.git
cd koupreng-cleanup.git
git filter-repo --sensitive-data-removal \
  --replace-text ../credential-replacements.txt \
  --invert-paths \
  --path install \
  --path credential_info.txt \
  --path .run-logs/backend-dev.out.log
gitleaks git --redact --no-banner --exit-code 1
git fsck --full --no-reflogs --unreachable
```

Inspect rewritten refs and compare release tags before publishing:

```bash
git show-ref
git log --all --oneline --decorate -20
```

Only after token rotation, scan review, backup, and team coordination should an owner update remote refs. The cleanup branch does not execute a force push automatically.

```bash
git push --force --mirror origin
```

After the rewrite, every contributor must discard old clones and clone again. GitHub Actions caches, artifacts, release attachments, package registries, deployment logs, and third-party mirrors require separate review because Git history rewriting does not erase them.

## Scanner scope and known historical paths

The evidence pass covers Telegram bot tokens, JWT-like strings, database URLs with embedded credentials, ABA/admin payment secrets, common API-key formats, OAuth client secrets, and private-key headers. Historical review must include at least the former `install`, `credential_info.txt`, `.run-logs/backend-dev.out.log`, environment examples, and old frontend/backend paths reported by the scanner.

False positives should be documented by rule and path. Confirmed values must be rotated before any suppression is added.

## Log-handling policy

- Never log `Authorization`, cookies, JWTs, password-reset or email-verification tokens, Telegram API URLs, payment/webhook secrets, raw payment messages, payer names, email addresses, or phone numbers.
- Log stable internal record IDs and coarse result/status values only when needed for operations.
- Keep request query-string logging disabled in production unless every parameter has been reviewed for sensitive data.
- Redact secret values at log ingestion as defense in depth; application-side omission remains mandatory.

# Folder Structure

Verified current root:

```text
apps/frontend-user
apps/frontend-admin
apps/backend
apps/telegram-bot
packages/shared-types
packages/shared-ui
packages/shared-utils
packages/api-contracts
docs
infra
scripts
tools
```

Frontend-user rules:
- Route composition lives in `apps/frontend-user/src/app`.
- Route wrappers live in `pages/`.
- Feature behavior lives in `features/`.
- Shared code is for code used by more than one feature.

Frontend-admin rules:
- Admin routes are guarded by `RequireAdmin`.
- Admin HTTP access is centralized in `apps/frontend-admin/src/shared/api/adminHttpClient.js`.
- Route wrappers live in `pages/`; feature behavior remains under `features/`.

Backend target rules:
- Core concerns should live under `core`.
- Domain behavior should live under `modules`.
- Third-party integration code should live under `integrations`.

Current backend package status:
- Insufficient data to verify full completion of package move: global `controller`, `service`, `repository`, and `entity` packages still exist in the verified checkout.

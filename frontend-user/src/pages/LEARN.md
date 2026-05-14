# 📘 LEARN — `src/pages/`

Each file here is a **full page** rendered by the router. Three groups:

| Sub-folder | Routes |
|---|---|
| `marketing/` | `/` (home), `*` (404) |
| `auth/` | `/login`, `/register`, `/forgot-password`, `/reset-password` |
| `host/` | `/app/dashboard`, `/app/events`, `/app/guests`, ... |

Pages mostly:
1. Read state (auth, theme, route params).
2. Call services (login, get events, ...).
3. Compose UI from `shared/ui` and `shared/layout`.

Read the `LEARN.md` in each sub-folder for details.

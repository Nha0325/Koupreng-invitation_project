# Koupreng — Admin Panel (frontend-admin)

Admin dashboard for controlling the Koupreng user app. It authenticates against
the Spring backend with a JWT and is restricted to users whose role is `ADMIN`.

## Features

- **Login** — `/api/auth/login`. Only `ADMIN` accounts are allowed in.
- **Dashboard** — aggregate stats (users, invitations, payments, revenue).
- **Users** — list every user and promote/demote roles (`USER` ⇄ `ADMIN`).
- **Invitations** — list all invitations across users; view details, publish,
  unpublish, and delete.
- **Payments** — template payment / PayWay (ABA KHQR) order report with totals.

## Backend endpoints used

| Area        | Endpoint                                   | Auth        |
| ----------- | ------------------------------------------ | ----------- |
| Login       | `POST /api/auth/login`                     | public      |
| Logout      | `POST /api/auth/logout`                    | bearer      |
| Users       | `GET /api/admin/users`                     | ROLE_ADMIN  |
| Update role | `PATCH /api/admin/users/{id}/role`         | ROLE_ADMIN  |
| Invitations | `GET /api/admin/invitations`               | ROLE_ADMIN  |
| Invitation  | `GET /api/v1/invitations/{id}`             | bearer      |
| Publish     | `PATCH /api/v1/invitations/{id}/publish`   | bearer      |
| Unpublish   | `PATCH /api/v1/invitations/{id}/unpublish` | bearer      |
| Delete      | `DELETE /api/v1/invitations/{id}`          | bearer      |
| Payments    | `GET /api/v1/admin/template-payments`      | ROLE_ADMIN  |

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if needed
npm run dev            # runs on http://localhost:5174
```

`VITE_API_URL` defaults to `http://localhost:8080/api`. The backend already
allows `http://localhost:5174` via CORS.

## Scripts

- `npm run dev` — start the dev server (port 5174)
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

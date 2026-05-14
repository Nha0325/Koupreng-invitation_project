# 📘 LEARN — `src/app/`

This folder owns **app-wide infrastructure** — things every page uses but no page should redeclare:

| File / Folder | Job |
|---|---|
| `router.jsx` | Maps URLs to page components |
| `auth/` | Login state, token, route guard |
| `theme/` | Light / dark mode |

---

## 1. `router.jsx` — the URL → page map

This file has 3 important ideas:

### a) `lazy` imports

```jsx
const HomePage = lazy(() => import("../pages/marketing/HomePage"));
```

`lazy()` tells React: "Don't download this page until the user actually visits it." It makes the first page load fast.

### b) Layout routes (Shells)

There are 3 different "chrome" layouts:

| Shell | Used for | Has |
|---|---|---|
| `<MarketingShell />` | `/`, `/login`, `/register`, `/forgot-password` | Header only |
| `<HostShell />` | `/app/*` (after login) | Header + Sidebar + Toaster |
| `<InvitationShell />` | `/i/:slug` and `/invitation/:slug` | Nothing (full-bleed) |

Routes that share a shell are nested under it:

```jsx
<Route element={<MarketingShell />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
</Route>
```

### c) Auth guard

The `/app/*` group is wrapped in `<RequireAuth />`:

```jsx
<Route element={<RequireAuth />}>
  <Route element={<HostShell />}>
    <Route path="/app/dashboard" element={<DashboardPage />} />
    ...
  </Route>
</Route>
```

If the user is not logged in, `RequireAuth` redirects to `/login`.

### d) Suspense fallback

Because pages are lazy-loaded, while React is downloading them we show a `<Spinner />` via `<Suspense>`.

---

## 2. Sub-folders

- `auth/LEARN.md` — explains AuthContext, RequireAuth, useAuth
- `theme/LEARN.md` — explains ThemeContext, useTheme

Read those next ▶

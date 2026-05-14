# 📘 LEARN — `src/shared/layout/`

Big layout pieces: the **chrome** of the app (header, sidebar, shell wrappers).

| File | Job |
|---|---|
| `Header.jsx` + `.css` | Top nav bar (logo + links + login/register) |
| `Aside.jsx` + `.css` | Left sidebar in the host app |
| `MarketingShell.jsx` | Public chrome (Header only) |
| `HostShell.jsx` | Authenticated chrome (Header + Aside + Toaster) |
| `InvitationShell.jsx` | No chrome (full-bleed invitation page) |

---

## 1. What is a "Shell"?

A **layout component** that wraps page content. Pages don't repeat the header/sidebar — the shell does it once. This makes the app consistent and easier to maintain.

The router uses shells as **layout routes**:

```jsx
<Route element={<MarketingShell />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/login" element={<LoginPage />} />
</Route>
```

When the URL matches `/login`, React Router renders:

```
<MarketingShell>
  <LoginPage />
</MarketingShell>
```

Where does `<LoginPage />` go inside `<MarketingShell />`? At the `<Outlet />`:

```jsx
<main>
  <PageTransition>
    <Outlet />   ← child route renders here
  </PageTransition>
</main>
```

---

## 2. The 3 shells compared

| | MarketingShell | HostShell | InvitationShell |
|---|---|---|---|
| Header | ✅ | ✅ | ❌ |
| Aside | ❌ | ✅ | ❌ |
| Toaster | ✅ | ✅ | ❌ |
| PageTransition | ✅ | ✅ | ✅ |
| Auth required? | No | Yes (wrapped by `<RequireAuth />`) | No |

Each shell is **simple**: just JSX that arranges Header / Aside / Outlet.

---

## 3. `Header.jsx`

Responsibilities:
- Logo on the left.
- Center nav links (`Home`, `FAQs`, `Pricing`).
- Right cluster: `Log in`, `Get Started`, mobile burger.
- Mobile drawer (opens when burger is clicked).

State:
```js
const [menuOpen, setMenuOpen] = useState(false);
```

Closes the drawer on route change:
```js
useEffect(() => { setMenuOpen(false); }, [location.pathname]);
```

Smooth scroll to a section on the same page:
```js
onClick={(e) => {
  e.preventDefault();
  document.getElementById(scrollTo)?.scrollIntoView({ behavior: "smooth" });
}}
```

---

## 4. `Aside.jsx`

The host app sidebar. Contains:
1. **Wedding progress card** — couple names + progress bar.
2. **Primary nav** — Dashboard, Guests, Expenses, Gifts, Templates, Add Template.
3. **Divider**.
4. **Secondary nav** — Settings, Help, Logout.

Each nav item is rendered with the `<NavItem />` sub-component:

```jsx
<NavItem item={item} active={location.pathname === item.path} onClick={handleNav} />
```

The `active` prop adds a CSS class for the highlighted state.

`location.pathname` comes from `useLocation()` — the current URL path.

`navigate(item.path)` is from `useNavigate()` — programmatic navigation.

---

## 5. `MarketingShell.jsx`

```jsx
const MarketingShell = () => (
  <>
    <Header />
    <main>
      <PageTransition>
        <Outlet />
      </PageTransition>
    </main>
    <Toaster />
  </>
);
```

Just composition. No state, no logic.

---

## 6. `HostShell.jsx`

```jsx
<Header />
<div className="app-layout-with-aside">
  <Aside />
  <main className="app-main-content">
    <PageTransition>
      <Outlet />
    </PageTransition>
  </main>
</div>
<Toaster />
```

Same idea but with the sidebar in a flex row.

---

## 7. `InvitationShell.jsx`

Smallest of all — no chrome:

```jsx
<PageTransition>
  <Outlet />
</PageTransition>
```

The invitation page owns the entire `100dvh` viewport. The design rule: **the public invitation never imports from the host tree**. So no `<Header />`, no `<Aside />`, no `<AuthContext>`.

---

## TL;DR

- A Shell = layout wrapper for routes.
- 3 shells: Marketing, Host, Invitation.
- `<Outlet />` is where the child route renders.
- Header has a mobile drawer that closes on route change.
- Aside is the host app sidebar with nav + progress card.

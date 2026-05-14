# 📘 LEARN — `src/app/auth/`

This folder handles **who is logged in**. There are 4 files:

| File | Job |
|---|---|
| `AuthContext.jsx` | The `<AuthProvider>` that holds user + token state |
| `useAuth.js` | A small hook to read auth state from any component |
| `RequireAuth.jsx` | Route guard — redirects to `/login` if not logged in |
| `*.test.jsx` | Tests |

---

## 1. The Context API in 30 seconds

React Context lets you share data without "prop drilling" (passing props through 10 levels). The pattern is:

1. **Create** a context — `const AuthContext = createContext(null)`
2. **Provide** it at the top of the tree — `<AuthContext.Provider value={...}>`
3. **Consume** it anywhere below — `useContext(AuthContext)`

We do exactly this for auth and theme.

---

## 2. `AuthContext.jsx` — the brain

The exported `<AuthProvider>` keeps **3 pieces of state** in memory:

```js
const [token, setToken]   = useState(...) // the JWT (string)
const [user, setUser]     = useState(null) // user profile object
const [status, setStatus] = useState(...)  // 'loading' | 'authenticated' | 'unauthenticated'
```

It exposes 3 actions:

| Action | What it does |
|---|---|
| `login(token, user)` | Save token in `localStorage`, set `status = authenticated` |
| `logout()` | Clear token + state, call backend to invalidate session |
| `refresh()` | Re-fetch `/users/me` to update profile |

### Lifecycle flow

```
App mounts
   ↓
Read token from localStorage
   ↓
   ├─ no token → status = 'unauthenticated' → show /login
   └─ token exists → status = 'loading' → call GET /users/me
                                              ↓
                                        ┌──────┴──────┐
                                       OK            FAIL
                                        ↓             ↓
                              status = 'authenticated'  clear token + 'unauthenticated'
```

### The `auth:expired` listener

When the API client gets a `401` response (token expired), it dispatches a `auth:expired` event. The provider listens and calls `logout()` automatically. This is why expired sessions kick you to the login page without you doing anything in the page code.

```js
useEffect(() => {
  const handler = () => logout();
  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
}, [logout]);
```

The `return () => ...` is **cleanup**: when the component unmounts, remove the listener so we don't leak memory.

---

## 3. `useAuth.js` — read auth from any component

```js
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null || ctx === undefined) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
```

The throw is there so you find bugs early. Without it, you'd get weird crashes deeper in the tree.

Use it like this:

```jsx
function ProfileButton() {
  const { user, logout } = useAuth();
  return <button onClick={logout}>Hi {user.name}</button>;
}
```

---

## 4. `RequireAuth.jsx` — route guard

This is rendered as a **layout route**. It does 3 things based on `status`:

| status | What renders |
|---|---|
| `'loading'` | `<Spinner />` (still checking the token) |
| `'unauthenticated'` | `<Navigate to="/login?next=..." />` |
| `'authenticated'` | `<Outlet />` (the matched child route) |

The clever bit:

```js
const encodedPath = encodeURIComponent(location.pathname + location.search);
return <Navigate to={`/login?next=${encodedPath}`} replace />;
```

We remember where the user wanted to go, so after they log in we can send them back.

`<Outlet />` from React Router is a placeholder where the matched child route renders.

---

## 5. Tests

`AuthContext.test.jsx` and `RequireAuth.test.jsx` use **React Testing Library**. They render the component, simulate user actions, and assert what should appear. Read them like documentation: each `it("...")` block describes a behavior that must always work.

---

## TL;DR

- `<AuthProvider>` keeps the user + token in memory and in `localStorage`.
- `useAuth()` reads it.
- `<RequireAuth />` blocks pages from anonymous users.
- A 401 from the API auto-logs-out via a custom event.

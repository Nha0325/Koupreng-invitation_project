# 📘 LEARN — `src/shared/services/`

A **service** is a thin wrapper around the API client that gives clean function names to your UI:

```js
authService.login({ email, password })   // not client.post('/auth/login', ...)
eventService.list()                       // not client.get('/events')
```

Files:

| File | Endpoints |
|---|---|
| `authService.js` | `/auth/login`, `/auth/logout`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`, `/users/me`, `/users/me/change-password` |
| `userService.js` | `/users/me` (get & update) |
| `eventService.js` | `/events/*` — has a **MOCK** mode for offline dev |
| `guestService.js` | `/guests/*` |
| `rsvpService.js` | `/rsvp` — public submit |

---

## 1. Pattern of a service method

```js
async login({ email, password }) {
  const response = await client.post('/auth/login', { email, password });
  return response.data;
}
```

Three lines:
1. Call the API.
2. `await` the response.
3. Return only `response.data` so the caller doesn't see Axios's wrapper.

Result: pages just do `const user = await authService.me()`.

---

## 2. The `MOCK` flag in `eventService` and `guestService`

```js
const MOCK = import.meta.env.VITE_USE_MOCK === 'true';
```

If `VITE_USE_MOCK=true` in your `.env`, the service returns fake data instead of calling the backend. Useful when:
- Backend is not ready.
- You want to develop offline.
- You write tests.

Example:

```js
async getBySlug(slug) {
  if (MOCK) {
    return { ...cloneSample(), slug };
  }
  const response = await client.get(`/events/slug/${slug}`, { public: true });
  return response.data;
}
```

The clone-sample trick makes sure each caller gets a fresh copy (no leaking shared state).

---

## 3. `{ public: true }` calls

Notice in `eventService.getBySlug` and `rsvpService.submit`:

```js
client.post('/rsvp', payload, { public: true })
```

This tells the request interceptor: "do not attach the JWT". The public invitation page must work without a logged-in user.

---

## 4. `rsvpService` and `parseError`

`rsvpService.submit` is the only service that **wraps errors**:

```js
try {
  const r = await client.post('/rsvp', payload, { public: true });
  return r.data;
} catch (err) {
  throw parseError(err);
}
```

Why here? RSVP UI shows specific error messages (`"Sorry, RSVP closed"`, `"Already submitted"`). Wrapping with `parseError` guarantees the catch block sees a clean `ApiError`.

---

## 5. How a page uses a service

```jsx
import authService from "../shared/services/authService";
import { useAuth } from "../app/auth/useAuth";

function LoginPage() {
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    const data = await authService.login({ email, password });
    login(data); // updates AuthContext
    navigate("/app/dashboard");
  }
}
```

Service calls API → returns clean data → page calls `login(data)` to update state.

---

## TL;DR

- Each service is a thin wrapper: clean function name + `return response.data`.
- `eventService` and `guestService` have MOCK mode for offline dev.
- `{ public: true }` skips the auth header.
- `rsvpService` always throws `ApiError` to make UI error handling consistent.

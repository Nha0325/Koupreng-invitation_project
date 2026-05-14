# 📘 LEARN — `src/shared/api/`

The **HTTP layer**. Two files:

| File | Job |
|---|---|
| `client.js` | Configured Axios instance |
| `errors.js` | Typed error class + parser |

---

## 1. `client.js` — the Axios instance

Axios is a library that makes HTTP requests easier than `fetch`. We build **one** shared instance for the whole app:

```js
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  withCredentials: false,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});
```

So calling `client.get('/users/me')` actually hits `http://localhost:8080/api/users/me`.

### Interceptors (the magic)

#### Request interceptor — attach the token

```js
client.interceptors.request.use((config) => {
  if (config.public === true) return config;   // skip for public endpoints

  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

Every request automatically gets `Authorization: Bearer <jwt>`. **Except** when the caller marks it with `{ public: true }` (e.g. the public invitation page).

#### Response interceptor — auto-logout on 401

```js
client.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401 && error?.config?.headers?.Authorization) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
    }
    return Promise.reject(error);
  },
);
```

When the backend says "your token is expired" (401), we:
1. Delete the token.
2. Fire a custom `auth:expired` event.
3. The `<AuthProvider>` (in `app/auth/AuthContext.jsx`) listens and logs out.

This is **decoupling**: the API client doesn't know what `AuthProvider` does, it just shouts "expired!" and lets listeners react.

### Two exports

```js
export const TOKEN_STORAGE_KEY = 'koupreng.token';
export const AUTH_EXPIRED_EVENT = 'auth:expired';
```

These constants are imported by `AuthContext` to keep the storage key and event name in sync.

---

## 2. `errors.js` — uniform error shape

Axios throws different error shapes (network error, 4xx, 5xx, abort, ...). UIs hate that. So we normalize everything into one class:

```js
class ApiError extends Error {
  constructor({ code = 'UNKNOWN', message = 'Request failed', status = 0 }) {
    super(message);
    this.code = code;
    this.message = message;
    this.status = status;
  }
}
```

And we have a parser:

```js
parseError(err) → ApiError
```

It looks at the thrown value and pulls out:
- `code` — short ID like `RSVP_CONFLICT`, `NETWORK_ERROR`
- `message` — what to show the user
- `status` — HTTP status (or `0` if no response)

### Why bother?

UI code becomes simple:

```js
try {
  await rsvpService.submit(payload);
} catch (err) {
  if (err.status === 409) toast("Already RSVP'd");
  else toast(err.message);
}
```

Same shape no matter the failure type.

---

## TL;DR

- One Axios instance with **request** (add token) and **response** (auto-logout on 401) interceptors.
- One `ApiError` class so UI never deals with raw axios errors.
- Mark calls `{ public: true }` to skip the auth header (public invitation, RSVP).

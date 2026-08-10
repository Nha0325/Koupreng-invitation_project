# Frontend browser-storage and domain-authority audit

**Audit date:** 2026-08-10
**Scope:** direct `localStorage`/`sessionStorage` use in both React applications and storage adapters used by product domains

## Classification policy

| Category | Permitted use |
| --- | --- |
| A — preference/context | Language, active UI context, or short-lived access state that is not the system of record. |
| B — legitimate unsaved draft | User-created work that has not yet been explicitly saved to the backend. UI must label it local and preserve a migration/save path. |
| C — server-owned domain data | Guests, RSVPs, budgets, gifts, payments, seats, check-ins, memberships, invitations, and other collaborative records after a server resource exists. Browser copies cannot be authoritative. |
| S — security-sensitive session | Auth/session or protected-invitation access material. Minimize lifetime and content; never log it. |

## Key inventory

| Key / pattern | Storage | Owner | Class | Current behavior and decision |
| --- | --- | --- | --- | --- |
| `koupreng.lang` | local | language preference | A | Canonical language key; retain for boot-time Khmer/English selection. |
| `koupreng.locale` | local | legacy language preference | A / legacy | Read/write compatibility remains; plan one measured migration after confirming no older clients depend on it. |
| `koupreng.auth` | session by default; local if configured | user auth envelope | S | Retain only under the configured auth mode. Bearer mode stores token/user/expiry; cookie mode sanitizes the access token. Add server session bootstrap before relying on cookie mode. |
| `koupreng.admin.auth` | session | admin auth envelope | S | Correctly session-scoped. Clear on logout/401 and never copy into user storage. |
| `koupreng_invitation_access_{slug}` | session | protected public invitation | S | Retain only for the browser session; key is scoped by slug. Backend remains responsible for verification and expiry. |
| `koupreng.wedding.drafts` | local | wedding builder | B | Legitimate browser draft containing content/design/media references before cloud save. Label local-only and provide explicit server-save semantics. |
| `koupreng.host.activeEventId` | local | dashboard context | A | Retain as a selected-context pointer only. Resolve it against the authenticated user's server invitations before mutation. |
| `koupreng:guests:{eventId}` | local | manual/local draft guests | B before server invitation; C afterward | Allowed only when no server invitation matches. This pass prevents mixing or fallback writes for persisted invitations. |
| `koupreng.host.manualGuests.{eventId}` | local | legacy manual guests | B / legacy | Read compatibility only through planning storage. Do not write this legacy shape for server invitations. |
| `koupreng.host.guestGroups.{eventId}` | local | guest group labels | A for private display; C if collaborative | Currently local. Acceptable for single-browser labels, but must move to backend before roles/team workflows claim shared taxonomy. |
| `koupreng.host.guestCategories.{eventId}` | local | guest category labels | A for private display; C if collaborative | Same constraint as guest groups. |
| `koupreng:budget:{eventId}` | local | local draft expenses | B before server invitation; C afterward | Backend `/budget` and `/budget/items` are authoritative for persisted invitations. |
| `koupreng.host.expenses.{eventId}` | local | legacy expenses | B / legacy | Compatibility read/removal only; do not treat as cloud-saved. |
| `koupreng:gifts:{eventId}` | local | local draft gifts | B before server invitation; C afterward | Backend gift endpoints are authoritative for persisted invitations. |
| `koupreng.host.gifts.{eventId}` | local | legacy gifts | B / legacy | Compatibility read/removal only. |
| `koupreng.wedding.rsvps` | local | legacy RSVP snapshot | C / legacy read-only | This pass removes RSVP write fallback. May remain readable for old local drafts/dashboard migration, never authoritative for a published invitation. |
| `koupreng.wedding.rsvps.{targetId}` | local | legacy scoped RSVP snapshot | C / legacy read-only | Same policy: no new writes for server/public RSVP operations. |
| `lastTemplatePaymentOrder` | session | checkout recovery pointer | A/S | Snapshot may help return-page recovery, but order status/access must always be fetched from the backend. Never grant entitlement from the snapshot. |

## Authority rules by domain

### Guests and RSVPs

1. Resolve the requested route invitation by exact backend ID.
2. If it exists, load guests and RSVPs from the backend and join only by exact guest ID.
3. Do not append browser guests to the result.
4. Create/update/delete/import errors remain errors; do not persist a local “success.”
5. If no server invitation exists and the user is explicitly operating a local draft, manual guests may use the scoped draft key.

This rule is covered by focused tests for cross-invitation isolation and failed-import non-persistence.

### Budgets and gifts

Backend invitation IDs select backend budget/gift endpoints. Local data is a draft-only fallback for an unsaved builder event. Screens must show which mode is active before writes; the dashboard should never combine both into one total.

### Payments and subscriptions

Payment order, transaction, subscription, and template access state are always server-owned. `lastTemplatePaymentOrder` is merely an order-code recovery aid. Success pages must fetch order status and entitlement; clearing browser storage must not revoke paid access.

### Check-in and seating

No browser-authoritative check-in or seating records are permitted. These operations affect multiple devices and require backend authorization, idempotency/concurrency handling, auditability, and current capacity.

### Organizations

Organizations, membership, invitations, and roles are server-owned. No role or ownership decision may be cached as durable truth. The UI now fails closed when ownership context is missing; future effective permissions should be refreshed from the backend.

## Auth/session findings

### Default behavior

`authStorage.js` defaults to `sessionStorage`, despite older environment documentation that may describe local persistence. This reduces persistence lifetime for bearer tokens. `VITE_AUTH_STORAGE=localStorage` deliberately opts into longer-lived browser exposure; cookie mode strips any access token from the stored envelope.

### Open issue: cookie-mode bootstrap

Cookie mode can restore a user envelope without a bearer token, but protected routing needs a verified `/api/auth/me` bootstrap state before it can accurately decide. Required states are `checking`, `authenticated`, and `anonymous`; render a neutral shell/skeleton during `checking` to avoid protected-content flash or premature redirects.

### Unauthorized cleanup

The admin client has explicit session cleanup behavior. The user client should match it with one centralized 401 policy that clears the selected storage, resets in-memory auth, and preserves only a safe return path. Avoid redirect loops on login/reset/public endpoints.

## Data lifecycle and migration guidance

- Do not bulk-delete current storage keys as part of this audit.
- When a local draft is first saved to the backend, record the server ID and mark the local copy as a recovery draft until a confirmed response is received.
- Offer conflict-safe recovery before removing old drafts; include local and server timestamps.
- Remove legacy keys only after telemetry/manual migration proves they are no longer needed.
- Never migrate bearer tokens, protected-invitation tokens, or payment snapshots into URLs, logs, analytics properties, or error reports.
- A browser-storage failure (disabled/full/corrupt) must produce a visible local-save warning for Category B data; silent catch is acceptable only for nonessential Category A preferences.

## Tests required

| Scenario | Expected result |
| --- | --- |
| Server invitation ID has backend and local guests | Only backend guests render. |
| Requested invitation ID is absent but other invitations exist | No first-invitation fallback; show empty/error state. |
| Server guest import fails | No browser guest write; error is visible. |
| Public RSVP API fails | No synthetic local RSVP success. |
| Paid order return with forged success query | Entitlement remains locked unless backend confirms access. |
| Session storage cleared | Cloud invitations/guests/payments return after login; only local drafts are absent. |
| Cookie auth page refresh | Neutral bootstrap, then authenticated page or login; no protected flash. |
| Organization context omits owner/user | Management controls stay hidden/disabled. |

## Current remediation status

| Area | Status |
| --- | --- |
| Guest/server authority | FIXED in this pass |
| RSVP synthetic write fallback | REMOVED in this pass |
| Payment server authority | PRESERVED; history/receipt client completed |
| Organization fail-closed controls | FIXED in this pass |
| Budget/gift local draft labeling | OPEN |
| Group/category team synchronization | OPEN BACKEND CONTRACT |
| Cookie-mode bootstrap and user 401 cleanup | OPEN |
| Legacy key retirement | DEFERRED; preserve user data |

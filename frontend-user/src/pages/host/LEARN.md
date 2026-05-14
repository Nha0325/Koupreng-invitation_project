# 📘 LEARN — `src/pages/host/`

The pages **after login** (under `/app/*`). All wrapped in `<HostShell />` (Header + Aside + Toaster) and gated by `<RequireAuth />`.

| File | Route | Job |
|---|---|---|
| `DashboardPage.jsx` + `Dashboard.css` | `/app/dashboard` | Stat cards + quick actions + chart + tasks |
| `EventsPage.jsx` + `EventsPage.css` | `/app/events` | List events + open create modal |
| `CreateEventPage.jsx` + `CreateEventPage.css` | `/app/events/new` | Create-event form |
| `GuestsPage.jsx` + `GuestsPage.css` | `/app/guests` | Guest list table |
| `ExpensesPage.jsx` + `ExpensesPage.css` | `/app/expenses` | Expenses tracker |
| `WeddingGiftPage.jsx` + `WeddingGiftPage.css` | `/app/gifts` | Gifts received list |
| `TemplatePage.jsx` + `TemplatePage.css` | `/app/templates` | Browse invitation templates |
| `AddTemplatePage.jsx` + `AddTemplatePage.css` | `/app/templates/new` | Add a template |
| `SettingsPage.jsx` | `/app/settings` | Settings (placeholder) |

---

## 1. `DashboardPage.jsx` — pattern to learn

The dashboard composes 5 widgets:
1. `<StatCards />` — top row (Guests, Events, Confirmed, Pending, Rejected).
2. `<QuickActions />` — buttons to add guest, send invites, etc.
3. `<UpcomingTasks />` — to-do list.
4. **Chart** — expenses vs budget per month.
5. `<GuestTable />` — preview of recent guests.

Data comes from two places:
- **Static mock** in `shared/hooks/useDashboardData.js` (until backend ships).
- **Live** from `useEvents()` for the event count.

```js
const { events, fetchEvents } = useEvents();
useEffect(() => { fetchEvents(); }, [fetchEvents]);
```

Then pass `events.length` into the stat card.

### `useEffect` dependency rule

`fetchEvents` is in the dependency array because we use it inside the effect. Thanks to `useCallback` inside `useEvents`, its reference is stable — so the effect runs once, not in a loop.

---

## 2. `EventsPage.jsx` — list + create

Composition:
- `<TopBar />` — internal sub-component, custom user/lang switcher.
- `<RightSidebar />` — vertical icon sidebar.
- A grid of `<EventCard />`s mapped from `events`.
- A modal mounting `<CreateEventPage />` for inline creation.

State:
```js
const [showCreate, setShowCreate] = useState(false);
const [selectedEvent, setSelectedEvent] = useState(null);
```

Why include the create page as a modal? UX choice — user can create without leaving the list. The same `<CreateEventPage />` is also a standalone route at `/app/events/new`.

---

## 3. `SettingsPage.jsx` — minimal page

Tiny placeholder:

```jsx
const SettingsPage = () => (
  <div className="dash-main">
    <h1>ការកំណត់</h1>
    <p>គ្រប់គ្រងគណនី និងចំណូលចិត្តរបស់អ្នក</p>
  </div>
);
```

It is fine to start with a placeholder and grow later.

---

## 4. CSS files in this folder

Each page has its own `.css` because the host pages have **rich, custom layouts** that Tailwind utilities alone don't cover well. Pattern:

```jsx
import "./Dashboard.css";
```

Tailwind classes are still used inline, but heavy class combos and animations live in the `.css` file.

---

## 5. Mental model for adding a new host page

Steps:
1. Create `MyPage.jsx` in this folder.
2. Add a route in `src/app/router.jsx` inside the `<HostShell />` group.
3. Use `useEvents`, `useAuth`, etc. for data.
4. Compose using `<GlassCard>`, `<Button>`, `<SectionHeading>` from `shared/ui`.
5. (Optional) Add a `MyPage.css` for custom styles.
6. Add a nav link in `shared/layout/Aside.jsx` if you want it in the sidebar.

---

## TL;DR

- All host pages live behind `<RequireAuth />` and `<HostShell />`.
- Use `useEvents` (live) and `useDashboardData` (mock) for data.
- Pages compose `<GlassCard>`, `<Button>`, and section sub-components.
- Each page has its own `.css` for custom layout.

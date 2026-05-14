# 📘 LEARN — `src/shared/`

This folder is the **toolbox** of the project. Anything reusable across pages lives here:

| Sub-folder | What it has |
|---|---|
| `api/` | Axios client + error helpers |
| `services/` | Functions that call the backend (login, getEvents, ...) |
| `hooks/` | Custom React hooks (useToggle, useEvents, ...) |
| `ui/` | Reusable UI components (Button, GlassCard, Spinner, ...) |
| `layout/` | Big layout pieces (Header, Aside, Shells) |
| `motion/` | Framer Motion variants (animation presets) |

---

## Reading order

1. `api/LEARN.md` — how we call the backend
2. `services/LEARN.md` — login, events, RSVP service functions
3. `motion/LEARN.md` — animation variants
4. `hooks/LEARN.md` — custom hooks
5. `ui/LEARN.md` — small UI primitives
6. `layout/LEARN.md` — Header, Aside, Shells

---

## Why split it like this?

It is a **layered** design. Each layer only knows the layer below it:

```
Pages           ← uses everything below
  ↓
UI / Layout     ← uses hooks / services
  ↓
Services        ← uses api
  ↓
API client      ← raw axios
```

Keeps the codebase predictable: when you debug, you only look at one layer at a time.

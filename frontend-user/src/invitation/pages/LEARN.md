# 📘 LEARN — `src/invitation/pages/`

| File | Route | Job |
|---|---|---|
| `InvitationPage.jsx` | `/i/:slug` and `/invitation/:slug` | The public invitation route |

---

## What it does

1. Reads the slug from the URL with `useParams()`.
2. Fetches the event for that slug (currently mocked, eventually `eventService.getBySlug`).
3. Shows a loader, error, or "not found" state.
4. On success, renders `<TemplateRenderer event={event} />` which picks the right design.

That's the whole page. The actual visuals live in `../templates/`.

---

## State machine

```
slug → fetchEvent
   ↓
loading=true
   ↓
   ├─ success → loading=false, event=data → render template
   ├─ error   → loading=false, error=msg  → show error
   └─ no data → "Invitation not found"
```

This is a common React pattern: 3 booleans (`loading`, `error`, `data`). You will see it many times.

---

## Why two routes for one page?

The router maps both `/i/:slug` and `/invitation/:slug` to this page. The shorter `/i/` is what we share publicly (nice for QR codes and Telegram). The longer alias is for backward compatibility.

---

See `../LEARN.md` for the bigger picture (registry + templates).

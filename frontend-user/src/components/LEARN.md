# 📘 LEARN — `src/components/`

This folder is currently **empty**. It is reserved for tiny shared widgets that don't fit neatly into `shared/ui/` or `shared/layout/`.

---

## When should I put a file here vs `shared/`?

| Use `shared/ui/` when... | Use `components/` when... |
|---|---|
| The component is a **design-system primitive** (Button, Spinner, Card) | The component is a **one-off widget** specific to this app's domain (e.g. `WeddingProgressBar`) but used in 2+ pages |

If only **one** page uses a widget, define it inside that page file (or a sibling file in `pages/host/`). Don't move it here just because.

---

## Why have an empty folder?

Two reasons:
1. Establishes an intent: "future shared widgets go here".
2. Lets the eslint / vitest configs reference the path without errors.

You can leave it empty until you actually need it.

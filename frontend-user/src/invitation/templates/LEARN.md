# 📘 LEARN — `src/invitation/templates/`

Each sub-folder is **one design** for the wedding invitation. They all share the same data contract.

| Folder | Style |
|---|---|
| `Classic/` | Elegant serif, centered, minimalist |
| `Modern/` | Bold sans-serif, white cards, gray background |
| `Luxury/` | Premium look |
| `Floral/` | Floral / nature-themed |

---

## The contract

Every template **must** accept this shape:

```ts
{
  groomName: string
  brideName: string
  date: string
  location: string
  story?: string
  schedule?: { time: string, event: string }[]
  gallery?: { src, alt, w, h }[]
  music?: string
  colors?: { primary: string, accent: string }
}
```

If your template needs a new field, add it to the canonical shape (see `shared/services/eventService.js → SAMPLE_EVENT`) so all templates share it.

---

## Minimum template skeleton

```jsx
export default function MyTemplate({ data }) {
  return (
    <div className="min-h-screen">
      <h1>{data.groomName} & {data.brideName}</h1>
      <p>{data.date}</p>
      <p>{data.location}</p>
    </div>
  );
}
```

That's all you need for a registered template. The rest is design.

---

## Why one template per file (not one big switch)?

Two reasons:
1. **Separation**: the Classic team can change Classic without breaking Modern.
2. **Lazy loading**: each file becomes a separate chunk that downloads only when used.

---

## Adding a new template

See the steps in `../LEARN.md` (section "How to add a new template").

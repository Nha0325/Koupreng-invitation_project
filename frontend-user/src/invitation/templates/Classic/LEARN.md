# 📘 LEARN — `Classic/` template

| File | Job |
|---|---|
| `ClassicTemplate.jsx` | Classic invitation design |

---

## Style summary

- White background.
- Centered serif heading: `text-4xl font-serif`.
- Three sections: Hero, Date & Location, Story, Schedule, Footer.
- Tailwind-only (no CSS file).

## Reading the JSX

The component is one `<div>` wrapper with conditional sections:

```jsx
{data.story && (
  <div className="mb-12">
    <p>{data.story}</p>
  </div>
)}
```

`{cond && <jsx />}` is the **conditional render** pattern in React: render only when `cond` is truthy.

```jsx
{data.schedule.map((item, index) => (
  <div key={index}>...</div>
))}
```

`.map(...)` turns an array into a list of elements. The `key` prop helps React track items (use a stable id when you have one, fallback to index when you don't).

---

## What to change to customize

- Heading size: change `text-4xl` to `text-5xl`.
- Font: change `font-serif` to `font-sans`.
- Background: change `bg-white` to `bg-rose-50`.
- Spacing: change `mb-12` to a different number.

Tailwind cheat-sheet style classes — it is fine to copy and tweak.

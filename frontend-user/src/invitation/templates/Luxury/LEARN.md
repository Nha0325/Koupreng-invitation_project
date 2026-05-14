# 📘 LEARN — `Luxury/` template

| File | Job |
|---|---|
| `LuxuryTemplate.jsx` | Premium-feel design with color personalization |

---

## Special trick: dynamic color from data

```jsx
const primaryColor = data.colors?.primary || "#7033ff";

<div style={{ backgroundColor: primaryColor }}>
  ...
  <div className="w-24 h-1 mx-auto mb-6" style={{ backgroundColor: primaryColor }} />
</div>
```

The couple can pick their own color and the template uses it for the page background and the gold-line divider. Notice the `?.` operator (optional chaining):

- `data.colors?.primary` returns `undefined` if `data.colors` is missing, instead of crashing.
- `|| "#7033ff"` provides a fallback when the value is missing.

---

## Style summary

- Background filled with `primaryColor`.
- Big white card centered (`bg-white shadow-2xl`).
- Serif heading 5xl, gold accent line, uppercase eyebrow.

This template demonstrates how to **mix Tailwind and inline `style`**: Tailwind for layout, inline style for runtime values you cannot know at build time.

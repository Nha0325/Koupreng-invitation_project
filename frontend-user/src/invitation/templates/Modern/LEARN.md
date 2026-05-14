# 📘 LEARN — `Modern/` template

| File | Job |
|---|---|
| `ModernTemplate.jsx` | Modern minimalist design |

---

## Style summary

- Gray background: `bg-gray-50`.
- Big bold names with an ampersand divider:
  ```jsx
  {data.groomName}<span className="text-gray-400 mx-4">&</span>{data.brideName}
  ```
- White cards with rounded corners + shadow for each section: `bg-white rounded-lg shadow-lg p-8`.
- Uppercase, wide-letter-spaced subheading: `uppercase tracking-widest`.

The structure is the same as Classic — only Tailwind classes differ.

---

## Same contract

This template uses `data.groomName`, `data.brideName`, `data.date`, `data.location`, `data.story`, `data.schedule`. All other templates use the same fields.

If your invitation data is missing one (e.g. no story), the `{data.story && ...}` guard hides the section automatically.

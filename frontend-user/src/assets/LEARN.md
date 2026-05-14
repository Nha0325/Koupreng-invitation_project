# 📘 LEARN — `src/assets/`

Static files used by the app (images, fonts).

| Folder | Job |
|---|---|
| `icons/` | PNG icons used in marketing (background, icon-1, icon-2-2, icon-2-3, icon-3, icon-4) |
| `fonts/` | Font files + `fonts.css` to register them |

---

## How to use an asset

In a JS/JSX file:

```jsx
import heroBg from "../assets/icons/background.png";

<div style={{ backgroundImage: `url(${heroBg})` }}>...</div>
```

Vite will:
1. Find the file.
2. Hash the filename for caching.
3. Bundle / inline / copy it as needed.
4. Replace the import with a URL string.

So you never write `/assets/...` paths manually. Always `import` and let Vite handle it.

---

## Fonts

`fonts.css` uses `@font-face` to register custom fonts:

```css
@font-face {
  font-family: "MyFont";
  src: url("./MyFont.woff2") format("woff2");
}
```

After importing this CSS once (e.g. from `index.css`), you can use the font with `font-family: "MyFont"` anywhere in the app.

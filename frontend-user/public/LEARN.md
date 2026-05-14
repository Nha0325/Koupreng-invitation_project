# 📘 LEARN — `public/`

Files in this folder are served **as-is** at the website root.

| File | URL |
|---|---|
| `favicon.svg` | `/favicon.svg` (the browser tab icon) |
| `icons.svg` | `/icons.svg` |
| `neofetch.svg` | `/neofetch.svg` |
| `example project/` | random images you can preview at `/example%20project/...` |

---

## `public/` vs `src/assets/`

| | `public/` | `src/assets/` |
|---|---|---|
| Imported in JS? | No — referenced by URL | Yes — `import x from ".../x.png"` |
| Hashed by Vite? | No | Yes (cache-busting) |
| When to use? | Files referenced by `<link>` in `index.html`, or when you need a fixed URL like `/favicon.svg` | Everything else |

Rule of thumb: prefer `src/assets/` so Vite can optimize it. Use `public/` only when you need a stable URL.

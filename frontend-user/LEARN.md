# 📘 LEARN — Frontend User (Koupreng)
This file teaches you what is inside this folder and how the app works. Read top to bottom slowly. នឹងងាយយល់។

---

## 1. What is this project?

`frontend-user` is the **website** that users see in their browser. It is built with:

| Tool | What it does | Easy explanation |
|---|---|---|
| **React** | UI library | Builds the screen with components |
| **Vite** | Bundler / dev server | Runs the project fast (`npm run dev`) |
| **React Router** | Page navigation | Changes URL `/login`, `/dashboard` etc. |
| **Tailwind CSS** | Styling | CSS classes like `bg-red-500` |
| **Framer Motion** | Animation | Smooth fade, slide, page transitions |
| **Axios** | HTTP client | Talks to the backend Java API |
| **Lenis** | Smooth scroll | Makes scrolling silky |
| **Vitest** | Testing | Runs `*.test.jsx` files |

---

## 2. How to run the project

Open terminal in this folder, then:

```bash
npm install      # download all dependencies (only first time)
npm run dev      # start the dev server → http://localhost:5173
npm run build    # build for production
npm run test     # run tests
npm run lint     # check code style
```

---

## 3. Folder map (what is where)

```
frontend-user/
├── public/             # static files (favicon, etc.)
├── src/                # 🌟 ALL YOUR CODE LIVES HERE
│   ├── main.jsx        # the very first file React runs
│   ├── App.jsx         # wraps everything (providers + router)
│   ├── index.css       # global styles + design tokens
│   │
│   ├── app/            # app-wide stuff (auth, theme, router)
│   ├── assets/         # images, fonts
│   ├── invitation/     # the public wedding invitation page
│   ├── pages/          # full pages (Login, Dashboard, Home...)
│   └── shared/         # reusable code (api, hooks, ui, layout...)
│
├── package.json        # list of dependencies + scripts
├── vite.config.js      # Vite config
├── tailwind.config.js  # Tailwind config
├── vitest.config.js    # Test config
└── eslint.config.js    # Lint rules
```

Every folder has its own `LEARN.md` that explains the files inside. Open them one by one!

---

## 4. The big picture: how a click becomes a screen

When the user opens the browser:

1. **`index.html`** loads → it has `<div id="root">`.
2. **`src/main.jsx`** runs → it tells React to put `<App />` inside `<div id="root">`.
3. **`src/App.jsx`** wraps the app with **providers** (auth, theme, motion).
4. Inside `App.jsx` it renders **`<AppRouter />`** (from `src/app/router.jsx`).
5. The router looks at the URL and shows the matching page.
6. The page reads data from `shared/services/*.js` (which call the backend).
7. UI components from `shared/ui` (Button, Spinner, Toaster, ...) render on screen.

Picture:

```
URL → Router → Layout (Shell) → Page → Components → API
```

---

## 5. Where to start reading?

Read in this order — each step builds on the previous one:

1. `src/LEARN.md` — what is in `src/`
2. `src/app/LEARN.md` — providers and router
3. `src/shared/api/LEARN.md` — how we talk to the backend
4. `src/shared/services/LEARN.md` — service functions (login, getEvents...)
5. `src/shared/ui/LEARN.md` — small reusable components
6. `src/shared/layout/LEARN.md` — Header, Aside, Shells
7. `src/pages/LEARN.md` — full pages
8. `src/invitation/LEARN.md` — public wedding invitation

Take your time. Code is like Lego — once you see the small pieces, you can read big files easily.

---

## 6. Vocabulary (must-know words)

| Word | Meaning |
|---|---|
| **Component** | A function that returns JSX (HTML in JS). Example: `<Button />` |
| **Props** | Inputs to a component, like function arguments |
| **State** | Data the component remembers, made with `useState` |
| **Hook** | A function starting with `use...` (like `useState`, `useEffect`) |
| **JSX** | The `<div>...</div>` syntax mixed with JS |
| **Provider** | A component that shares data with everything inside it (Context API) |
| **Route** | One URL path like `/login` |
| **Lazy load** | Load a page only when needed → faster startup |

---

## 7. Quick tips when you read code

- A line starting with `import ...` brings in code from another file.
- A line starting with `export ...` lets other files use this code.
- `const Foo = () => { ... }` is a function (also called a component when it returns JSX).
- `useState(0)` creates a memory slot starting with `0`.
- `useEffect(() => {...}, [x])` runs code when `x` changes.

Next: open **`src/LEARN.md`** ▶


---

## 8. Map of all teaching files

You will find a `LEARN.md` in every folder that has code:

```
LEARN.md                                  ← (this file) start here
public/LEARN.md
src/LEARN.md
  ├── app/LEARN.md
  │     ├── auth/LEARN.md
  │     └── theme/LEARN.md
  ├── assets/LEARN.md
  ├── components/LEARN.md
  ├── invitation/LEARN.md
  │     ├── pages/LEARN.md
  │     └── templates/LEARN.md
  │           ├── Classic/LEARN.md
  │           ├── Modern/LEARN.md
  │           ├── Luxury/LEARN.md
  │           └── Floral/LEARN.md
  ├── pages/LEARN.md
  │     ├── auth/LEARN.md
  │     ├── host/LEARN.md
  │     └── marketing/LEARN.md
  └── shared/LEARN.md
        ├── api/LEARN.md
        ├── hooks/LEARN.md
        ├── layout/LEARN.md
        ├── motion/LEARN.md
        ├── services/LEARN.md
        └── ui/LEARN.md
```

Read in this order:

1. `LEARN.md` (this file)
2. `src/LEARN.md`
3. `src/app/LEARN.md` → `auth/` → `theme/`
4. `src/shared/LEARN.md` → `api/` → `services/` → `motion/` → `hooks/` → `ui/` → `layout/`
5. `src/pages/LEARN.md` → `auth/` → `marketing/` → `host/`
6. `src/invitation/LEARN.md` → `pages/` → `templates/` → each design

---

## 9. Common React idioms cheat-sheet

```jsx
// State
const [count, setCount] = useState(0);
setCount(count + 1);                   // bad in some cases
setCount((prev) => prev + 1);          // ✅ safer when you depend on previous value

// Effect (side effect after render)
useEffect(() => {
  console.log("mounted or x changed");
  return () => console.log("cleanup");  // run before unmount or before next effect
}, [x]);

// Ref (persistent value, no re-render)
const ref = useRef(null);
ref.current = "hello";

// Memoize a function
const stableFn = useCallback(() => doSomething(x), [x]);

// Memoize a value
const expensive = useMemo(() => slowMath(x), [x]);

// Read context
const { user } = useAuth();

// Render a list
{items.map((item) => <Item key={item.id} item={item} />)}

// Conditional render
{loading ? <Spinner /> : <Content />}
{showHeader && <Header />}

// Form input
<input value={x} onChange={(e) => setX(e.target.value)} />

// Navigate from code
const navigate = useNavigate();
navigate("/login");
```

That covers 90% of the React you will see in this project.

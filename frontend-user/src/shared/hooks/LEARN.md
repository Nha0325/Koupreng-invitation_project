# 📘 LEARN — `src/shared/hooks/`

A **custom hook** is a function whose name starts with `use` and that calls other hooks (`useState`, `useEffect`, ...). It lets you package reusable logic.

Rules:
1. Name must start with `use`.
2. Only call hooks at the top level — never inside `if/for`.
3. Only call hooks from React components or other hooks.

Files in this folder:

| File | What it does |
|---|---|
| `useToggle.js` | Boolean on/off (e.g. show password) |
| `useImageSlider.js` | Auto-advance an image slider index |
| `useLenis.js` | Init smooth scroll, cleanup on unmount |
| `usePrefersReducedMotion.js` | Watch OS "reduce motion" setting |
| `useEvents.js` | Fetch + create + update + delete events (state hook) |
| `useDashboardData.js` | Static dashboard data + a small `useState` filter |
| `useHeroAnimation.js` | Empty placeholder (legacy hero animation) |

---

## 1. `useToggle` — the simplest hook

```js
export function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  const toggle = () => setValue((v) => !v);
  return [value, toggle];
}
```

Use it like the built-in `useState`:

```jsx
const [showPassword, togglePassword] = useToggle();
<button onClick={togglePassword}>👁️</button>
```

---

## 2. `useImageSlider` — auto-advance index

```js
export function useImageSlider(totalImages, interval = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (totalImages <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalImages);
    }, interval);
    return () => clearInterval(timer);   // cleanup!
  }, [totalImages, interval]);

  return { currentIndex };
}
```

Key ideas:
- `setInterval` runs the callback every `interval` ms.
- The cleanup function (`return () => clearInterval(timer)`) prevents a memory leak.
- `prev + 1) % totalImages` loops 0 → 1 → 2 → 0 → ...

---

## 3. `useLenis` — third-party lib lifecycle

```js
useEffect(() => {
  const lenis = new Lenis({ autoRaf: true });
  return () => lenis.destroy();
}, []);
```

Pattern: `new` the library on mount, `destroy` on unmount. Empty `[]` means "run once".

---

## 4. `usePrefersReducedMotion` — listen to OS setting

```js
useEffect(() => {
  const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handleChange = (event) => setPrefersReducedMotion(event.matches);
  mql.addEventListener("change", handleChange);
  return () => mql.removeEventListener("change", handleChange);
}, []);
```

Browser `matchMedia` returns a "media query list" object. We listen for changes and update state. Used by `App.jsx` to pass `transition: { duration: 0 }` to Framer Motion when needed.

Defensive code:
```js
if (typeof window === "undefined") return false;
```
This protects against environments without a `window` (server-side rendering, old test setups).

---

## 5. `useEvents` — full CRUD hook

This hook manages a **list of events** with loading / error state and CRUD actions:

```js
const { events, loading, error, fetchEvents, addEvent, modifyEvent, removeEvent } = useEvents();
```

Key parts:
- `useState` for `events`, `loading`, `error`.
- `useCallback` so the function references stay stable across renders. Stable refs prevent useless re-renders in children that depend on these functions.
- Each method is `async`, sets `loading` true, then false in `finally`.
- On success, it updates the local list with `setEvents((prev) => ...)`.
- On error, it stores the message in `error`.

Pattern you will see again and again.

---

## 6. `useDashboardData` — data + tiny hook

This file is mostly **static data** (mock summary cards, guests, segments, chart data). At the bottom there is a tiny hook:

```js
export function useAnalyticsFilter() {
  const [activeFilter, setActiveFilter] = useState("all");
  return { activeFilter, setActiveFilter };
}
```

Just remembers a filter value. It is exported as a hook so consuming pages can import only what they need.

---

## TL;DR

- Hooks let you **share logic** between components.
- Always clean up timers / listeners in the `useEffect` return function.
- `useCallback` stabilizes functions so children don't re-render uselessly.

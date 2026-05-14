# 📘 LEARN — `src/shared/ui/`

This folder is the **design system**: small, reusable UI primitives. Each is one component (sometimes with a CSS file).

| File | What it is |
|---|---|
| `Button.jsx` | Universal button (link, anchor, button) with variants |
| `GlassCard.jsx` | Glassmorphism card wrapper |
| `Spinner.jsx` | Accessible loading circle |
| `SectionHeading.jsx` | Editorial section heading (eyebrow / title / subtitle) |
| `ScrollReveal.jsx` | Animate children when they scroll into view |
| `PageTransition.jsx` | Fade + slide on route change |
| `Toaster.jsx` | Toast notification system |
| `TimePicker.jsx` + `.css` | Khmer time picker (hour / minute / period) |

---

## 1. `Button.jsx` — variants + sizes + loading

The big idea: **one component**, many "shapes".

Props:

| Prop | What it does |
|---|---|
| `variant` | `'primary' \| 'ghost' \| 'outline'` |
| `size` | `'sm' \| 'md' \| 'lg'` |
| `loading` | shows `<Spinner />` and disables click |
| `to` | if set, renders `<Link>` (react-router) |
| `href` | if set, renders `<a>` |
| else | renders `<button>` |

Why three render branches? Because the **right HTML element** matters for accessibility and keyboard navigation. A button-styled `<a>` to another page is correct as `<a>`, not `<button onClick>`.

```jsx
if (to && !isDisabled) return <Link to={to} ...>{inner}</Link>;
if (href && !isDisabled) return <a href={href} ...>{inner}</a>;
return <motion.button ...>{inner}</motion.button>;
```

Press feedback uses Framer Motion `whileTap={{ scale: 0.97 }}`.

---

## 2. `GlassCard.jsx` — glassmorphism

Tiny — 15 lines. Just wraps children in `<div class="glass">`. The actual blurred-glass look is defined in `index.css` as `.glass { ... }`. Use it everywhere you need a frosted card.

```jsx
<GlassCard>
  <h3>Title</h3>
  <p>Some content</p>
</GlassCard>
```

---

## 3. `Spinner.jsx` — accessible loader

Pure-CSS spinner with:
- `role="status"` and `aria-live="polite"` so screen readers announce loading.
- `aria-label="Loading"` (overridable).
- Inline `<style>` tag with `@keyframes koupreng-spin` for the rotation.
- Reduced-motion media query slows it down for users who prefer it.

The spinner is used in `<RequireAuth />` (auth loading) and `<TemplateRenderer />` (invitation loading).

---

## 4. `SectionHeading.jsx` — editorial heading

Three optional pieces stacked vertically:
1. **Eyebrow** — small uppercase tag above the title
2. **Title** — large display font
3. **Subtitle** — supporting copy

Plus a thin gold-tone divider line in the middle. Used by invitation sections (Schedule, Gallery, RSVP) and host sections.

---

## 5. `ScrollReveal.jsx` — animate on scroll into view

```jsx
<ScrollReveal delay={0.2}>
  <h2>Hello</h2>
</ScrollReveal>
```

Internals:
- `useRef` to point at the wrapper.
- `useInView(ref, { once, margin, amount })` from Framer Motion → `true` when scrolled into view.
- Toggle the variant between `"hidden"` and `"visible"`.

By default `once = false` so re-entering scrolls plays the animation again. Pass `once={true}` for fire-once behavior.

---

## 6. `PageTransition.jsx` — fade between pages

Wraps a route's content in a `motion.div` with `initial`, `animate`, `exit` so changing routes cross-fades. Used inside each Shell.

```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.4 }}
>
```

---

## 7. `Toaster.jsx` — popup notifications

Two ways to use it:

### a) From inside React tree:
```jsx
import { useToast } from "../shared/ui/Toaster";
const { push } = useToast();
push("Saved!", { variant: "success" });
```

### b) From anywhere (services, event handlers):
```jsx
import { toast } from "../shared/ui/Toaster";
toast("Network error", { variant: "error" });
```

How the second one works: `toast()` dispatches a `CustomEvent` on `window`. The `<Toaster />` component listens for it. This **decouples** the call site from the React tree.

State managed inside `<Toaster />`:
- `toasts` array (max 4 visible).
- A `Map` of timers so we can cancel them when toasts are dismissed early.
- Cleanup of all timers on unmount.

Animation uses `<AnimatePresence>` from Framer Motion so toasts animate in **and out**.

---

## 8. `TimePicker.jsx` — Khmer time picker

A custom `<select>`-like dropdown for hour / minute / morning-evening (ព្រឹក / ល្ងាច). Three pieces:

1. **Trigger button** with the clock icon and current value.
2. **Dropdown** with three `<select>`s.
3. **Confirm / Cancel** buttons.

Tricks:
- Outside-click closes the dropdown:
  ```js
  const handler = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  };
  document.addEventListener("mousedown", handler);
  ```
- Converts 12-hour + period back to 24-hour `"HH:MM"` for the parent's `value`.

---

## TL;DR

- `Button` → all click targets in the app.
- `GlassCard` → frosted card.
- `Spinner` → loaders with screen-reader support.
- `SectionHeading` → consistent section titles.
- `ScrollReveal` → animate when scrolled into view.
- `PageTransition` → fade between pages.
- `Toaster` → popup notifications, callable from anywhere.
- `TimePicker` → custom Khmer time picker.

These are your Lego bricks. Pages mostly just glue them together.

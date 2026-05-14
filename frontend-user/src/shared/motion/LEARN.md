# 📘 LEARN — `src/shared/motion/`

This folder has **animation presets** for Framer Motion. Only one file:

| File | Job |
|---|---|
| `variants.js` | Reusable `variants` objects |

---

## 1. What is a Framer Motion "variant"?

A variant is a **named group of animation states**. Example:

```js
const fadeUp = {
  hidden:  { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
  },
};
```

It says: when state is `hidden`, fade out + 32px down. When state is `visible`, full opacity + at original position.

Then in JSX:

```jsx
<motion.div variants={fadeUp} initial="hidden" animate="visible">
  Hello
</motion.div>
```

The component animates between the two states automatically.

---

## 2. The 4 variants in this file

### `fadeUp`
Standard "fade in from below". The `ease: [0.22, 1, 0.36, 1]` is a fancy cubic-bezier curve — feels expensive and smooth.

### `stagger(gap)` — a factory
```js
export const stagger = (gap = 0.08) => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap } },
});
```
Passed to a parent `motion.div`. When the parent goes to `visible`, it triggers each child's `visible` state with a delay of `gap` between them. So 5 cards animate one after another instead of all together.

### `heroNames`
Special version for the hero couple names — it animates `letterSpacing` from wide to tight, plus opacity and Y. Looks cinematic.

### `scrollCue`
A **looping** animation. `repeat: Infinity` means it never stops. It bobs the scroll arrow up and down forever.

---

## 3. Why a separate file?

Two reasons:
1. Animations are easier to tune in one place.
2. Multiple components use the same `fadeUp` and stay visually consistent.

---

## TL;DR

- A variant = named animation states.
- `motion.div variants={fadeUp} initial="hidden" animate="visible"` runs it.
- `stagger(gap)` is a factory: call it to get a parent variant that delays its children.
- This file is the **design language** of motion in the app.

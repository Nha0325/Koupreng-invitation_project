# 📘 LEARN — `src/pages/marketing/`

The public-facing marketing pages.

| File | Route | Job |
|---|---|---|
| `HomePage.jsx` + `.css` | `/` | Hero + Testimonials + Pricing + FAQ + Footer |
| `NotFoundPage.jsx` | `*` (catch-all) | Simple 404 message |

---

## 1. `HomePage.jsx` — anatomy

Top to bottom:
1. **Hero section** — headline, CTA, animated image slider, floating chips.
2. **Testimonials** — two scrolling marquees (left / right).
3. **Pricing** — three plan cards (Free / Pro / Enterprise).
4. **Trust bar** — 5 small badges.
5. **FAQ** — collapsible questions.
6. **Footer** — links + socials.

It is a long file. Don't memorize it — read top to bottom and you will recognize the pattern: each section is wrapped in `<ScrollReveal>` so it fades up as you scroll.

### Key blocks

#### Image slider with auto-rotate
```js
const { currentIndex } = useImageSlider(heroImages.length, 3000);
```
Then for each image:
```jsx
<img src={img} style={{ opacity: currentIndex === i ? 1 : 0 }} />
```
Only one is fully opaque at a time — others fade out.

#### Animation entrance per side
```jsx
<motion.div
  initial={{ opacity: 0, x: -60 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: false, amount: 0.2 }}
  transition={{ duration: 0.8, delay: 0.1 }}
>
```
- `whileInView` runs the animation when scrolled into view.
- `viewport.once: false` lets it replay every time you scroll back.
- `amount: 0.2` — trigger when 20% visible.

#### Stagger across pricing cards
```jsx
<motion.div variants={staggerContainer} initial="hidden" whileInView="visible">
  {plans.map(plan => (
    <motion.div variants={fadeUp}>
      <GlassCard>...</GlassCard>
    </motion.div>
  ))}
</motion.div>
```
Container's `staggerContainer = stagger(0.1)` (from `shared/motion/variants.js`). Each child gets `variants={fadeUp}`. Result: cards animate one after another.

#### FAQ collapsible
```jsx
<div style={{
  display: "grid",
  gridTemplateRows: open ? "1fr" : "0fr",
  transition: "grid-template-rows 0.35s ease",
}}>
  <div style={{ overflow: "hidden" }}>
    <p>{a}</p>
  </div>
</div>
```
**Trick**: animating `grid-template-rows` from `0fr` to `1fr` smoothly reveals the answer without measuring its height. Modern CSS magic.

---

## 2. `NotFoundPage.jsx`

10 lines: a "404" heading and a link back home. Used by the catch-all `*` route inside `<MarketingShell />`.

---

## 3. The data lives in the same file

You will notice big arrays at the top of `HomePage.jsx`:

```js
const testimonials = [...];
const plans = [...];
const faqs = [...];
```

Real apps usually move this to a CMS or JSON file. For now it is fine — easier to edit when learning.

---

## TL;DR

- HomePage is a long marketing scroll: Hero → Testimonials → Pricing → FAQ → Footer.
- Animation uses `<ScrollReveal>` and `motion.div` with `whileInView`.
- Stagger pattern: parent variant + child variant + `motion.div` per child.
- FAQ uses the `grid-template-rows: 0fr → 1fr` CSS trick to animate height.

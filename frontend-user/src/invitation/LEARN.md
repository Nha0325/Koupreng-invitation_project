# 📘 LEARN — `src/invitation/`

The **public wedding invitation** page. No login, no chrome. It is the actual product the guests see.

| File / Folder | Job |
|---|---|
| `TemplateRenderer.jsx` | Picks the right template based on `event.template` |
| `pages/InvitationPage.jsx` | Route page at `/i/:slug` — fetches event + renders template |
| `templates/` | One folder per design (Classic, Modern, Luxury, Floral) |

---

## 1. The big idea: **template registry**

The invitation engine works like this:

```
URL /i/panha-lyly
   ↓
InvitationPage reads slug, fetches event → event.template = "classic"
   ↓
TemplateRenderer looks up `templates["classic"]` → ClassicTemplate
   ↓
ClassicTemplate(data=event) renders the page
```

The registry in `TemplateRenderer.jsx`:

```js
const templates = {
  classic: ClassicTemplate,
  modern:  ModernTemplate,
  luxury:  LuxuryTemplate,
  floral:  FloralTemplate,
};
```

Adding a new design = create `templates/MyDesign/MyDesignTemplate.jsx` + add one entry to the registry. Done.

---

## 2. Why lazy-load each template?

```js
const ClassicTemplate = lazy(() => import("./templates/Classic/ClassicTemplate"));
```

Because each template is heavy (custom CSS, animations, images). A guest who opens a "Modern" invitation should not download the "Floral" code. Lazy load = smaller bundle = faster load.

`<Suspense fallback={<Loader2 spin />}>` shows a spinner while the chunk downloads.

---

## 3. `InvitationPage.jsx` — the route page

State machine:
```
loading ─┬─→ event loaded → render <TemplateRenderer event={event} />
         ├─→ error → show error message
         └─→ no event → "Invitation not found"
```

Key React hook:

```js
const { slug } = useParams();
useEffect(() => {
  fetchEvent();
}, [slug]);
```

`useParams()` reads `:slug` from the URL. The effect re-runs if `slug` changes.

Right now the fetch is **mocked inline** (TODO: replace with `eventService.getBySlug(slug)`). The shape of the mock matches what templates expect: `{ groomName, brideName, date, location, story, schedule, ... }`.

---

## 4. The templates — same data, different visuals

Each template is a single component receiving `data`:

```jsx
export default function ClassicTemplate({ data }) {
  return (
    <div>
      <h1>{data.groomName} & {data.brideName}</h1>
      <p>{data.date}</p>
      <p>{data.location}</p>
      ...
    </div>
  );
}
```

**Same data shape** across all templates so the registry can swap them with no glue code. This is the contract: every template must accept `data` with the same fields.

### `ClassicTemplate` — elegant serif
Centered text, simple sections, minimal styling.

### `ModernTemplate` — bold sans-serif
Hero with names, white cards on gray background, schedule in a list.

### `LuxuryTemplate` and `FloralTemplate`
Same pattern with different visual flavor.

---

## 5. Why no `<Header>` or `<Aside>`?

The design rule: **the public invitation never imports from the host tree**. Reason: the invitation must work even if the host providers (auth, theme) fail. Guests should never see a logged-in chrome. So:

- It uses `<InvitationShell />` which has no chrome.
- Templates render full-bleed (`min-h-screen`).
- No `useAuth()`, no `<Header />`.

---

## 6. How to add a new template

1. Create `templates/Boho/BohoTemplate.jsx`:
   ```jsx
   export default function BohoTemplate({ data }) {
     return <div>...</div>;
   }
   ```
2. Add it to the registry in `TemplateRenderer.jsx`:
   ```js
   const BohoTemplate = lazy(() => import("./templates/Boho/BohoTemplate"));
   const templates = { classic: ..., boho: BohoTemplate, ... };
   ```
3. Set `event.template = "boho"` in the event data.

---

## TL;DR

- Public invitation = `/i/:slug` → fetch event by slug → render the matching template from a registry.
- Templates are lazy-loaded.
- All templates share the same `data` shape.
- The page stays isolated from the host app: no auth, no header, no shared state.

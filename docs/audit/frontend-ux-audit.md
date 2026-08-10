# Frontend product UX and visual quality audit

**Audit date:** 2026-08-10

**Surfaces:** host dashboard, admin console, public invitation, responsive browser layouts
**Design governance:** `STYLESEED.md` -> `.styleseed/effective-rules.md`

## Product identity

Koupreng's strongest differentiator is a Khmer-first wedding product with warm editorial invitation surfaces and a practical host operations dashboard. That identity should be preserved. The dashboard is not meant to look like the ceremonial invitation itself: its job is calm, dense event operations with restrained gold/teal accents, reliable tables/forms, Khmer-safe typography, and clear backend state.

The compiled StyleSeed context for this pass is:

- output grammar: `operations-console`
- surface adapter: `product-ui`
- domain: `productivity`
- page type: `list`
- brand lock: cream/gold/teal, Khmer-first copy, current sidebar/header shell
- layout: 8px rhythm, content width near 1180px, one primary action, white operational surfaces on warm neutral canvas

The invitation renderer's established ceremonial layouts, decorative assets, music behavior, and `/w/:slug` / `/i/:slug` parity remain outside dashboard restyling.

## Journey audit

| Journey | Current UX | Risk | Recommendation |
| --- | --- | --- | --- |
| Discover template -> preview -> checkout | Clear and visually strong; entitlement remains backend-driven | Provider return/callback cannot be proven locally | Run real staging PayWay/static QR journeys and preserve order code during recovery |
| Create local wedding draft | Fast and resilient in one browser | “Draft” can be mistaken for cloud-saved work | Label local-only state, show last-saved location/time, offer explicit account save |
| Manage invitations | Strong CRUD/status skeleton | Event and invitation concepts overlap | Choose one user-facing source of truth and normalize terminology |
| Manage guests | Modular desktop table + mobile cards, now truthful about RSVP and delivery state | Local/server authority had been ambiguous | Keep server banner/provenance visible; add file import/export UI and conflict feedback |
| RSVP/public invitation | High-value public flow with Khmer identity | Host correction/delete flow incomplete; abuse/live-device coverage needed | Add owner mutation UI and staging rate-limit/access-token tests |
| Check-in | Manual and token entry support | No camera-scanner/operator mode; roles imply more than backend permits | Create a focused operator layout only after backend permission contract exists |
| Seating | Useful plan and assignment workflow | Concurrent capacity and bulk assignment are underspecified | Add conflict-safe backend contract, then multi-select/bulk UX |
| Organizations | Reachable list/detail/member workflow | Missing context previously exposed controls; role meaning incomplete | Fail closed now; later render backend-provided effective permissions |
| AI helper | Composer/result/editor flow exists | Local template was mislabeled as AI and Apply did not persist | Fixed disclosure and `storyText`; keep feature marked experimental until provider exists |
| Dashboard | Broad operational overview | Partial failures can appear as zero activity | Per-widget unavailable/retry states and freshness timestamps |
| Admin | Broad management and reporting surface | Separate deploy paths are easily documented incorrectly | Keep canonical route constants and verify deployed base path in smoke tests |

## Hierarchy and interaction findings

### What works

- Khmer and English fonts are centralized and broadly consistent.
- The host navigation has recognizable sections and canonical dashboard destinations.
- Guest data switches from a table to cards on smaller viewports.
- Shared primitives exist for forms, responsive tables, skeletons, empty states, confirmations, status badges, and toasts.
- Public invitation content has a product-specific visual voice instead of a generic SaaS aesthetic.
- Payment entitlement is based on backend status/access checks rather than URL success flags.

### Material issues

#### 1. Truthful state provenance

The most important UX issue is not color or spacing; it is whether a number or record is truly saved. Persisted invitation domains must show backend data, local drafts must say they are local, and unavailable data must never masquerade as zero. The guest and AI changes in this pass establish that pattern, but dashboard widgets still need it.

#### 2. Route/context clarity

Invitation-scoped pages should always include the invitation identity in the header/breadcrumb and use the same `invitationId` route contract. Global `/dashboard/guests`, `/dashboard/expenses`, and `/dashboard/gifts` may select an active context, but must show which event is active before any mutation.

#### 3. Role clarity

Organization labels such as manager, designer, and check-in staff should not promise access the backend does not enforce. Controls now fail closed in missing ownership context; next, role descriptions should be derived from effective permission data.

#### 4. Feedback consistency

Some older pages still mix shared toasts/modals with bespoke inline banners and browser-native confirmation. Consolidate when those pages are next changed, preserving focus return, Escape behavior, destructive confirmation, and screen-reader announcements.

#### 5. Large-page maintainability

`DashboardFeature.jsx` and several feature CSS files are large enough that local changes can cause remote visual regressions. Continue vertical-slice extraction by domain/state boundary, not cosmetic component fragmentation.

## Accessibility audit

| Area | Finding | Priority |
| --- | --- | --- |
| Keyboard/focus | Shared modal primitives exist, but bespoke overlays need focus trap/return audits | HIGH |
| Status semantics | Delivery and RSVP state are now text plus badges, not color alone | FIXED IN GUEST SLICE |
| AI notices | Fallback source is `role=status`; backend warnings use `role=alert` | FIXED |
| Icon buttons | Guest row actions now have explicit accessible labels | FIXED IN GUEST SLICE |
| Khmer text | Long labels need generous line-height and wrapping at 320–375px | MEDIUM |
| Form errors | Several pages use top-level errors without field association or focus movement | MEDIUM |
| Reduced motion | Invitation animations should retain `prefers-reduced-motion` coverage as templates evolve | MEDIUM |
| Contrast | Operational pages should use semantic token combinations; avoid low-opacity custom accent text | MEDIUM |
| Tables | Responsive table/card alternatives exist; verify header association and action naming per feature | MEDIUM |

## Responsive audit targets

| Viewport | Required behavior |
| --- | --- |
| 320–375px | No horizontal document overflow; Khmer labels wrap without clipped marks; action buttons remain at least 44px high; card representation replaces dense data table where needed |
| 768px | Navigation collapse state remains reversible; two-column forms collapse in a logical reading order |
| 1280–1440px | Dashboard content stays within the governed max width; tables use available width without excessive empty gutters |
| public invitation mobile | Opening, music, gallery, RSVP, and anchor navigation remain usable after any dashboard work |

## Canonical navigation

| Canonical | Legacy aliases retained as redirects |
| --- | --- |
| `/dashboard/events` | `/events`, `/event/list` |
| `/dashboard/guests` | `/guests` |
| `/dashboard/expenses` | `/expenses` |
| `/dashboard/gifts` | `/gift`, `/gifts` |
| `/dashboard/profile` | `/profile` |

Invitation pages use `/dashboard/invitations/:invitationId/{guests|rsvp|budget|check-in|seating|assistant}` when the page consumes `invitationId`; edit, preview, media, and delivery retain `:id` where their components consume `id`.

## Payment UX state machine

The frontend treats `PAID`, `FAILED`, `CANCELLED`, `EXPIRED`, and `REJECTED` as terminal. It continues polling QR/payment status for other states, including current backend values such as `PENDING`, `QR_CREATED`, `CHECKOUT_CREATED`, and `PAID_PENDING_REVIEW`. Compatibility copy also exists for `CREATED` and `CONFIRMED`, but those are not assumed to be emitted by the current backend.

- A success/return page must fetch the server order and entitlement.
- A query parameter must never grant template access.
- `PAID_PENDING_REVIEW` must not be described as paid entitlement.
- Expiry/cancellation should keep the order code visible and offer a deliberate retry.
- Receipt/history errors must distinguish missing order, unauthorized order, and unavailable service.

## Performance audit

- Route modules are largely eager-loaded; heavy dashboard and template paths remain candidates for route-level lazy loading.
- Existing template and feature stylesheets are large; split only at stable route/domain boundaries.
- Media-heavy invitation assets should keep lazy decoding/loading and responsive sources where supported.
- Vite bundle warnings and actual chunk composition must be reviewed after the production build; do not optimize on file size alone.
- Avoid loading administrative or host-only modules into public invitation entry chunks.

## StyleSeed scorecard

The score below was assigned after the production build, Playwright browser matrix, and direct inspection of the changed guest and AI surfaces at desktop and Pixel-class mobile viewports.

| Category | Weight | Score | Evidence |
| --- | ---: | ---: | --- |
| Hierarchy and typography | 16 | 14 | Khmer-first headings remain readable; operational density is clear without mimicking the ceremonial invitation |
| Layout and spacing | 16 | 14 | 8px rhythm, compact KPI hierarchy, desktop table, and mobile guest cards render cleanly |
| Color and tokens | 14 | 12 | restrained gold/teal semantics and AI notice tokens are coherent; legacy feature CSS still contains local hard-coded values |
| Components and states | 16 | 15 | loading/error/empty behavior plus explicit RSVP, delivery, server, local-template, and provider-warning states |
| Accessibility | 16 | 14 | icon actions have labels, status is not color-only, notices use semantics, and mobile actions meet the 44px target; bespoke legacy overlays remain an audit item |
| Responsive behavior | 12 | 11 | desktop table switches to reachable mobile cards; AI composer/result collapses to one column with no horizontal overflow |
| Product coherence/distinctiveness | 10 | 9 | Khmer wedding identity is preserved while host operations remain calm, practical, and visually separate |
| **Total** | **100** | **89 — PASS** | Minimum required score: 80 |

## Visual verification record

| Surface | Desktop | Mobile | Result |
| --- | --- | --- | --- |
| Authenticated guest list with backend guest + RSVP state | Inspected at 1440 x 900 | Inspected at Pixel 7 viewport | PASS — table/card switch, hierarchy, badges, controls, and overflow |
| AI local-template/provider-warning result | Inspected at 1440 x 900 | Inspected at Pixel 7 viewport | PASS — two-column/one-column layouts, truthful source notice, warnings, edit/apply actions, and overflow |
| Public invitation regression smoke | Browser route smoke passed | Browser route smoke passed | PASS — unchanged surface; `/i/:slug` route rendered in both projects and unavailable state remained graceful |

The guest and AI screenshots were produced by `tests/e2e/critical-routes.spec.js` under Playwright's per-test `test-results` output and visually inspected after each responsive correction. The final browser run passed 56/56 tests. The stitched full-page mobile capture can repeat a fixed navigation rail in the composite image; viewport interaction and horizontal-overflow checks were evaluated against the live page, not that stitching artifact.

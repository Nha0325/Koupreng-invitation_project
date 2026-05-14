# Implementation Plan: Wedding Invitation Experience

## Overview

Convert the feature design into a series of prompts for a code-generation LLM that will implement each step with incremental progress. Make sure that each prompt builds on the previous prompts, and ends with wiring things together. There should be no hanging or orphaned code that isn't integrated into a previous step. Focus ONLY on tasks that involve writing, modifying, or testing code.

The plan rebuilds `frontend-user/` (React 19 + Vite + Tailwind v4 + Framer Motion + JSX) into a two-audience SPA: a Host App for couples and a Public Invitation App for guests. Implementation language is JavaScript (JSX) as established in the design.

> **Note on requirements.md**: The spec's `requirements.md` is empty at the time of task generation, so task `_Requirements:_` annotations cite the design document's section headings (e.g. _Correctness Properties → Countdown invariants_) and the property numbering used in the PBT tasks below. When `requirements.md` is filled in, replace these references with the granular requirement numbers.

### Property Numbering (from design "Correctness Properties")

- **P1** — `computeCountdown` lexicographic monotonicity (Countdown invariants)
- **P2** — `computeCountdown` totality + bounded ranges (Countdown invariants)
- **P3** — RSVP `partySize` clamping & note-length bounds (RSVP validation)
- **P4** — Slug validator regex `^[a-z0-9-]{3,80}$` (Data Models → EventModel)
- **P5** — `pickTemplate` fallback safety (Algorithm: Template Selection)

## Tasks

- [ ] 1. Project safety net and cleanup
  - [x] 1.1 Verify baseline build is green
    - Run `npm run lint` and `npm run build` in `frontend-user/`
    - Capture and fix any pre-existing lint errors before refactoring begins
    - _Requirements: Migration Plan → Phase 0_

  - [x] 1.2 Install Vitest + React Testing Library + fast-check
    - Add devDependencies: `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `fast-check`
    - Add `test` and `test:run` scripts in `package.json` (use `vitest --run` for CI)
    - Create `vitest.config.js` with `jsdom` env, globals, and a `setup.js` that imports `@testing-library/jest-dom`
    - _Requirements: Testing Strategy → Unit / Property-Based_

  - [x] 1.3 Install Swiper, remove unused deps
    - `npm i swiper`
    - `npm un animejs @splinetool/react-spline @splinetool/runtime`
    - _Requirements: Dependencies_

  - [x] 1.4 Delete duplicate / dead-code files
    - Remove `src/context/`, `src/services/`, `src/features/`, `src/templates/`, every `read.md`, `src/assets/style/output.css`, `src/assets/style/input.css`, `src/shared/utils/`, `src/invitation/components/`, and the empty `src/invitation/sections/` directory
    - Move feature-folder PNGs out of `src/features/**` (these get deleted with the folders)
    - Run `npm run build` to confirm nothing imported the removed paths
    - _Requirements: File Migration List → Delete_

- [ ] 2. Design tokens, fonts, and motion config
  - [x] 2.1 Add design tokens and `.glass` utility to `src/index.css`
    - Add `:root` brand / surface / text / romantic / typography / motion / shape / glass variables
    - Add `:root[data-theme="dark"]` overrides for surfaces and text
    - Add `.glass` utility class using `--glass-blur`, `--glass-bg`, `--glass-border`, `--glass-shadow`
    - _Requirements: Design Tokens & Theming_

  - [x] 2.2 Update font face imports in `src/assets/fonts/fonts.css`
    - Add `Cormorant Garamond`, `Great Vibes`, `DM Sans`, `Noto Serif Khmer`, `Noto Sans Khmer` with `font-display: swap`
    - Preconnect to font CDN in `index.html`
    - _Requirements: Performance Considerations → Fonts_

  - [x] 2.3 Create `src/shared/motion/variants.js`
    - Export `fadeUp`, `stagger(gap)`, `heroNames`, `scrollCue` per design
    - _Requirements: Framer Motion Patterns_

  - [x] 2.4 Wire `<MotionConfig>` and reduced-motion handling in `src/App.jsx`
    - Detect `prefers-reduced-motion: reduce` and override transitions to `{ duration: 0 }` via `MotionConfig`
    - _Requirements: Correctness Properties → Accessibility (reduced motion); Error Scenario 6_

- [ ] 3. Shared API client and services
  - [x] 3.1 Implement `src/shared/api/client.js`
    - Axios instance with `baseURL` from `VITE_API_URL` (default `http://localhost:8080/api`)
    - Request interceptor: attach `Authorization: Bearer <token>` from `localStorage.koupreng.token` unless `config.public === true`
    - Response interceptor: on 401 with auth header, clear token and `window.dispatchEvent(new Event('auth:expired'))`
    - _Requirements: API Integration_

  - [x] 3.2 Implement `src/shared/api/errors.js`
    - Define `ApiError` class with `{ code, message, status }`
    - Export a `parseError(err)` helper that maps Axios errors to `ApiError`
    - _Requirements: API Integration; Error Scenario 2_

  - [x] 3.3 Write unit tests for the API client
    - Mock axios; assert token attachment, `public: true` skip, and 401 dispatch behavior
    - _Requirements: API Integration; Error Scenario 4_

  - [-] 3.4 Implement service modules under `src/shared/services/`
    - `authService.js` (login, logout, register, forgotPassword, resetPassword, me, changePassword)
    - `userService.js` (getMe, updateMe)
    - `eventService.js` (list, getById, getBySlug, create, update, remove, uploadImage, uploadMusic) with a `MOCK = true` fallback for offline dev
    - `guestService.js` (list, getByToken) with mock fallback
    - `rsvpService.js` (submit) — sets `config.public = true`
    - _Requirements: API Integration → endpoint table_

- [ ] 4. Auth, theme, and route guards
  - [~] 4.1 Create `src/app/auth/AuthContext.jsx` and `useAuth.js`
    - State `{ user, token, status: 'loading'|'authenticated'|'unauthenticated', login, logout, refresh }`
    - On mount: read token from `localStorage`, hydrate via `userService.getMe`
    - Listen for the `auth:expired` window event and call `logout()`
    - _Requirements: State Management → AuthContext; Error Scenario 4_

  - [~] 4.2 Create `src/app/auth/RequireAuth.jsx`
    - While `status === 'loading'`, render `<Spinner />`
    - If `unauthenticated`, `<Navigate to={`/login?next=${encodedPath}`} replace />`
    - Else `<Outlet />`
    - _Requirements: Routing Map; Correctness Properties → Routing & guard invariants_

  - [~] 4.3 Create `src/app/theme/ThemeContext.jsx` and `useTheme.js`
    - `{ mode: 'light'|'dark', toggle }`, persist to `localStorage.koupreng.theme`, apply `data-theme` on `<html>`
    - _Requirements: State Management → ThemeContext_

  - [~] 4.4 Write unit tests for `RequireAuth`
    - Loading → spinner, unauthenticated → redirect with `?next=`, authenticated → renders outlet
    - _Requirements: Correctness Properties → Routing & guard invariants_

- [ ] 5. Shared UI primitives and layout shell
  - [~] 5.1 Create primitives in `src/shared/ui/`
    - `Spinner.jsx`, `SectionHeading.jsx`, `Toaster.jsx`
    - Rename + refactor: `MagicCard.jsx` → `GlassCard.jsx`, `AnimatedButton.jsx` → `Button.jsx`
    - Keep `PageTransition.jsx`, `ScrollReveal.jsx` (verify they import the new motion variants)
    - _Requirements: Shared UI table_

  - [~] 5.2 Create `src/shared/layout/HostShell.jsx`
    - Compose existing `Header.jsx` + `Aside.jsx` + scrollable `<main>` + `<Toaster />` slot
    - Wrap content in `<PageTransition>`
    - _Requirements: Component: HostShell_

- [ ] 6. Routing
  - [~] 6.1 Create `src/app/router.jsx`
    - Define every route from the Routing Map
    - Wrap `/app/*` in `<RequireAuth>` and `<HostShell>`
    - Wrap marketing/auth routes in a marketing shell (header only)
    - Wrap `/i/:slug` and `/invitation/:slug` in an InvitationShell (no chrome)
    - Use `React.lazy` for every page module
    - _Requirements: Routing Map_

  - [~] 6.2 Migrate page files to new locations
    - Move `pages/Dashboard/*Page.jsx` → `pages/host/*Page.jsx`
    - Move `pages/Events/*Page.jsx` → `pages/host/{EventsPage,CreateEventPage}.jsx`
    - Move `pages/Auth/*` → `pages/auth/{LoginPage,RegisterPage,ForgotPasswordPage,ResetPasswordPage}.jsx`
    - Move `pages/Home/HomePage.jsx` → `pages/marketing/HomePage.jsx`
    - Create `pages/marketing/NotFoundPage.jsx`
    - Update all imports
    - _Requirements: File Migration List → Keep / Create_

  - [~] 6.3 Update `src/main.jsx` and `src/App.jsx`
    - Mount the new router, `AuthProvider`, `ThemeProvider`, `MotionConfig`, and a global `Toaster`
    - _Requirements: Architecture → System Overview_

- [~] 7. Checkpoint — Build and lint pass with new shell
  - Run `npm run lint` and `npm run build` in `frontend-user/`
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: Migration Plan → Phase 3_

- [ ] 8. Pure logic hooks with property tests
  - [~] 8.1 Implement `src/shared/hooks/useCountdown.js`
    - Export both `computeCountdown(targetISO, nowMs)` (pure) and `useCountdown(targetISO)` (hook)
    - Hook schedules `setInterval(1000)` and clears it on unmount or when `targetISO` changes
    - Stops scheduling once `isPast === true`
    - _Requirements: Algorithm: Countdown Calculation; Key Functions → useCountdown_

  - [~] 8.2 Write property test for `computeCountdown` totality
    - **Property P2: Totality and bounded ranges**
    - For arbitrary `(targetISO, nowMs)` pairs, the result has `days >= 0`, `0 <= hours < 24`, `0 <= minutes < 60`, `0 <= seconds < 60`, and `isPast === (targetMs <= nowMs)`
    - **Validates: Correctness Properties → Countdown invariants (range bounds, isPast definition)**

  - [~] 8.3 Write property test for `computeCountdown` monotonicity
    - **Property P1: Lexicographic non-increase between ticks**
    - For arbitrary `now1 <= now2 <= target`, `(d, h, m, s)` at `now1` is lexicographically `>=` the tuple at `now2`
    - **Validates: Correctness Properties → Countdown invariants (monotonic between ticks)**

  - [~] 8.4 Write unit tests for `useCountdown` hook
    - Use `vi.useFakeTimers()`; assert tick countdown, cleanup on unmount, and final `{0,0,0,0,isPast:true}` state
    - _Requirements: Key Functions → useCountdown postconditions_

  - [~] 8.5 Implement `src/shared/hooks/useScroll.js`
    - Returns `{ scrollTo(id), progress }`; cooperates with Lenis when available
    - Clamps `progress` to `[0, 1]`
    - _Requirements: Algorithm: Smooth Scroll To Section; Key Functions → useScroll_

  - [~] 8.6 Implement `src/shared/hooks/useGuest.js`
    - `null` token → `{ guest: null, status: 'idle' }`
    - Otherwise call `guestService.getByToken` once, expose `loading|ready|error`
    - _Requirements: Key Functions → useGuest_

  - [~] 8.7 Implement `src/shared/hooks/useMusic.js`
    - State `{ isPlaying, isMuted, toggle, mute }`
    - Never play with sound until a user gesture; persist to `sessionStorage.koupreng.invitation.music`
    - Debounce rapid `toggle()` calls within one tick
    - _Requirements: Algorithm: Music Player Toggle; Key Functions → useMusic_

  - [~] 8.8 Write unit tests for `useMusic`
    - Mock `HTMLAudioElement.play` resolving and rejecting
    - Assert state transitions and `sessionStorage` writes
    - **Validates: Correctness Properties → Music player invariants (visible state matches audioEl.paused; persisted value ∈ {playing, paused})**

- [ ] 9. Slug validator and template selection
  - [~] 9.1 Implement `src/invitation/slug.js` with `isValidSlug(s)`
    - Returns `true` iff `/^[a-z0-9-]{3,80}$/.test(s)`
    - _Requirements: Data Models → EventModel validation; Correctness Properties → Routing_

  - [~] 9.2 Write property test for slug validator
    - **Property P4: Slug regex acceptance**
    - For arbitrary strings: `isValidSlug(s) === /^[a-z0-9-]{3,80}$/.test(s)`
    - Generate both inside-set strings (lowercase + digits + dash, length 3..80) and arbitrary unicode strings to cover both branches
    - **Validates: Data Models → EventModel slug validation**

  - [~] 9.3 Implement `src/invitation/TemplateRenderer.jsx`
    - Build a registry of `{ classic, modern, luxury, floral }` using `React.lazy`
    - `pickTemplate(key)` returns `registry[key]` or `ClassicTemplate` for unknown keys
    - Apply `event.colors.primary/accent` as CSS variables on the `[data-template-root]` element
    - _Requirements: Algorithm: Template Selection; Component: TemplateRenderer_

  - [~] 9.4 Write property test for `pickTemplate`
    - **Property P5: Template fallback safety**
    - For any string input (including `''`, `null`, valid keys, random unicode), `pickTemplate(input)` is one of the four known components, and equals `ClassicTemplate` whenever `input ∉ {classic, modern, luxury, floral}`
    - **Validates: Algorithm: Template Selection postconditions**

- [ ] 10. Invitation core
  - [~] 10.1 Create `src/invitation/InvitationDataContext.jsx`
    - Provider stores `{ event, guest }`; exports a `useInvitationData()` hook
    - _Requirements: State Management → InvitationDataContext_

  - [~] 10.2 Create `src/invitation/InvitationPage.jsx`
    - Read `:slug` and `?g=`; call `useEvent(slug)` and `useGuest(token)`
    - Render `<Spinner />` while loading; `<NotFoundInvitation />` on error/missing
    - On success, render `<TemplateRenderer event guest />` inside `<InvitationDataContext.Provider>`
    - _Requirements: Component: InvitationPage; Error Scenario 1_

  - [~] 10.3 Create `src/shared/hooks/useEvent.js`
    - Wrap `eventService.getEventBySlug(slug)`; expose `{ event, status }`
    - _Requirements: API Integration; Sequence Diagram: Public Invitation Open_

  - [~] 10.4 Create `NotFoundInvitation` component
    - Branded soft card with link to `/`
    - _Requirements: Error Scenario 1_

- [ ] 11. Invitation sections (compose into templates)
  - [~] 11.1 Implement `src/invitation/sections/Hero.jsx`
    - Full-bleed `100dvh` photo, gradient overlay, animated names with `heroNames` variant, scroll cue using `scrollCue` variant + `useScroll().scrollTo`
    - _Requirements: Component: Hero; Correctness Properties → Responsiveness (100dvh)_

  - [~] 11.2 Implement `src/invitation/sections/Countdown.jsx`
    - Use `useCountdown(targetDate)`, render four `.glass` cards
    - Render celebratory message when `isPast`
    - _Requirements: Component: Countdown_

  - [~] 11.3 Implement `src/invitation/sections/GuestGreeting.jsx`
    - Render only when `guest` is non-null; script font; gentle `fadeUp` entrance
    - _Requirements: Component: GuestGreeting_

  - [~] 11.4 Implement `src/invitation/sections/RSVPForm.jsx` and `validateRsvp(form)` helper
    - `react-hook-form` controlled fields: `attending`, `partySize`, `dietary`, `note`
    - On `attending === false`, force `partySize = 1`; on `attending === true`, clamp `partySize` to `[1, maxParty]`
    - Reject `dietary`/`note` longer than 500 chars
    - Disable submit while in flight; show 409 / network error inline; preserve form state on failure
    - Submit via `rsvpService.submit`
    - _Requirements: Algorithm: RSVP Submission; Component: RSVPForm; Error Scenario 2_

  - [~] 11.5 Write property test for RSVP validation
    - **Property P3: partySize clamping and note bounds**
    - For arbitrary `{ attending, partySize, dietary, note }` and arbitrary `maxParty ∈ [1,10]`, the validated payload satisfies:
      - if `attending === false` → output `partySize === 1`
      - if `attending === true` → `1 <= output.partySize <= maxParty`
      - `length(dietary) <= 500 && length(note) <= 500`, else returns `Error`
    - **Validates: Correctness Properties → RSVP validation**

  - [~] 11.6 Implement `src/invitation/sections/Gallery.jsx`
    - Swiper-powered slider with autoplay + loop, tap-to-zoom lightbox
    - `loading="lazy"`, `decoding="async"` on every `<img>`
    - _Requirements: Component: Gallery_

  - [~] 11.7 Implement `src/invitation/sections/MusicPlayer.jsx`
    - Floating glass pill bottom-right; uses `useMusic`
    - `aria-pressed` reflects `isPlaying`; accessible label switches between "Play background music" / "Pause background music"
    - Falls back to a paused state with tap-to-play affordance on autoplay rejection
    - _Requirements: Component: MusicPlayer; Error Scenario 3; Correctness Properties → Accessibility_

  - [~] 11.8 Implement `src/invitation/sections/ScheduleSection.jsx`
    - Render `[ {time, event, location?}, ... ]` in a vertical timeline
    - _Requirements: Component: ScheduleSection_

  - [~] 11.9 Implement `src/invitation/sections/LocationMap.jsx`
    - Static map preview (no JS map lib yet) + open-in-maps deep link
    - _Requirements: Component: LocationMap_

- [ ] 12. Refactor invitation templates to compose new sections
  - [~] 12.1 Refactor `templates/Classic/ClassicTemplate.jsx`
    - Compose `Hero`, `GuestGreeting`, `Countdown`, `ScheduleSection`, `Gallery`, `RSVPForm`, optional `MusicPlayer`, optional `LocationMap`
    - _Requirements: Architecture → Component Architecture; Example Usage_

  - [~] 12.2 Refactor `templates/Modern/ModernTemplate.jsx`
    - Same composition with modern visual treatment + `event.colors` overrides
    - _Requirements: Example Usage_

  - [~] 12.3 Refactor `templates/Luxury/LuxuryTemplate.jsx`
    - Same composition with luxury (champagne gold) treatment
    - _Requirements: Example Usage_

  - [~] 12.4 Refactor `templates/Floral/FloralTemplate.jsx`
    - Same composition with rose / cream palette
    - _Requirements: Example Usage_

  - [~] 12.5 Write integration test for invitation happy path
    - `<MemoryRouter initialEntries={["/i/panha-lyly?g=tok"]}>`
    - Mock `eventService.getEventBySlug` and `guestService.getByToken`
    - Assert Hero, GuestGreeting, and RSVPForm render
    - _Requirements: Testing Strategy → Integration; Sequence Diagram: Public Invitation Open_

- [ ] 13. Auth pages wired to `authService`
  - [~] 13.1 Wire `LoginPage.jsx`
    - `react-hook-form`; on submit call `authService.login`, then `auth.login(token, user)`, then navigate to `?next=` or `/app/dashboard`
    - _Requirements: Sequence Diagram: Host Login + Dashboard Load_

  - [~] 13.2 Wire `RegisterPage.jsx`
    - Call `authService.register`; on success navigate to `/login`
    - _Requirements: API Integration_

  - [~] 13.3 Wire `ForgotPasswordPage.jsx` and `ResetPasswordPage.jsx`
    - Call `authService.forgotPassword` and `authService.resetPassword`; show inline confirmation
    - _Requirements: API Integration_

  - [~] 13.4 Write integration test for auth-expired flow
    - Simulate a 401 on a host call; assert logout, toast, and redirect to `/login?next=...`
    - _Requirements: Error Scenario 4; Correctness Properties → Routing & guard invariants_

- [ ] 14. Host pages wired to services
  - [~] 14.1 Wire `DashboardPage.jsx`
    - Use `useEvents()` to list events; show summary cards
    - _Requirements: Sequence Diagram: Host Login + Dashboard Load_

  - [~] 14.2 Wire `EventsPage.jsx` and `CreateEventPage.jsx`
    - List + create + edit + delete via `eventService`
    - File-size client validation for image upload mirrors backend 5MB / 25MB limits (pre-flight)
    - _Requirements: API Integration; Error Scenario 5_

  - [~] 14.3 Wire `GuestsPage.jsx`, `ExpensesPage.jsx`, `WeddingGiftPage.jsx`
    - Hook each to its service / hook (use `MOCK = true` shape until backend lands)
    - _Requirements: API Integration → endpoint table_

  - [~] 14.4 Wire `TemplatePage.jsx` and `AddTemplatePage.jsx`
    - Show template gallery with previews; select template → updates `event.template`
    - _Requirements: Algorithm: Template Selection_

  - [~] 14.5 Wire `SettingsPage.jsx`
    - Wire profile update and change-password via `userService` and `authService`
    - _Requirements: API Integration_

- [ ] 15. ESLint boundary rule for invitation isolation
  - [~] 15.1 Add a no-restricted-imports rule
    - In `eslint.config.js`, forbid imports from `src/app/auth/**` and `src/shared/layout/**` inside `src/invitation/**`
    - _Requirements: Correctness Properties → Routing & guard invariants (public invitation never imports AuthContext)_

- [~] 16. Final checkpoint — Build, lint, and full test run
  - Run `npm run lint`, `npm run build`, and `vitest --run` in `frontend-user/`
  - Ensure all tests pass, ask the user if questions arise.
  - _Requirements: Migration Plan → Phase 7_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP.
- Each task references the design document section that defines its expected behavior. Once `requirements.md` is populated, replace the design references with granular requirement numbers.
- Property tests cover the universal correctness properties from the design: P1, P2 (countdown), P3 (RSVP), P4 (slug), P5 (template fallback).
- Unit tests cover specific examples and edge cases; integration tests cover end-to-end flows in jsdom (no live browser).
- Checkpoints (tasks 7 and 16) ensure the build stays green at major refactor boundaries.

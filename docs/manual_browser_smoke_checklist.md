# Manual Browser Smoke Checklist

Use this checklist when `node scripts/browser-smoke.mjs` cannot run because Chrome or Edge is unavailable.

Expected result for every route:

- The React app root renders visible content.
- The page is not blank white.
- Protected pages show the login/auth gate or redirect safely.
- Public pages show visible content, loading, empty, or handled error state.
- No fatal JavaScript error appears in DevTools console.

## Frontend User

| Route | Expected result | Pass |
| --- | --- | --- |
| `/` | Marketing home renders visible hero/content. | [ ] |
| `/templates` | Template grid or empty/loading state renders. | [ ] |
| `/templates/royal/preview` | Royal preview route renders a visible template/handled state. | [ ] |
| `/templates/royal/checkout` | Static ABA checkout renders and states USD 0.01 fixed payment. | [ ] |
| `/dashboard/events` | Unauthenticated users see auth handling; authenticated users see events. | [ ] |
| `/dashboard/profile` | Unauthenticated users see auth handling; authenticated users see profile form. | [ ] |
| `/dashboard/change-password` | Unauthenticated users see auth handling; authenticated users see password form. | [ ] |
| `/dashboard/notifications` | Notifications page renders loading/empty/auth state. | [ ] |
| `/dashboard/packages` | Package page renders package cards or empty state. | [ ] |
| `/dashboard/payments` | Payment history renders loading/empty/auth state. | [ ] |
| `/dashboard/invitations/1/budget` | Budget page renders auth/empty/error state, not blank. | [ ] |
| `/dashboard/invitations/1/check-in` | Check-in page renders auth/empty/error state, not blank. | [ ] |
| `/dashboard/invitations/1/seating` | Seating page renders auth/empty/error state, not blank. | [ ] |
| `/i/demo-invitation` | Public invitation route renders visible handled state. | [ ] |
| `/i/demo-invitation?token=demo-token` | Tokenized invitation route renders visible handled state. | [ ] |

## Frontend Admin

| Route | Expected result | Pass |
| --- | --- | --- |
| `/admin/login` | Admin login form renders. | [ ] |
| `/admin/dashboard` | Unauthenticated users redirect/show admin login; authenticated admins see dashboard. | [ ] |
| `/admin/users` | Unauthenticated users redirect/show admin login; admins see users page. | [ ] |
| `/admin/templates` | Unauthenticated users redirect/show admin login; admins see templates page. | [ ] |
| `/admin/invitations` | Unauthenticated users redirect/show admin login; admins see invitations page. | [ ] |
| `/admin/reports` | Unauthenticated users redirect/show admin login; admins see reports page. | [ ] |
| `/admin/system-logs` | Unauthenticated users redirect/show admin login; admins see logs page. | [ ] |

## Mobile Widths

Check the user routes above at:

- 360px
- 390px
- 768px
- Desktop width

Watch specifically for horizontal scroll, clipped form controls, map overflow, hidden CTA buttons, broken gallery layout, and RSVP form overflow.

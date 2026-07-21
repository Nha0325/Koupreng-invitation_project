# ផ្លូវ Frontend User

ប្រភពផ្លូវការគឺ `apps/frontend-user/src/app/router.jsx`; វាប្រើ `<Routes>` មួយគត់។ Route contract ត្រូវបានការពារដោយ `src/app/router.test.jsx`។

## Public និង authentication

| ផ្លូវ | គោលបំណង |
| --- | --- |
| `/`, `/templates`, `/templates/:id`, `/pricing`, `/venues` | Marketing និង template catalog |
| `/templates/:id/preview` | Full template preview |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Authentication |
| `/w/:slug`, `/i/:slug` | Public/guest invitation |
| `/event/:draftId`, `/preview/:draftId` | Draft preview |
| `/payments/:orderCode/status`, `/payments/success`, `/payments/return`, `/payments/cancel` | Payment result/status |

## ផ្លូវដែលត្រូវការ login

- Builder: `/create/wedding`, `/create/wedding/:draftId`, `/event/:draftId/manage`។
- Checkout: `/templates/:templateId/checkout`។
- Host: `/dashboard` និង children សម្រាប់ invitations, profile, notifications, packages និង payments។
- Planning: `/guests`, `/event/list`, `/events`, `/expenses`, `/gift`, `/gifts`។
- Template browsing: `/templates/browse`, `/templates/browse/:id`។

Route មិនស្គាល់បង្ហាញ Not Found page។ `RequireAuth` រក្សា pathname, query និង hash ក្នុង `next` parameter ពេល redirect ទៅ login។

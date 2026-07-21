# ស្ថាបត្យកម្ម Frontend User

កម្មវិធីអ្នកប្រើប្រាស់ប្រើ React, Vite, React Router, Zustand និង Axios។ ចំណុចចាប់ផ្តើមគឺ `apps/frontend-user/src/main.jsx` ហើយ `app/App.jsx` ដាក់ `BrowserRouter` មួយគត់។ Router ផ្លូវការមាននៅ `app/router.jsx` និងចែក route ជាក្រុមក្នុង `app/routes/`។

## រចនាសម្ព័ន្ធបច្ចុប្បន្ន

- `app/` — root component, router, route guards និង providers។
- `features/` — business behavior តាម domain ដូចជា auth, invitations, templates, payments និង wedding builder។
- `pages/` — route-level composition ដែលភ្ជាប់ feature ទៅ router។
- `layouts/` — marketing, authentication និង host shells។
- `shared/` — API client, storage, UI និង helper ដែលប្រើច្រើន feature។
- `stores/` — Zustand state សម្រាប់ auth, language និង wedding draft។
- `assets/` — assets ដែល import ដោយ source/CSS; public URL assets នៅ `public/`។
- `styles/` — global styles និង tokens។

## លំហូរសំខាន់

1. អ្នកប្រើមើល home/templates និង template preview ជាសាធារណៈ។
2. ការបង្កើត ឬកែសម្រួល wedding draft ត្រូវឆ្លង `RequireAuth`។
3. Builder រក្សា draft state ហើយប្រើ backend services សម្រាប់ publish និង management។
4. Public invitation មានផ្លូវ `/w/:slug` និង alias `/i/:slug`; private invitation អាចប្រើ guest token ឬ access password។
5. Host dashboard គ្រប់គ្រង invitations, guests, media, delivery, budget, seating, check-in និង payments។

Auth API ទាំងអស់ឆ្លងកាត់ `shared/api/httpClient.js`; កុំបង្កើត Axios client ថ្មីនៅក្នុង UI component។ កាតទាំងអស់ប្រើ `TemplateExperience` ជា engine រួម ខណៈ Canva Khmer variant ប្រើ renderer ជាក់លាក់នៅក្រោម `template-experience/canva-khmer/`។

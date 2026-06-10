# 🗺️ Routes Documentation

## 📍 ទិដ្ឋភាពទូទៅ

App ប្រើ React Router v6 ជាមួយ `<Routes>` ក្នុង `router.jsx`។
Routes ត្រូវបានបែងចែកជា ៥ ក្រុម:

---

## 1. Builder Routes (`builderRoutes.jsx`)

Routes សម្រាប់បង្កើត/preview/publish កាតអាពាហ៍ពិពាហ៍។ **គ្មាន layout shell** (standalone pages)។

| Path | Component | Description |
|------|-----------|-------------|
| `/templates/:id/preview` | `WeddingSite` | Preview template ពេញអេក្រង់ (full mode) |
| `/create/wedding` | `CreateWeddingPage` | បង្កើតកាតថ្មី |
| `/create/wedding/:draftId` | `CreateWeddingPage` | កែកាត draft |
| `/preview/:draftId` | `WeddingPreviewPage` | Preview draft ក្នុង phone frame |
| `/w/:slug` | `PublicInvitationPage` | **កាតពិតប្រាកដ** ដែលភ្ញៀវឃើញ (public link) |

### URLs ឧទាហរណ៍:
- `http://localhost:5173/templates/royal/preview` — preview template "royal"
- `http://localhost:5173/create/wedding` — start new wedding card
- `http://localhost:5173/w/sokha-dara` — public invitation link

---

## 2. Marketing Routes (`marketingRoutes.jsx`)

Pages សាធារណៈសម្រាប់ marketing។ ប្រើ **MarketingShell** layout (navbar + footer)។

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Landing page |
| `/templates` | `TemplatesPage` | បង្ហាញ template ទាំងអស់ |
| `/templates/:id` | `TemplateDemoPage` | Demo template ក្នុង phone frame + autoplay music |
| `/pricing` | `PricingPage` | តម្លៃកញ្ចប់ |
| `/venues` | `VenuesPage` | សាលមង្គល |

---

## 3. Host Routes (`hostRoutes.jsx`)

Dashboard សម្រាប់ម្ចាស់កាត (host)។ ប្រើ **HostShell** layout (sidebar + header)។

| Path | Component | Description |
|------|-----------|-------------|
| `/dashboard` | `DashboardPage` | ទិដ្ឋភាពទូទៅ |
| `/guests` | `GuestsPage` | គ្រប់គ្រងភ្ញៀវ |
| `/events` | `EventsPage` | កម្មវិធីទាំងអស់ |
| `/events/create` | `CreateEventPage` | បង្កើតកម្មវិធីថ្មី |
| `/expenses` | `ExpensesPage` | ចំណាយ |
| `/gifts` | `WeddingGiftPage` | អំណោយ |

---

## 4. Auth Routes (`authRoutes.jsx`)

Pages សម្រាប់ authentication។ ប្រើ **AuthShell** layout។

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | `LoginPage` | ចូលគណនី |
| `/register` | `RegisterPage` | បង្កើតគណនី |
| `/forgot-password` | `ForgotPasswordPage` | ភ្លេចពាក្យសម្ងាត់ |

---

## 5. Admin Routes (`adminRoutes.jsx`)

Dashboard សម្រាប់ admin។ ប្រើ **AdminShell** layout។ ទាំងអស់នៅក្រោម `/admin`។

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | `AdminDashboardPage` | Dashboard (index) |
| `/admin/dashboard` | `AdminDashboardPage` | Dashboard |
| `/admin/users` | `AdminUsersPage` | គ្រប់គ្រង users |
| `/admin/templates` | `AdminTemplatesPage` | គ្រប់គ្រង templates |
| `/admin/subscriptions` | Placeholder | កញ្ចប់សេវាកម្ម |
| `/admin/venues` | Placeholder | សាលមង្គល |
| `/admin/transactions` | Placeholder | របាយការណ៍ថវិកា |
| `/admin/logs` | Placeholder | System Audit Logs |

---

## 🏗️ Layouts

| Layout | ប្រើនៅ | មុខងារ |
|--------|--------|--------|
| `MarketingShell` | Marketing routes | Navbar + Footer |
| `HostShell` | Host routes | Sidebar + Header |
| `AuthShell` | Auth routes | Centered card layout |
| `AdminShell` | Admin routes | Admin sidebar + header |
| *(none)* | Builder routes | Standalone full-screen pages |

---

## 🔀 Route Loading Order (in router.jsx)

```jsx
<Routes>
    {builderRoutes()}    // 1st — standalone pages
    {marketingRoutes()}  // 2nd — public marketing
    {authRoutes()}       // 3rd — login/register
    {hostRoutes()}       // 4th — host dashboard
    {adminRoutes()}      // 5th — admin panel
    <Route path="*" element={<NotFoundPage />} />  // 404
</Routes>
```

---

## 📂 File Structure

```
src/app/
├── App.jsx
├── ScrollToTop.jsx
├── router.jsx          ← main router
└── routes/
    ├── adminRoutes.jsx
    ├── authRoutes.jsx
    ├── builderRoutes.jsx
    ├── hostRoutes.jsx
    ├── marketingRoutes.jsx
    └── routes.md        ← this file
```

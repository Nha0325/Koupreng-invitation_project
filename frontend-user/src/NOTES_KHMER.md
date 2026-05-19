# 📘 កំណត់ត្រាគម្រោង frontend-user/src (ភាសាខ្មែរ)

ឯកសារនេះពន្យល់ពី **រចនាសម្ព័ន្ធទូទៅ** និង **មុខងារសំខាន់ៗ** របស់កម្មវិធី frontend-user។ វាជាគេហទំព័រសម្រាប់បង្កើត និងបង្ហាញ **កាតអញ្ជើញអាពាហ៍ពិពាហ៍** (Wedding Invitation) ដោយប្រើ **React + Vite + React Router**។

---

## 🗂️ រចនាសម្ព័ន្ធថត (Folder Structure)

```
src/
├── app/              → ការកំណត់ root: App, Router, AuthContext, ThemeContext
├── assets/           → រូបភាព, ពុម្ពអក្សរ, តន្ត្រី
├── features/         → មុខងារនីមួយៗ (templates, wedding-builder, wedding-site, ...)
├── layouts/          → Shell (រចនាបទ) សម្រាប់ផ្នែកនីមួយៗ (Auth, Admin, Host, Marketing)
├── lib/              → libraries ខាងក្រៅ (supabase)
├── mocks/            → ទិន្នន័យសាកល្បង (in-memory DB)
├── pages/            → ទំព័រនីមួយៗដែលភ្ជាប់ទៅ Router
├── services/         → រក្សាទុកទិន្នន័យ (localStorage / IndexedDB)
└── shared/           → ផ្នែករួម: API, hooks, ui components, ...
```

---

## 🧭 លំហូរកម្មវិធី (App Flow)

1. **អ្នកប្រើចូលគេហទំព័រ** → `pages/marketing/HomePage.jsx`
2. **ចុច "មើលគ្រោងកាត"** → `pages/TemplatesPage.jsx` បង្ហាញ `TemplateGrid` (បញ្ជីគំរូទាំងអស់)
3. **ចុចលើគំរូមួយ** → `pages/TemplateDemoPage.jsx` បង្ហាញ preview ក្នុងស៊ុមទូរស័ព្ទ
4. **ចុច "ប្រើគំរូនេះ"** → `pages/CreateWeddingPage.jsx` → `CreateWedding.jsx` (បង្កើតកាត ៦ ដំណាក់កាល)
5. **ចុច "មើលជាមុន"** → `WeddingPreviewPage.jsx` បង្ហាញកាតពេញលេញ
6. **ចែកលីង public** → `PublicInvitationPage.jsx` → `/w/:slug`

---

## 🎯 មុខងារសំខាន់ៗ (Key Features)

### 1. Templates (គំរូកាតអញ្ជើញ)
- **ទីតាំង**: `features/templates/`
- **ឯកសារទិន្នន័យ**: `data/templatesData.js` ដែលផ្ទុកគំរូ ៦ ប្រភេទ (royal, garden, forest, classic, sky, vintage)
- **គំរូនីមួយៗមាន**:
  - `id`, `name`, `style`, `image` (រូបភាព cover)
  - ព័ត៌មានគូ (groom, bride)
  - កាលបរិច្ឆេទ និងពេលវេលា
  - ទីតាំងសាល
  - ពណ៌ theme (`bg`, `paper`, `color`, `accent`, `dark`)

### 2. Wedding Builder (បង្កើតកាត ៦ ដំណាក់កាល)
- **ទីតាំង**: `features/wedding-builder/`
- **ដំណាក់កាល**:
  1. ជ្រើសរើសគំរូ (`SelectTemplateStep`)
  2. ព័ត៌មានគូ (`CoupleInfoStep`)
  3. ព័ត៌មានពិធី (`EventInfoStep`)
  4. រឿង / រូបភាព (`StoryGalleryStep`)
  5. ការកំណត់ RSVP (`RsvpSettingsStep`)
  6. ត្រួតពិនិត្យ និងបោះផ្សាយ (`ReviewPublishStep`)

### 3. Wedding Site (បង្ហាញកាតពេញលេញ)
- **ទីតាំង**: `features/wedding-site/`
- **ឯកសារសំខាន់**: `RoyalInvitation.jsx` — ជា component ដ៏ធំសម្រាប់បង្ហាញកាតពេញ ដែលមាន:
  - Hero video + cover
  - ប៊ូតុងបើក/បិទតន្ត្រី
  - Countdown (ថ្ងៃ ម៉ោង នាទី វិនាទី)
  - ផែនទី Google Maps
  - Gallery រូបភាព
  - ទម្រង់ RSVP

### 4. Storage (រក្សាទុកទិន្នន័យ)
- **`weddingStorage.js`** → ប្រើ **localStorage** សម្រាប់រក្សាទុក draft
- **`galleryStorage.js`** → ប្រើ **IndexedDB** សម្រាប់រក្សាទុករូបភាព/វីដេអូ (ដោយសារ localStorage មាន limit តែ 5MB)

### 5. UI Components សំខាន់ៗ (shared/ui/)
| Component | មុខងារ |
|-----------|--------|
| `DatePicker` | ជ្រើសរើសកាលបរិច្ឆេទ (ខែ ថ្ងៃ ជាភាសាខ្មែរ) |
| `TimePicker` | ជ្រើសរើសពេលវេលា |
| `VenuePicker` | autocomplete ឈ្មោះសាលមង្គលនៅកម្ពុជា |
| `Button`, `AnimatedButton` | ប៊ូតុង |
| `GlassCard`, `MagicCard` | កាតរចនាបទ glassmorphism |
| `Spinner`, `Toaster`, `PageTransition` | utilities |

---

## 🔐 Authentication

- **ទីតាំង**: `app/auth/AuthContext.jsx`
- ប្រើ Context API ដើម្បីគ្រប់គ្រងស្ថានភាពអ្នកប្រើ
- **ទំព័រ**: `pages/auth/` (Login, Register, ForgotPassword, ResetPassword)
- **Service**: `shared/services/authService.js`

---

## 🎨 Layouts (Shells)

| Shell | សម្រាប់ |
|-------|---------|
| `MarketingShell` | ទំព័រ public (HomePage, Pricing, Templates) |
| `AuthShell` | ទំព័រ login/register |
| `HostShell` | dashboard សម្រាប់ម្ចាស់ពិធី (បង្កើតពិធី, ភ្ញៀវ, ចំណាយ, ...) |
| `AdminShell` | dashboard សម្រាប់ admin (manage users/templates) |
| `InvitationShell` | ទំព័រកាតអញ្ជើញ public |

---

## 📁 ឯកសារកំណត់ត្រាលម្អិតបន្ថែម

ដើម្បីយល់កាន់តែច្បាស់ សូមមើលឯកសារ md ផ្សេងទៀតក្នុងថត:

- `features/templates/view_card_tamplate.md` — ការបង្ហាញកាតគំរូ
- `features/wedding-builder/create_theab_ka.md` — ការបង្កើតកាតអាពាហ៍ពិពាហ៍
- `features/wedding-builder/steps/information_create_theab_ka.md` — ដំណាក់កាល Event Info
- `features/wedding-builder/components/view_phone_in_create_theab_ka.md` — Phone Preview
- `features/wedding-site/view_in_phone.md` — ការបង្ហាញនៅលើទូរស័ព្ទ

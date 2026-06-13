# 💒 ការបង្កើតកាតអាពាហ៍ពិពាហ៍ (Wedding Builder)

## 📍 ទិដ្ឋភាពទូទៅ

ឯកសារនេះពន្យល់ពី **ប្រព័ន្ធបង្កើតកាតអាពាហ៍ពិពាហ៍** ដែលមាន **៦ ដំណាក់កាល** (steps) ឲ្យអ្នកប្រើបំពេញព័ត៌មានបន្តិចម្តងៗ។

---

## 📂 រចនាសម្ព័ន្ធថត

```
features/wedding-builder/
├── CreateWedding.jsx              ← ឯកសារមេ (entry point)
├── builder.css                    ← រចនាបទ CSS
├── components/
│   ├── BuilderSidebar.jsx         ← bar ចំហៀងបង្ហាញដំណាក់កាល
│   ├── PhonePreview.jsx           ← ការបង្ហាញបន្តផ្ទាល់ (live preview)
│   ├── PublishBox.jsx             ← box "មើលជាមុន" / បោះផ្សាយ
│   └── StepNavigation.jsx         ← ប៊ូតុង "មុន" / "បន្ទាប់"
├── data/
│   └── defaultWeddingData.js      ← ទិន្នន័យ default
├── hooks/
│   └── useWeddingBuilder.js       ← hook គ្រប់គ្រង draft state
└── steps/                         ← ៦ ដំណាក់កាល
    ├── SelectTemplateStep.jsx
    ├── CoupleInfoStep.jsx
    ├── EventInfoStep.jsx
    ├── StoryGalleryStep.jsx
    ├── RsvpSettingsStep.jsx
    └── ReviewPublishStep.jsx
```

---

## 🔄 លំហូរការប្រើប្រាស់

```
អ្នកប្រើ → /create/wedding?template=royal
   ↓
[CreateWedding.jsx]
   ↓ ប្រើ useWeddingBuilder() hook
   ↓ បង្កើត/ផ្ទុក draft ពី localStorage
   ↓
[Sidebar | Step Component | Phone Preview]
   ↓ user grok ដំណាក់កាលនីមួយៗ
   ↓ រាល់ការផ្លាស់ប្តូរ → save ទៅ localStorage ដោយស្វ័យប្រវត្តិ
   ↓
[Publish] → /preview/:id
```

---

## 📝 ការពន្យល់ឯកសារសំខាន់ៗ

### 1. `CreateWedding.jsx` — ឯកសារមេ

```jsx
const STEP_LABELS = [
    "ជ្រើសរើសគំរូ",         // 0
    "ព័ត៌មានគូរ",            // 1
    "ព័ត៌មានពិធី",           // 2
    "រឿង / រូបភាព",          // 3
    "ការកំណត់ RSVP",         // 4
    "ត្រួតពិនិត្យ និងបោះផ្សាយ", // 5
];
```

**មុខងារ**:
1. ទាញ `draftId` ពី URL (`/create/wedding/:draftId`)
2. ទាញ `template` ពី query string (`?template=royal`)
3. ហៅ hook `useWeddingBuilder` ដើម្បីផ្ទុក/បង្កើត draft
4. update URL ឲ្យមាន `draftId` (សម្រាប់ refresh)
5. បង្ហាញ component តាមដំណាក់កាលបច្ចុប្បន្ន (`step`)

**Layout**:
```
┌─────────┬────────────────┬──────────┐
│ Sidebar │  Step Content  │  Phone   │
│ (steps) │  + Nav buttons │  Preview │
└─────────┴────────────────┴──────────┘
```

---

### 2. `useWeddingBuilder.js` — Hook គ្រប់គ្រង State

**State សំខាន់**:
```js
draft  // ទិន្នន័យកាតបច្ចុប្បន្ន (couple, event, story, gallery, rsvp)
step   // លេខដំណាក់កាល (0-5)
```

**មុខងារ**:
| Function | មុខងារ |
|----------|--------|
| `update(patch)` | merge ទិន្នន័យចូល draft (top-level) |
| `updateField(section, patch)` | merge ចូល section ណាមួយ (eg: `event.date`) |
| `next()` | ដំណាក់កាលបន្ទាប់ |
| `prev()` | ដំណាក់កាលមុន |
| `goTo(index)` | លោតទៅដំណាក់កាលណាមួយ |

**ការ Auto-save**:
```js
useEffect(() => {
    saveDraft(draft);  // រក្សាទុកទៅ localStorage រាល់ពេល draft ប្តូរ
}, [draft]);
```

---

### 3. `BuilderSidebar.jsx` — Bar ចំហៀង

បង្ហាញ **បញ្ជីដំណាក់កាល ៦** ជា ordered list។
- ដំណាក់កាលបច្ចុប្បន្ន → មាន class `is-active`
- ចុចលើដំណាក់កាលណាមួយ → ហៅ `onSelect(index)` → លោតភ្លាម
- មាន link "ត្រឡប់ក្រោយ" → `/templates`

---

### 4. `StepNavigation.jsx` — ប៊ូតុង Navigation

ប៊ូតុង **មុន** / **បន្ទាប់** នៅខាងក្រោម content:
- បើ `isFirst === true` → លាក់ប៊ូតុង "មុន"
- បើ `isLast === true` → ប្តូរ "បន្ទាប់" ទៅ "បោះផ្សាយ"

---

### 5. `PhonePreview.jsx` — Live Preview

មើល [`components/view_phone_in_create_theab_ka.md`](./components/view_phone_in_create_theab_ka.md) សម្រាប់ការពន្យល់លម្អិត។

**សង្ខេប**: បង្ហាញ `RoyalInvitation` ពេញលេញនៅក្នុងស៊ុមទូរស័ព្ទ ដោយប្រើទិន្នន័យ draft បច្ចុប្បន្ន។

---

### 6. `PublishBox.jsx` — Box បោះផ្សាយ

**មុខងារ**: បង្ហាញសារ "រក្សាទុកដោយស្វ័យប្រវត្តិ" + ប៊ូតុង **"មើលជាមុន"**
- បើ `draft.id` មិនទាន់មាន → ប៊ូតុង disabled
- បើមាន → ភ្ជាប់ទៅ `/preview/:draftId`

---

## 🗃️ ការរក្សាទុកទិន្នន័យ (Storage)

### `weddingStorage.js`
- ប្រើ **localStorage** ជាមួយ key `koupreng.wedding.drafts`
- រក្សាទុក drafts ទាំងអស់ជា `{ [draftId]: draft }`

**មុខងារ**:
- `createDraft(initial)` — បង្កើត draft ថ្មី
- `getDraft(draftId)` — ទាញ draft មួយ
- `getDraftBySlug(slug)` — ទាញ draft តាម slug (សម្រាប់ public URL)
- `saveDraft(draft)` — រក្សាទុក
- `deleteDraft(draftId)` — លុប
- `listDrafts()` — បញ្ជី drafts ទាំងអស់ តម្រៀបតាម `updatedAt`

### `galleryStorage.js`
- ប្រើ **IndexedDB** សម្រាប់រូបភាព/វីដេអូ (ដោយសារ localStorage limit 5MB)
- DB name: `koupreng_gallery`, Store: `items`

**មុខងារ**:
- `saveGallery(draftId, gallery)` — រក្សាទុក
- `loadGallery(draftId)` — ទាញ
- `deleteGallery(draftId)` — លុប

---

## 📋 រចនាសម្ព័ន្ធទិន្នន័យ Draft

```js
{
    id: "wed-abc123",            // លេខសម្គាល់ (auto-generated)
    templateId: "royal",         // ID នៃ template
    slug: "samnang-srey",        // URL slug សម្រាប់ public link
    couple: {
        groom: "សំណាង",
        bride: "ស្រី"
    },
    event: {
        date: "2026-12-19",      // YYYY-MM-DD
        ceremonyTime: "09:00",   // HH:MM
        receptionTime: "17:00",
        venueName: "សាលមង្គល...",
        venueAddress: "ផ្លូវ...",
    },
    story: "យើងបានជួបគ្នា...",   // អត្ថបទរឿង
    gallery: [...],              // បញ្ជី IDs នៃរូបក្នុង IndexedDB
    rsvp: {
        enabled: true,
        deadline: "2026-12-10"
    },
    updatedAt: 1736000000000     // timestamp
}
```

---

## 💡 ឧទាហរណ៍ Code

### បន្ថែមដំណាក់កាលថ្មី
```jsx
// 1. បង្កើតឯកសារ steps/NewStep.jsx
export default function NewStep({ draft, updateField }) {
    return (
        <div>
            <h2>ដំណាក់កាលថ្មី</h2>
            <input
                value={draft.event.something}
                onChange={(e) => updateField("event", { something: e.target.value })}
            />
        </div>
    );
}

// 2. បន្ថែមទៅ STEP_LABELS និង switch case ក្នុង CreateWedding.jsx
```

### ទាញ draft ដែលរក្សាទុកហើយ
```js
import { getDraft, listDrafts } from "../../services/weddingStorage";

const draft = getDraft("wed-abc123");
const allDrafts = listDrafts();  // តម្រៀបតាមថ្មីបំផុត
```

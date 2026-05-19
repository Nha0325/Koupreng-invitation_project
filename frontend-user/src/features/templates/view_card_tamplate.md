# 🃏 ការបង្ហាញកាតគំរូ (Template Card View)

## 📍 ទិដ្ឋភាពទូទៅ

ឯកសារនេះពន្យល់ពី **របៀបបង្ហាញគំរូកាតអាពាហ៍ពិពាហ៍** ដែលអ្នកប្រើអាចមើល និងជ្រើសរើស។

---

## 📂 ឯកសារពាក់ព័ន្ធ

```
features/templates/
├── components/
│   └── TemplateGrid.jsx        ← បង្ហាញបញ្ជីគំរូទាំងអស់ (grid)
├── data/
│   └── templatesData.js        ← ទិន្នន័យគំរូ ៦ ប្រភេទ
├── previews/
│   ├── RoyalPreview.jsx        ← preview សម្រាប់គំរូ Royal
│   ├── ModernKhmerPreview.jsx
│   ├── LuxuryPreview.jsx
│   ├── ClassicPreview.jsx
│   ├── RoyalKhmerPreview.jsx
│   └── VintageGoldPreview.jsx
└── templates.css               ← រចនាបទ CSS
```

ហើយទំព័រដែលប្រើវា:
- `pages/TemplatesPage.jsx` → re-export ពី `pages/marketing/TemplatesPage.jsx`
- `pages/TemplateDemoPage.jsx` → ទំព័រ demo នៃគំរូមួយ

---

## 🔍 ការពន្យល់ឯកសារនីមួយៗ

### 1. `TemplateGrid.jsx` — បង្ហាញបញ្ជីគំរូ

**មុខងារ**: បង្ហាញ **គំរូទាំង ៦** ជាទម្រង់ grid (ក្រឡា)។

**លំហូរ**:
1. នាំចូលទិន្នន័យពី `TEMPLATES` (ក្នុង `templatesData.js`)
2. ដំណើរការ `.map()` លើគំរូនីមួយៗ
3. បង្ហាញកាតមួយៗមាន:
   - 🏷️ **ស្លាក "ពេញនិយម"** (ប្រសិនបើ `popular: true`)
   - 🖼️ **រូបភាព cover** (`t.image`)
   - 📛 **ឈ្មោះគំរូ** (`t.name`)
   - 🎨 **រចនាបទ** (`t.style`)
   - 🔘 **ប៊ូតុង "ប្រើប្រាស់គំរូនេះ"** → ទៅទំព័របង្កើត
   - 🔍 **overlay "មើលលម្អិត"** ពេល hover

**លីង (Routes)**:
- ចុចរូបភាព → `/templates/:id` (TemplateDemoPage)
- ចុច "ប្រើប្រាស់គំរូនេះ" → `/create/wedding?template=:id`

---

### 2. `templatesData.js` — ទិន្នន័យគំរូ

មាន **គំរូ ៦ ប្រភេទ**:

| ID | ឈ្មោះ | រចនាបទ | ពណ៌ច្រើនបំផុត |
|----|------|---------|---------------|
| `royal` | រាជមង្គល Royal | Classic Royal Elegance | មាស |
| `garden` | បុប្ផាភ្នំពេញ | Modern Garden | ស្វាយ |
| `forest` | និស្ស័យមង្គល | Forest Luxury | បៃតង |
| `classic` | មង្គលជ័យ | Classic Khmer | ក្រហម |
| `sky` | ទេវីសួគ៌ា | Royal Blue | ខៀវ |
| `vintage` | សិរីមង្គល | Vintage Gold | មាសចាស់ |

**រចនាសម្ព័ន្ធនៃ template មួយ**:
```js
{
    id: "royal",                      // លេខសម្គាល់
    name: "រាជមង្គល Royal",          // ឈ្មោះបង្ហាញ
    style: "Classic Royal Elegance",  // ប្រភេទរចនាបទ
    popular: true,                    // ពេញនិយម?
    image: "/image/a1.png",           // រូបភាព cover
    Preview: W01Preview,              // React component សម្រាប់ preview
    groom: "បញ្ញា",                  // ឈ្មោះកំលោះ default
    bride: "ផ្កាយ",                   // ឈ្មោះក្រមុំ default
    dateText: "...",                  // អត្ថបទកាលបរិច្ឆេទ
    targetDate: "2026-12-19...",      // កាលបរិច្ឆេទពិតសម្រាប់ countdown
    ceremonyTime: "០៩:០០",            // ម៉ោងពិធី
    receptionTime: "១៧:០០",           // ម៉ោងពិសាភោជនាហារ
    venueName: "...",                 // ឈ្មោះសាល
    venueAddress: "...",              // អាសយដ្ឋាន
    bg, paper, color, accent, dark    // ពណ៌ theme (5 ពណ៌)
}
```

**មុខងារសំខាន់**:
```js
getTemplateById(id)  // ត្រឡប់ template តាម id, បើរកមិនឃើញ ប្រើ TEMPLATES[0]
```

---

### 3. `pages/TemplateDemoPage.jsx` — ទំព័រ demo

**មុខងារ**: បង្ហាញ **កាតក្នុងស៊ុមទូរស័ព្ទ** ដែលអ្នកប្រើអាច:
- ✉️ ចុចលើស្រោម (envelope) ដើម្បីបើកកាត
- 📜 រំកិលដោយ scroll/drag
- 🔄 auto-scroll ដោយស្វ័យប្រវត្តិបន្ទាប់ពីបើក
- 🎵 មាន music player

**State សំខាន់**:
```js
openedState         // {templateId, value: bool} — តើបើកស្រោមហើយឬនៅ
phoneRef            // ref ទៅ DOM scroll container
autoScrollRef       // ref សម្រាប់ auto-scroll animation
dragRef             // ref សម្រាប់ pointer drag
```

**មុខងារ**:
- `openInvitation()` — បើកស្រោម + ចាប់ផ្តើម auto-scroll
- `startAutoScroll()` — ធ្វើ animation រំកិលចុះ
- `handlePhoneWheel/PointerDown/Move/End` — គ្រប់គ្រង scroll/drag

**ផ្នែកខាងស្តាំ**: បង្ហាញព័ត៌មាន
- ឈ្មោះកំលោះ-ក្រមុំ
- ទីតាំង
- កាលបរិច្ឆេទ
- ប៊ូតុង "មើលការអញ្ជើញពេញលេញ" → `/templates/:id/preview`
- ប៊ូតុង "ប្រើគំរូនេះ" → `/create/wedding?template=:id`

---

## 🎨 ការប្រើប្រាស់ pseudo-3D envelope

ឯកសារ CSS (`templates.css`) កំណត់រូបរាង **ស្រោមសំបុត្រ ៣ វិមាត្រ**:
- `.tpl-envelope-grain` — texture ក្រដាស
- `.tpl-envelope-deckle` — គែមរហែក
- `.tpl-envelope-fold` — ផ្នត់ស្រោម
- `.tpl-wax-seal` — ត្រា K (Koupreng)

ពេលអ្នកប្រើចុច **state ប្តូរ** → ស្រោមបើកជាមួយ animation → លាតបង្ហាញ `RoyalInvitation` ខាងក្នុង។

---

## 💡 បកស្រាយ Code ខ្លី

```jsx
// ប្រើ memo + ref ដើម្បីកុំឲ្យ re-render ច្រើន
const phoneRef = useRef(null);

// stop auto-scroll ពេលអ្នកប្រើចូលរូម
const handlePhoneWheel = useCallback((event) => {
    stopAutoScroll();  // បញ្ឈប់ animation
    node.scrollTop += event.deltaY;  // រំកិលដោយ wheel
}, [...]);

// សន្សំ pointer position ពេល drag
dragRef.current = { active: true, startY: event.clientY, scrollTop: ... };
```

# 🃏 របៀបបន្ថែមកាតគំរូថ្មី (How to Add a New Template Card)

---

## ជំហានទី ១ — បង្កើត Preview Component

បង្កើតឯកសារថ្មីក្នុង `features/templates/previews/` ឧទាហរណ៍ `MyNewPreview.jsx`:

```jsx
export default function MyNewPreview({ tpl }) {
    return (
        <div
            className="tpl-preview"
            style={{
                "--tpl-bg": tpl.bg,
                "--tpl-gold": tpl.color,
                "--tpl-accent": tpl.accent,
                "--tpl-dark": tpl.dark,
                background: tpl.bg,
                color: tpl.dark,
            }}
        >
            <div className="tpl-preview-arch" style={{ borderColor: tpl.color }} />
            <div className="tpl-preview-content">
                <p className="tpl-preview-label" style={{ color: tpl.accent }}>{tpl.label}</p>
                <h3 className="tpl-preview-names" style={{ color: tpl.dark }}>
                    {tpl.groom} & {tpl.bride}
                </h3>
                <div className="tpl-preview-line" style={{ background: tpl.color }} />
                <p className="tpl-preview-date" style={{ color: tpl.accent }}>{tpl.dateText}</p>
            </div>
        </div>
    );
}
```

---

## ជំហានទី ២ — បន្ថែមទិន្នន័យក្នុង `templatesData.js`

បើកឯកសារ `features/templates/data/templatesData.js` រួច:

### 2a. នាំចូល Preview component:

```js
import W07Preview from "../previews/MyNewPreview";
```

### 2b. បន្ថែម object ថ្មីក្នុង `TEMPLATES` array:

```js
{
    id: "my-new",                     // URL slug → /templates/my-new
    name: "ឈ្មោះកាត",                  // ឈ្មោះបង្ហាញ
    style: "Style Name",              // ប្រភេទរចនាបទ
    popular: false,                   // បង្ហាញស្លាក "ពេញនិយម"?
    image: "/image/a7.png",           // រូបភាព thumbnail (ដាក់ក្នុង public/image/)
    Preview: W07Preview,              // Preview component
    groom: "កូនកំលោះ",                // ឈ្មោះកំលោះ
    bride: "កូនក្រមុំ",                 // ឈ្មោះក្រមុំ
    dateText: "ថ្ងៃសៅរ៍ ១០ មករា ២០២៧",  // អត្ថបទកាលបរិច្ឆេទ
    targetDate: "2027-01-10T17:00:00+07:00", // សម្រាប់ countdown
    ceremonyTime: "០៩:០០",             // ម៉ោងពិធី
    receptionTime: "១៧:០០",            // ម៉ោងពិសាភោជនាហារ
    venueName: "ឈ្មោះសាល",             // ឈ្មោះទីកន្លែង
    venueAddress: "អាសយដ្ឋាន",         // អាសយដ្ឋាន
    mapQuery: "អាសយដ្ឋាន Cambodia",    // សម្រាប់ Google Maps (ជម្រើស)
    bg: "#f6efe4",                    // ពណ៌ផ្ទៃខាងក្រោយ
    paper: "#fffaf1",                 // ពណ៌ក្រដាស
    color: "#c8a35f",                 // ពណ៌មាស/accent หลัก
    accent: "#6f4d24",                // ពណ៌អក្សររង
    dark: "#21180f",                  // ពណ៌អក្សរចម្បង
    label: "WEDDING INVITATION",      // ស្លាកលើ preview
    description: "ការពិពណ៌នាអំពីកាត។",  // ពិពណ៌នាខ្លី
},
```

---

## 📂 រចនាសម្ព័ន្ធឯកសារ

```
features/templates/
├── components/
│   └── TemplateGrid.jsx        ← បង្ហាញបញ្ជីគំរូទាំងអស់ (grid)
├── data/
│   └── templatesData.js        ← ទិន្នន័យគំរូ (បន្ថែមនៅទីនេះ)
├── previews/
│   ├── RoyalPreview.jsx
│   ├── ModernKhmerPreview.jsx
│   ├── LuxuryPreview.jsx
│   ├── ClassicPreview.jsx
│   ├── RoyalKhmerPreview.jsx
│   ├── VintageGoldPreview.jsx
│   └── MyNewPreview.jsx        ← បង្កើតថ្មី
└── templates.css
```

---

## 🎨 ពណ៌ ៥ ដែលត្រូវកំណត់

| Key     | ការពិពណ៌នា              | ឧទាហរណ៍     |
|---------|------------------------|-------------|
| `bg`    | ផ្ទៃខាងក្រោយ            | `#f6efe4`   |
| `paper` | ពណ៌ក្រដាស/section       | `#fffaf1`   |
| `color` | ពណ៌មាស/accent ចម្បង     | `#c8a35f`   |
| `accent`| ពណ៌អក្សររង              | `#6f4d24`   |
| `dark`  | ពណ៌អក្សរចម្បង           | `#21180f`   |

---

## ✅ បន្ទាប់ពីបន្ថែម

កាតថ្មីនឹងបង្ហាញដោយស្វ័យប្រវត្តិនៅ:
- `/templates` — ក្នុង grid
- `/templates/my-new` — ទំព័រ demo ជាមួយស៊ុមទូរស័ព្ទ
- `/templates/my-new/preview` — មើលពេញអេក្រង់

---

## 🎬 របៀបប្តូរវីដេអូ

វីដេអូឥឡូវកំណត់ **ក្នុង template នីមួយៗ** ដោយប្រើ field `video` ក្នុង `templatesData.js`:

```js
{
    id: "royal",
    video: vdoCurtain,    // ← ប្តូរវីដេអូនៅទីនេះ
    ...
}
```

### វីដេអូដែលមានស្រាប់:

```
src/assets/vdo-open-then-show-wedding/
├── curtain-video-BAKLj3Y5.mp4      ← vdoCurtain
├── hero-phone.webm                  ← vdoHeroPhone
├── intro-video-BpkZMtTn.mov        ← vdoIntro
├── mediterranean-preview.mp4        ← vdoMediterranean
└── theme-finca.mov                  ← vdoFinca
```

### របៀបប្តូរ:

1. បើកឯកសារ `features/templates/data/templatesData.js`
2. រកកាតដែលចង់ប្តូរ (ឧ. `id: "royal"`)
3. ប្តូរ `video: vdoCurtain` ទៅវីដេអូផ្សេង (ឧ. `video: vdoHeroPhone`)

### បន្ថែមវីដេអូថ្មី:

1. ដាក់វីដេអូក្នុង `src/assets/vdo-open-then-show-wedding/`
2. បន្ថែម import ក្នុង `templatesData.js`:
   ```js
   import vdoMyNew from "../../../assets/vdo-open-then-show-wedding/my-new-video.mp4";
   ```
3. ប្រើវាក្នុង template: `video: vdoMyNew`

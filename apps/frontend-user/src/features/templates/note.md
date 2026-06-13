# 🃏 របៀបបន្ថែមកាតគំរូថ្មី (How to Add a New Template Card)

> ស្ថាបត្យកម្មថ្មី៖ គ្រប់កាតគំរូទាំងអស់ប្រើ **engine តែមួយ** គឺ
> `template-experience/`។ មិនមាន folder `previews/` ឬ field `Preview` ទៀតទេ។
> បច្ចុប្បន្ន catalog ប្រើតែ **Garden Royal Khmer Wedding** template មួយ។

---

## ស្ថាបត្យកម្ម (Architecture)

```
TemplateExperience  (engine តែមួយ៖ hero, message, couple, countdown, story,
        │            schedule, venue, gallery, party, dress, gift, faq, rsvp, footer)
        │
        └── variant ──► garden-royal-khmer-wedding
```

engine តែមួយនេះត្រូវបាន render នៅ ៣ កន្លែង៖

| កន្លែង                    | Route                     | File                                            |
|---------------------------|---------------------------|-------------------------------------------------|
| ទំព័រ demo សាធារណៈ        | `/templates/:id`          | `pages/marketing/TemplateDemoPage.jsx`          |
| ទំព័រ demo ក្នុង dashboard | `/templates/browse/:id`   | `pages/host/templates/HostTemplateDemoPage.jsx` |
| Live preview (phone frame) | (ក្នុង wedding builder)   | `features/wedding-builder/components/PhonePreview.jsx` |

- `/templates`         → បង្ហាញ grid នៃកាត (`components/TemplateGrid.jsx`)
- `/templates/browse`  → ទំព័របន្ថែមគំរូ ក្នុង dashboard (`steps/AddTemplateStep.jsx`)

> 🆕 **PhonePreview** ឥឡូវ render `TemplateExperience` ដូចគ្នា (mode `preview`)
> ដោយលែងប្រើ `RoyalInvitation` ទៀតហើយ។ ដូច្នេះ live preview ក្នុង builder
> ត្រូវនឹងកាតដែលបោះផ្សាយ ១០០%។ មើល section «📱 Preview mode» ខាងក្រោម។

---

## ជំហានទី ១ — បន្ថែមទិន្នន័យក្នុង `data/templatesData.js`

បន្ថែម object ថ្មីក្នុង `BASE_TEMPLATES` array (នេះជា source of truth)៖

```js
{
    id: "my-new",                          // URL slug → /templates/my-new
    name: "ឈ្មោះកាត",                       // ឈ្មោះបង្ហាញ (Khmer)
    style: "Style Name",                   // ប្រភេទរចនាបទ (បង្ហាញក្រោមឈ្មោះ)
    category: "modern",                    // "ancient" | "modern" | "contemporary"
    popular: false,                        // true → បង្ហាញស្លាក ✨ ពេញនិយម
    image: "/image/a7.png",                // thumbnail (ដាក់ក្នុង public/image/)
    mainImage: "/facebook/all/03-card/cover-card.jpg",   // រូប hero លើទំព័រ demo
    phoneCoverImage: "/facebook/all/03-card/cover-card.jpg",
    music: { url: musicInstrumental },     // ប្រើ track ដែល import រួចខាងលើ
    groom: "កូនកំលោះ",
    bride: "កូនក្រមុំ",
    dateText: "ថ្ងៃសៅរ៍ ១០ មករា ២០២៧",
    targetDate: "2027-01-10T17:00:00+07:00", // សម្រាប់ countdown
    ceremonyTime: "០៩:០០",
    receptionTime: "១៧:០០",
    venueName: "ឈ្មោះសាល",
    venueAddress: "អាសយដ្ឋាន",
    mapQuery: "អាសយដ្ឋាន Cambodia",         // សម្រាប់ Google Maps (ជម្រើស)
    bg: "#f6efe4",
    paper: "#fffaf1",
    color: "#c8a35f",
    accent: "#6f4d24",
    dark: "#21180f",
    label: "WEDDING INVITATION",
    description: "ការពិពណ៌នាខ្លីអំពីកាត។",
}
```

➡️ ភ្លាមៗ ទំព័រ `/templates/my-new` នឹងដំណើរការ (render ពេញលេញ
ដោយ variant default = `garden-royal-khmer-wedding`)។

### 🖼️ រូបភាពផ្ទាល់របស់កាត (gallery + story)

កាតនីមួយៗ map ទៅ folder រូបភាពមួយ (`/facebook/all/NN-card/`) តាមរយៈ
`TEMPLATE_MEDIA_GROUP_BY_ID` ក្នុង `templatesData.js`។ មុខងារ `withTemplateMedia`
បង្កើត field `storyCards` និង `storyImages` ដោយស្វ័យប្រវត្តិ។

> ⚠️ section **gallery (អនុស្សាវរីយ៍ស្នេហា)** និង **story (ដំណើរនៃក្ដីស្រឡាញ់)**
> ប្រើតែរូបភាព **ផ្ទាល់** របស់កាតនោះ (មិនលាយ folder ផ្សេង)។ logic នេះនៅក្នុង
> `templateExperienceContent.js` (`buildGallery` / `buildStory` →
> `getTemplateOwnImages`)។ បើកាតគ្មាន media វា fallback ទៅ DEMO។

---

## ជំហានទី ២ — បង្ហាញកាតក្នុង grid (`components/TemplateGrid.jsx`)

grid បង្ហាញតែ id ដែលនៅក្នុង `FEATURED_TEMPLATE_IDS`។ បន្ថែម id របស់អ្នក៖

```js
const FEATURED_TEMPLATE_IDS = [
    "garden-royal-khmer-wedding",
];
```

(ជម្រើស) កំណត់រូប cover ច្បាស់លាស់ — បើមិនកំណត់ វានឹងប្រើ `t.image`៖

```js
const TEMPLATE_CARD_COVER = {
    // ...
    "my-new": "/facebook/all/03-card/cover-card.jpg",
};
```

---

## ជំហានទី ៣ — ជ្រើសរចនាបថ (variant) ក្នុង `template-experience/templateExperienceThemes.js`

កំណត់ថា ទំព័រ demo ប្រើ look របស់ template ដែលរក្សាទុកតែមួយ៖

```js
export const TEMPLATE_VARIANT_BY_ID = {
    "garden-royal-khmer-wedding": "garden-royal-khmer-wedding",
};
```

បើរំលងជំហាននេះ វានឹងប្រើ `garden-royal-khmer-wedding` ដោយស្វ័យប្រវត្តិ។

---

## 📱 Preview mode (live preview ក្នុង phone frame)

`TemplateExperience` ទទួល prop `preview` (boolean)៖

```jsx
<TemplateExperience tpl={tpl} variant={variant} useTemplateLink={link} preview />
```

នៅពេល `preview` = `true`៖

- លាក់ **chrome** ទាំងអស់៖ breadcrumb, ប៊ូតុង CTA, sticky bar, floating music។
- បន្ថែម class `tx-root--preview` លើ root។
- CSS ប្រើ **container query units (`cqw`)** ជំនួស `vw` ដើម្បីឲ្យ font និង spacing
  scale ទៅតាមទទឹង **phone frame** (មិនមែន viewport ពិត)។ logic នេះនៅ block
  «PREVIEW MODE» ខាងចុង `template-experience.css`។

`PhonePreview.jsx` បញ្ចូលទិន្នន័យ draft (groom/bride/date/venue/story/dressCode/
music/gallery) ទៅក្នុង `tpl` object រួច render engine ក្នុង mode preview។ រូបភាព
ដែល user upload (IndexedDB) ត្រូវប្រើជា gallery + story; បើគ្មាន → ប្រើរូបកាត។

> បើបន្ថែម section ថ្មីដែលប្រើ `vw` ច្រើន សូមបន្ថែម override `cqw` ក្នុង block
> «PREVIEW MODE» ដើម្បីកុំឲ្យ overflow ក្នុង phone frame។

---

## 🎨 ការបង្កើត variant ថ្មីទាំងស្រុង (ស្រេចចិត្ត)

បើចង់បាន look ថ្មីដែលមិនទាន់មាន៖

1. បន្ថែម entry ក្នុង `TEMPLATE_VARIANTS` (file `templateExperienceThemes.js`)
   ជាមួយ `className`, `mood`, `badge`, `amp`, `dressColors`។
2. បន្ថែម block CSS ក្នុង `template-experience/template-experience.css`៖

```css
.template-experience--my-style {
    --tpl-bg: #...;
    --tpl-surface: #...;
    --tpl-text: #...;
    --tpl-muted: #...;
    --tpl-accent: #...;
    --tpl-accent-dark: #...;
    --tpl-border: rgba(...);
    --tpl-radius: 14px;
    --tpl-footer-bg: #...;
    --tpl-footer-accent: #...;
}
```

---

## 📂 រចនាសម្ព័ន្ធឯកសារ

```
features/templates/
├── components/
│   └── TemplateGrid.jsx            ← បញ្ជីកាត (grid) + FEATURED_TEMPLATE_IDS
├── data/
│   └── templatesData.js            ← ទិន្នន័យកាត + media-group mapping
├── template-experience/            ← engine តែមួយសម្រាប់គ្រប់កាត
│   ├── TemplateExperience.jsx      ← orchestrator (+ prop `preview`)
│   ├── templateExperienceContent.js ← បង្កើត content model (+ copy តាម variant,
│   │                                  buildGallery / buildStory ប្រើរូបផ្ទាល់កាត)
│   ├── templateExperienceThemes.js  ← variant + ការ map id→variant + aliases
│   ├── TemplateReveal.jsx
│   ├── template-experience.css     ← base + variant themes + PREVIEW MODE
│   ├── controls/
│   │   ├── TemplateMusicControl.jsx
│   │   └── TemplateStickyCta.jsx
│   └── sections/
│       ├── TemplateHero.jsx        TemplateMessage.jsx   TemplateCouple.jsx
│       ├── TemplateCountdown.jsx   TemplateStory.jsx     TemplateSchedule.jsx
│       ├── TemplateVenue.jsx       TemplateGallery.jsx   TemplateParty.jsx
│       ├── TemplateDressCode.jsx   TemplateGift.jsx      TemplateFaq.jsx
│       └── TemplateRsvp.jsx        TemplateFooter.jsx
└── templates.css                   ← style សម្រាប់ grid (.tp-*)
```

ឯកសារ render engine នៅខាងក្រៅ feature៖

```
pages/marketing/TemplateDemoPage.jsx          ← /templates/:id (សាធារណៈ)
pages/host/templates/HostTemplateDemoPage.jsx  ← /templates/browse/:id (dashboard)
features/wedding-builder/components/PhonePreview.jsx ← live preview (mode preview)
```

---

## 🎨 ពណ៌ ៥ ដែលត្រូវកំណត់ក្នុង templatesData.js

| Key      | ការពិពណ៌នា          | ឧទាហរណ៍   |
|----------|---------------------|-----------|
| `bg`     | ផ្ទៃខាងក្រោយ        | `#f6efe4` |
| `paper`  | ពណ៌ក្រដាស/section   | `#fffaf1` |
| `color`  | ពណ៌មាស/accent ចម្បង | `#c8a35f` |
| `accent` | ពណ៌អក្សររង          | `#6f4d24` |
| `dark`   | ពណ៌អក្សរចម្បង       | `#21180f` |

> ចំណាំ៖ ពណ៌ visual ពិតប្រាកដនៃទំព័រ demo គ្រប់គ្រងដោយ **variant theme**
> (CSS variables ក្នុង `template-experience.css`) មិនមែនដោយ field ទាំងនេះទេ។
> Field ទាំងនេះនៅប្រើសម្រាប់ thumbnail/legacy។

---

## ✅ បន្ទាប់ពីបន្ថែម

- `/templates`              → កាតបង្ហាញក្នុង grid (បន្ទាប់ពីជំហានទី ២)
- `/templates/my-new`       → ទំព័រ demo ពេញលេញ (បន្ទាប់ពីជំហានទី ១)
- `/templates/browse/my-new`→ ទំព័រ demo ក្នុង dashboard (បើ map ក្នុង AddTemplateStep)
- ប៊ូតុង «ប្រើគំរូនេះ»       → `/create/wedding?template=my-new`

---

## 🎵 តន្ត្រី (Music)

តន្ត្រីកំណត់ក្នុង template នីមួយៗ ដោយ field `music`៖

```js
{ id: "my-new", music: { url: musicInstrumental }, ... }
```

track ដែល import រួចក្នុង `templatesData.js`៖ `musicInstrumental`,
`musicThae`, `musicSneha`, `musicDrunk2` (និង `musicThousandYears` =
alias នៃ `musicInstrumental`)។ បន្ថែម track ថ្មី៖

```js
import musicMyNew from "../../../assets/music/my-new.mp3";
// ... រួចប្រើ៖ music: { url: musicMyNew }
```

> Music control លាក់ក្នុង mode `preview` ហើយ **មិន autoplay** ឡើយ (ចាប់ផ្ដើម
> លេងតែពេល user ចុច) ដើម្បីគោរព browser autoplay policy។

---

## 🎬 វីដេអូ (Video)

field `video` នៅមានក្នុង data ប៉ុន្តែ **វីដេអូបច្ចុប្បន្នត្រូវបានបិទ**
(`vdoCurtain` ។ល។ កំណត់ជា `null` ហើយ import ត្រូវ comment ចេញ)។
បើចង់បើកឡើងវិញ៖ uncomment import នៅខាងលើ `templatesData.js`។

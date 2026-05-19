# 📱 ការបង្ហាញកាតក្នុងស៊ុមទូរស័ព្ទ (PhonePreview)

## 📍 ទិដ្ឋភាពទូទៅ

`PhonePreview.jsx` គឺជា **live preview** របស់កាតអាពាហ៍ពិពាហ៍ ដែលបង្ហាញនៅផ្នែកខាងស្តាំនៃ Wedding Builder។ វាបង្ហាញពិតប្រាកដនូវអ្វីដែលអ្នកប្រើនឹងឃើញនៅពេលបោះផ្សាយ ប៉ុន្តែក្នុងស៊ុមទូរស័ព្ទតូច។

---

## 🎯 មុខងារសំខាន់

1. ✅ **Live preview** — ប្តូរភ្លាមៗពេលអ្នកប្រើបំពេញ form
2. 🖼️ **ផ្ទុករូបពី IndexedDB** — gallery images/videos
3. ⏱️ **Countdown** — ត្រឹមត្រូវតាមកាលបរិច្ឆេទ និងម៉ោង
4. 🎨 **Theme** — ប្រើពណ៌តាម template ដែលជ្រើស

---

## 📂 ឯកសារពាក់ព័ន្ធ

```
components/PhonePreview.jsx
   ↓ ប្រើ
features/wedding-site/RoyalInvitation.jsx       ← កាតពិត
features/wedding-site/hooks/useCountdown.js     ← countdown timer
features/templates/data/templatesData.js        ← template data
services/galleryStorage.js                      ← រូបភាព gallery
```

---

## 🧩 ការពន្យល់ Code

### 1. ផ្ទុកគំរូ (template) មូលដ្ឋាន

```jsx
const baseTpl = getTemplateById(draft?.templateId) || {};
```

- ទាញ template ពី `templatesData.js` តាម ID ដែលជ្រើស
- បើគ្មាន → return object ទទេ

---

### 2. ផ្ទុក Gallery ពី IndexedDB

```jsx
const [gallery, setGallery] = useState(null);

useEffect(() => {
    if (!draft?.id) {
        setGallery([]);
        return;
    }
    loadGallery(draft.id)
        .then((items) => setGallery(items))
        .catch(() => setGallery([]));
}, [draft?.id, draft?.galleryUpdatedAt]);
```

**ហេតុអ្វីប្រើ IndexedDB?**
- localStorage មាន limit 5MB → តូចពេក
- IndexedDB អាចផ្ទុក 100+ MB → គ្រប់គ្រាន់សម្រាប់រូបភាព

**Re-fetch ពេលណា?**
- `draft.id` ប្តូរ → draft ផ្សេង
- `draft.galleryUpdatedAt` ប្តូរ → អ្នកប្រើ upload រូបថ្មី

---

### 3. គណនា targetDate សម្រាប់ Countdown

```jsx
const targetDate = draft?.event?.date
    ? new Date(`${draft.event.date}T${draft.event.ceremonyTime || "17:00"}:00`)
    : baseTpl.targetDate;
const countdown = useCountdown(targetDate);
```

- បើអ្នកប្រើបំពេញ date → ប្រើ date នោះ
- បើមិនទាន់ → ប្រើ default ពី template
- `useCountdown` ប្រគល់ object `{d, h, m, s}` ដែល update រាល់ ១ វិនាទី

---

### 4. បំលែង Gallery ទៅ Story Images

```jsx
const classNames = ["tpl-gallery-a", "tpl-gallery-b", "tpl-gallery-c", "tpl-gallery-d"];
const storyImages = (gallery && gallery.length > 0)
    ? gallery.map((item, i) => ({
        id: item.id,
        src: item.preview,    // base64 ឬ blob URL
        alt: item.name,
        type: item.type,      // "image" ឬ "video"
        className: classNames[i % classNames.length],
    }))
    : baseTpl.storyImages;    // បើគ្មាន gallery → ប្រើ default
```

CSS classes (`tpl-gallery-a/b/c/d`) កំណត់ទីតាំង grid នៃរូបភាពនៅក្នុងកាត។

---

### 5. បង្កើត `tpl` object ឲ្យ RoyalInvitation

```jsx
const tpl = {
    ...baseTpl,                                          // ចាប់ផ្តើមពី template default
    groom: draft?.couple?.groom || baseTpl.groom,        // override ដោយ user data
    bride: draft?.couple?.bride || baseTpl.bride,
    dateText: draft?.event?.date || baseTpl.dateText,
    targetDate,
    ceremonyTime: draft?.event?.ceremonyTime || baseTpl.ceremonyTime,
    receptionTime: draft?.event?.receptionTime || baseTpl.receptionTime,
    venueName: draft?.event?.venueName || baseTpl.venueName,
    venueAddress: draft?.event?.venueAddress || baseTpl.venueAddress,
    story: draft?.story || baseTpl.story,
    storyImages,
};
```

**លំនាំ "fallback"**: បើ user មិនទាន់បំពេញ → បង្ហាញ default ពី template។

---

### 6. ការ Render

```jsx
return (
    <div className="wb-phone-preview">
        <div className="wb-phone-frame">          {/* ស៊ុមទូរស័ព្ទ */}
            <div className="wb-phone-scroll">     {/* scroll container */}
                {gallery === null ? (
                    <div>កំពុងផ្ទុក...</div>
                ) : (
                    <RoyalInvitation tpl={tpl} countdown={countdown} mode="phone" />
                )}
            </div>
        </div>
    </div>
);
```

**ស្ថានភាព ៣ យ៉ាង**:
1. `gallery === null` → កំពុងផ្ទុក → បង្ហាញ "កំពុងផ្ទុក..."
2. `gallery === []` → គ្មានរូបភាព → ប្រើ default
3. `gallery.length > 0` → មានរូបភាព → ប្រើ user images

---

## 🎨 រចនាបទ (CSS)

នៅក្នុង `builder.css`:

```css
.wb-phone-frame {
    /* ស៊ុមទូរស័ព្ទពណ៌ខ្មៅ មាន rounded corners */
    border: 12px solid #1a1a1a;
    border-radius: 36px;
    width: 320px;
    height: 640px;
}

.wb-phone-scroll {
    /* container ខាងក្នុងដែលអាច scroll បាន */
    overflow-y: auto;
    height: 100%;
    border-radius: 24px;
}
```

---

## 🔄 Performance Considerations

### Re-render Optimization

`PhonePreview` re-render ពេល:
- `draft` ប្តូរ (props) → ត្រូវការ
- `gallery` ប្តូរ (state) → ត្រូវការ
- `countdown` ប្តូរ (1 វិនាទីម្តង) → អាចមានបញ្ហា!

**ដំណោះស្រាយដែលអាច** (មិនទាន់អនុវត្ត):
- ប្រើ `React.memo` លើ `RoyalInvitation`
- បំបែក countdown ទៅ component ផ្សេង

### Gallery Loading

ពេល `draft.id` ប្តូរ ឬ `galleryUpdatedAt` ប្តូរ → fetch ម្តងទៀត។
- ប្រើ debounce (មិនទាន់មាន) ដើម្បីកុំឲ្យ fetch ច្រើនពេក
- ឬ cache លទ្ធផល

---

## 🐛 Bug ដែលអាចកើតឡើង

### 1. រូបភាពមិនបង្ហាញ
- ពិនិត្យ `draft.id` មាន?
- ពិនិត្យ console log: `"PhonePreview: loaded X gallery items for ..."`
- បើក DevTools → Application → IndexedDB → `koupreng_gallery` → `items`

### 2. Countdown មិនត្រឹមត្រូវ
- ពិនិត្យទម្រង់ `draft.event.date` (ត្រូវ "YYYY-MM-DD")
- ពិនិត្យ `ceremonyTime` (ត្រូវ "HH:MM")
- ប្រសិនបើ date មានរួចហើយ → ប្រើ Phnom Penh timezone (+07:00)

### 3. Theme ពណ៌មិនត្រូវ
- ពិនិត្យ `draft.templateId` និង CSS variables (`--tpl-bg`, `--tpl-color`, ...)
- មើល `RoyalInvitation.jsx` ផ្នែក `style={{ "--tpl-bg": ... }}`

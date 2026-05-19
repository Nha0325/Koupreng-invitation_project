# 📅 ដំណាក់កាល "ព័ត៌មានពិធី" (EventInfoStep)

## 📍 ទិដ្ឋភាពទូទៅ

ឯកសារនេះពន្យល់ពី **ដំណាក់កាលទី ៣** នៃ Wedding Builder — អ្នកប្រើបំពេញ:
- 📆 កាលបរិច្ឆេទ
- ⏰ ម៉ោងពិធី និងម៉ោងពិសាភោជនាហារ
- 🏛️ ឈ្មោះសាល
- 📍 អាសយដ្ឋាន

---

## 📂 ឯកសារពាក់ព័ន្ធ

| ឯកសារ | មុខងារ |
|--------|--------|
| `EventInfoStep.jsx` | UI ដំណាក់កាល |
| `shared/ui/DatePicker.jsx` | Picker កាលបរិច្ឆេទខ្មែរ |
| `shared/ui/TimePicker.jsx` | Picker ម៉ោងខ្មែរ |
| `shared/ui/VenuePicker.jsx` | Autocomplete សាលមង្គល |

---

## 🧩 ការបំបែករបស់ `EventInfoStep.jsx`

```jsx
export default function EventInfoStep({ draft, updateField }) {
    const e = draft.event;  // shortcut ទៅ event object
    return (
        <div>
            <h2>3. ព័ត៌មានពិធី</h2>
            <p className="wb-help">បំពេញកាលបរិច្ឆេទ ពេលវេលា និងទីកន្លែង។</p>
            ...
        </div>
    );
}
```

**Props**:
- `draft` — draft បច្ចុប្បន្ន
- `updateField(section, patch)` — function update

---

## 📝 Field នីមួយៗ

### 1. កាលបរិច្ឆេទ (DatePicker)

```jsx
<DatePicker
    value={e.date}                           // "2026-12-19"
    onChange={(val) => updateField("event", { date: val })}
    placeholder="ជ្រើសកាលបរិច្ឆេទ"
/>
```

**របៀបដំណើរការ DatePicker**:
- បង្ហាញប្រតិទិនជាភាសាខ្មែរ
- ខែ: មករា, កុម្ភៈ, មីនា, មេសា, ឧសភា, មិថុនា, កក្កដា, សីហា, កញ្ញា, តុលា, វិច្ឆិកា, ធ្នូ
- ថ្ងៃ: អា, ច, អ, ព, ព្រ, សុ, ស (អាទិត្យ → សៅរ៍)
- ប្រគល់ string ទម្រង់ `"YYYY-MM-DD"`
- មានប៊ូតុង "ថ្ងៃនេះ" និង "បោះបង់"

---

### 2. ពេលវេលាពិធី (TimePicker)

```jsx
<TimePicker
    value={e.ceremonyTime}
    onChange={(val) => updateField("event", { ceremonyTime: val })}
    placeholder="ជ្រើសម៉ោងពិធី"
/>
```

មាន ២ field:
- `ceremonyTime` — ម៉ោងពិធីសូត្រមន្ត
- `receptionTime` — ម៉ោងពិសាភោជនាហារ

---

### 3. ឈ្មោះសាល (VenuePicker)

```jsx
<VenuePicker
    value={e.venueName}
    onChange={(val) => updateField("event", { venueName: val })}
    onSelect={(venue) => updateField("event", {
        venueName: venue.name,
        venueAddress: venue.address  // បំពេញ address ស្វ័យប្រវត្តិ!
    })}
    placeholder="សាលមង្គល..."
/>
```

**របៀបដំណើរការ VenuePicker**:
1. មានបញ្ជី venues នៅកម្ពុជា ~25+ កន្លែង (បាត់ដំបង, ភ្នំពេញ, សៀមរាប, ...)
2. អ្នកប្រើវាយឈ្មោះ → ស្រាវជ្រាវ name/city/address
3. បង្ហាញ suggestions ទម្រង់ dropdown (max 8)
4. ចុចលើ suggestion → បំពេញ name **និង** address ស្វ័យប្រវត្តិ

**ឧទាហរណ៍ venue**:
```js
{
    name: "សាលមង្គលការ កោះពេជ្រ",
    address: "ផ្លូវ ៣៧៦ សង្កាត់បឹងកេងកង ភ្នំពេញ",
    city: "ភ្នំពេញ"
}
```

---

### 4. អាសយដ្ឋាន (textarea)

```jsx
<textarea
    rows={3}
    value={e.venueAddress}
    onChange={(ev) => updateField("event", { venueAddress: ev.target.value })}
    placeholder="ផ្លូវ ៥២០ ក្រុងបាត់ដំបង..."
/>
```

- បើជ្រើសរើស venue ពី VenuePicker → field នេះបំពេញដោយស្វ័យប្រវត្តិ
- អ្នកប្រើនៅអាចកែបាន

---

## 🔁 លំហូរទិន្នន័យ

```
អ្នកប្រើបំពេញ field
   ↓
updateField("event", { ... })
   ↓
useWeddingBuilder ប្តូរ state draft
   ↓
useEffect → saveDraft(draft) → localStorage
   ↓
PhonePreview re-render → បង្ហាញ live
```

---

## 💡 Tips ការបំពេញ

| Field | ទម្រង់ | ឧទាហរណ៍ |
|-------|--------|---------|
| `date` | YYYY-MM-DD | "2026-12-19" |
| `ceremonyTime` | HH:MM | "09:00" |
| `receptionTime` | HH:MM | "17:00" |
| `venueName` | text | "សាលមង្គលការ កោះពេជ្រ" |
| `venueAddress` | multiline text | "ផ្លូវ ៣៧៦\nភ្នំពេញ" |

---

## 🎨 ស្រាល់ Validation

បច្ចុប្បន្ន **គ្មាន validation**។ ដើម្បីបន្ថែម:

```jsx
const isValid = e.date && e.ceremonyTime && e.venueName;

{!isValid && (
    <p className="wb-error">សូមបំពេញកាលបរិច្ឆេទ ម៉ោង និងសាល</p>
)}
```

ឬប្រើ library ដូចជា `react-hook-form` ឬ `zod`។

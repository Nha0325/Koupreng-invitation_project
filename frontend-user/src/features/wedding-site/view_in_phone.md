# 📱 ការបង្ហាញកាតពេញលេញ (RoyalInvitation)

## 📍 ទិដ្ឋភាពទូទៅ

`RoyalInvitation.jsx` គឺជា **component សំខាន់បំផុត** នៃកម្មវិធី — វាគឺជា **កាតអាពាហ៍ពិពាហ៍ពិតប្រាកដ** ដែលអ្នកទស្សនានឹងឃើញ។

វាប្រើនៅកន្លែងទាំង ៣:
1. **TemplateDemoPage** — preview នៃ template (mode: phone)
2. **WeddingSite** — public page (mode: full)
3. **PhonePreview** — live preview ក្នុង builder (mode: phone)

---

## 🎬 រចនាសម្ព័ន្ធ (Sections)

កាតមាន **៨ sections** តម្រៀបពីលើទៅក្រោម:

```
┌─────────────────────────────────┐
│ 1. Cover (Hero)                 │ ← video + ឈ្មោះគូ + តន្ត្រី
│    ✦ Names: ប្រុស & ស្រី          │
│    ✦ Date                       │
│    ✦ Music button                │
├─────────────────────────────────┤
│ 2. Intro (សូមអញ្ជើញ)            │
├─────────────────────────────────┤
│ 3. Schedule (កម្មវិធី)          │
│    ✦ ម៉ោងពិធី + ម៉ោងពិសា         │
│    ✦ Countdown (ថ្ងៃ ម៉ោង នាទី វិ.) │
├─────────────────────────────────┤
│ 4. Venue (ទីតាំង)               │
│    ✦ ឈ្មោះសាល + អាសយដ្ឋាន       │
│    ✦ Google Maps embed          │
├─────────────────────────────────┤
│ 5. Gallery (រូបភាព)             │
├─────────────────────────────────┤
│ 6. Dress Code                   │
│    ✦ ពណ៌ក្រមុំ មាស ស ត្នោត      │
├─────────────────────────────────┤
│ 7. RSVP                         │
│    ✦ ឈ្មោះ + ចំនួនភ្ញៀវ          │
├─────────────────────────────────┤
│ 8. Footer                       │
└─────────────────────────────────┘
```

---

## 🔧 Props

```js
RoyalInvitation({
    tpl,              // template + user data (ដូច baseTpl ជាមួយ overrides)
    countdown,        // {d, h, m, s} ពី useCountdown
    mode = "full",    // "full" ឬ "phone"
    autoPlay = false  // បើក music ស្វ័យប្រវត្តិ?
})
```

### `tpl` Object

```js
{
    id, name, style,
    groom, bride,
    dateText,             // "ថ្ងៃសៅរ៍ ១៩ ធ្នូ ២០២៦"
    ceremonyTime,         // "០៩:០០"
    receptionTime,        // "១៧:០០"
    venueName,            // "សាលមង្គល..."
    venueAddress,         // multiline
    mapQuery,             // optional, បើគ្មាន ប្រើ "name + address"
    storyImages,          // [{ src, alt, className, type }]
    bg, paper, color, accent, dark  // ពណ៌ theme
}
```

---

## ⚙️ State & Refs

```jsx
const [guestName, setGuestName] = useState("");
const [guestCount, setGuestCount] = useState("2");
const [rsvpSent, setRsvpSent] = useState(false);
const [isMusicPlaying, setIsMusicPlaying] = useState(false);
const [introDone, setIntroDone] = useState(false);

const rootRef = useRef(null);              // root element
const audioRef = useRef(null);             // audio tag
const nameRef = useRef(null);              // input ឈ្មោះ
const autoPlayTriggeredRef = useRef(false);// ការពារ autoplay ច្រើនដង
```

---

## 🎵 Music Player

```jsx
<audio
    ref={audioRef}
    src={weddingMusicUrl}
    loop
    preload="metadata"
    onPlay={() => setIsMusicPlaying(true)}
    onPause={() => setIsMusicPlaying(false)}
/>
```

**ប៊ូតុង Music**:
```jsx
<button onClick={toggleMusic}>
    {isMusicPlaying ? "បិទតន្ត្រី" : "បើកតន្ត្រី"}
</button>
```

**Autoplay** (ពេលបើកកាតពី demo page):
```jsx
useEffect(() => {
    if (!autoPlay || autoPlayTriggeredRef.current) return;
    audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(() => {});
}, [autoPlay]);
```
- Browser អាច block autoplay → catch error ហើយឲ្យ user ចុចដោយដៃ

---

## 🎬 Hero Video

```jsx
<video
    src={heroVideoUrl}
    autoPlay loop muted playsInline
/>
```

ប្រើ video ជា background ខាងលើ ៧ វិនាទីដំបូង បន្ទាប់មក fade in name cards។

```jsx
useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 2000);
    return () => clearTimeout(timer);
}, [tpl.id, mode]);
```

CSS class `intro-active` / `intro-done` ត្រូវបានប្តូរ → animation ប្រើ `transition`។

---

## 🎨 Animation On Scroll

កាតមាន **animation reveal** ពេល scroll មកដល់៖

```jsx
useEffect(() => {
    const targets = root.querySelectorAll("[data-ri-animate]");

    // ប្រសិនបើអ្នកប្រើបិទ animation
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        targets.forEach((t) => t.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
    });

    targets.forEach((t, i) => {
        t.style.setProperty("--tpl-animate-index", String(i % 8));
        observer.observe(t);
    });

    return () => observer.disconnect();
}, [mode, tpl.id]);
```

**របៀបដំណើរការ**:
1. រក DOM elements ដែលមាន attribute `data-ri-animate`
2. ប្រើ `IntersectionObserver` → ពេលឃើញលើអេក្រង់ → បន្ថែម class `is-visible`
3. CSS ប្រើ `transition` ពី `opacity: 0` ទៅ `opacity: 1`
4. `--tpl-animate-index` → delay បន្តិចបន្តួចសម្រាប់ stagger effect

---

## 🗺️ Google Maps

```jsx
const mapSearchText = tpl.mapQuery || `${tpl.venueName} ${tpl.venueAddress}`;
const mapQuery = encodeURIComponent(mapSearchText.replace(/\s+/g, " ").trim());
const mapSrc = `https://www.google.com/maps?q=${mapQuery}&output=embed`;
const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
```

- `mapSrc` → embed iframe
- `mapLink` → link បើកក្នុង Google Maps app

---

## 📝 RSVP Form

```jsx
{!rsvpSent ? (
    <div className="tpl-ri-rsvp-form">
        <input
            ref={nameRef}
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="ឈ្មោះភ្ញៀវ"
        />
        <select value={guestCount} onChange={(e) => setGuestCount(e.target.value)}>
            <option value="1">ភ្ញៀវ ១ នាក់</option>
            <option value="2">ភ្ញៀវ ២ នាក់</option>
            ...
        </select>
        <button onClick={submitRSVP}>បញ្ជាក់ការចូលរួម</button>
    </div>
) : (
    <div>បានទទួលការឆ្លើយតបរបស់ {guestName} សម្រាប់ភ្ញៀវ {guestCount} នាក់។</div>
)}
```

**Validation**:
```js
const submitRSVP = () => {
    if (!guestName.trim()) {
        nameRef.current?.focus();  // focus ត្រឡប់ទៅ input
        return;
    }
    setRsvpSent(true);
};
```

⚠️ **កំណត់ត្រា**: បច្ចុប្បន្ន RSVP មិនទាន់ផ្ញើទៅ server — គ្រាន់តែបង្ហាញសារ "បានទទួល" ម្ខាង។

---

## 🎨 Theme Variables (CSS)

ពណ៌ត្រូវបាន inject តាម inline style:

```jsx
<article
    style={{
        "--tpl-bg": tpl.bg,        // background ទូទៅ
        "--tpl-paper": tpl.paper,  // ផ្ទៃកាត
        "--tpl-gold": tpl.color,   // ពណ៌សំខាន់ (មាស, ស្វាយ, ...)
        "--tpl-accent": tpl.accent,
        "--tpl-dark": tpl.dark,
    }}
>
```

ហើយ CSS ប្រើ:
```css
.tpl-ri-section {
    background: var(--tpl-paper);
    color: var(--tpl-dark);
}
.tpl-ri-kicker {
    color: var(--tpl-gold);
}
```

---

## 🐛 បញ្ហាដែលអាចកើតឡើង

### 1. Music មិនលេង
- Browser block autoplay → user ត្រូវចុចដោយដៃ
- ពិនិត្យ console: "Browser blocked autoplay"

### 2. Animation ស្ងាត់
- ពិនិត្យ `prefers-reduced-motion` setting របស់ user
- ពិនិត្យ DOM មាន `data-ri-animate` attribute

### 3. រូបភាព Gallery មិនបង្ហាញ
- Mode "phone" + គ្មាន storyImages → ប្រើ `defaultStoryImages` (a1.png - a4.png)
- ពិនិត្យថា path នៃរូបភាព exist ក្នុង `public/image/`

### 4. Map មិនលោត
- ពិនិត្យ `mapQuery` ឬ `venueName + venueAddress` មាន?
- ដោយសារ Google Maps embed មិនដំណើរការនៅខ្លះ region → ត្រូវ fallback ទៅ link

---

## 💡 ឧទាហរណ៍ការប្រើប្រាស់

```jsx
// 1. ក្នុង WeddingSite (full mode)
<RoyalInvitation tpl={tpl} countdown={countdown} />

// 2. ក្នុង TemplateDemoPage (phone mode + autoplay)
<RoyalInvitation tpl={tpl} countdown={countdown} mode="phone" autoPlay={isOpened} />

// 3. ក្នុង PhonePreview (phone mode, គ្មាន autoplay)
<RoyalInvitation tpl={tpl} countdown={countdown} mode="phone" />
```

---

## 📊 Class Names សំខាន់ៗ

| Class | មុខងារ |
|-------|--------|
| `tpl-royal-invitation` | root container |
| `is-phone` / `is-full` | mode |
| `intro-active` / `intro-done` | ដំណាក់កាល intro |
| `tpl-ri-cover` | section cover (hero) |
| `tpl-ri-section` | sections ផ្សេងទៀត |
| `tpl-ri-animate` | element ដែលត្រូវ animate លើ scroll |
| `is-visible` | element កំពុងបង្ហាញ (បន្ទាប់ពី IntersectionObserver) |
| `tpl-ri-audio` | ប៊ូតុង music |
| `is-playing` | កំពុងលេងតន្ត្រី |

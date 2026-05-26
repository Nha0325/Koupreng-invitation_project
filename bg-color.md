# Background Gradient Note

Updated the public page overlay background gradient to use a longer fade:

```css
background: linear-gradient(to bottom, rgba(252, 248, 242, 0.4) 0%, rgba(252, 248, 242, 1) 1000%);
```

Affected pages:

- ទំព័រដើម: `frontend-user/src/pages/marketing/HomePage.jsx`
- គំរូសន្លឹកការ: `frontend-user/src/features/templates/templates.css`
- តម្លៃ: `frontend-user/src/pages/marketing/PricingPage.jsx`
- ទីកន្លែង: `frontend-user/src/pages/marketing/VenuesPage.jsx`

Verification:

- Focused ESLint passed for the modified JSX pages.
- `npm run build` passed in `frontend-user`.

















import W01Preview from "../previews/RoyalPreview";
import W02Preview from "../previews/ModernKhmerPreview";
import W03Preview from "../previews/LuxuryPreview";
import W04Preview from "../previews/ClassicPreview";
import W05Preview from "../previews/RoyalKhmerPreview";
import W06Preview from "../previews/VintageGoldPreview";

// Videos for each template (gate + intro)
import vdoCurtain from "../../../assets/vdo-open-then-show-wedding/curtain-video-BAKLj3Y5.mp4";
import vdoHeroPhone from "../../../assets/vdo-open-then-show-wedding/hero-phone.webm";
import vdoIntro from "../../../assets/vdo-open-then-show-wedding/intro-video-BpkZMtTn.mov";
import vdoMediterranean from "../../../assets/vdo-open-then-show-wedding/mediterranean-preview.mp4";
import vdoFinca from "../../../assets/vdo-open-then-show-wedding/theme-finca.mov";

// Music for each template (background music when invitation opens)
import musicInstrumental from "../../../assets/music/Instrumental Wedding Music (VioSounds Cover).m4a";
import musicThousandYears from "../../../assets/music/A Thousand Years - Christina Perri | Romantic Instrumental Wedding Music (VioSounds Cover).mp3";
import musicThae from "../../../assets/music/Tena - ថែ Thae.mp3";
import musicSneha from "../../../assets/music/2MDIE - SNEHA ft. TEY (DJ Chee remix).mp3";
import musicDrunk2 from "../../../assets/music/YENGKY - DRUNK 2 (យប់ម៉ោងបី) FT KINGTONG [ OFFICIAL MUSIC VIDEO ].mp3";

/**
 * Template categories
 */
export const TEMPLATE_CATEGORIES = [
    { id: "all", label: "ទាំងអស់", labelEn: "All" },
    { id: "ancient", label: "បុរាណ", labelEn: "Ancient" },
    { id: "modern", label: "ទំនើប", labelEn: "Modern" },
    { id: "contemporary", label: "សហសម័យ", labelEn: "Contemporary" },
];

export const TEMPLATES = [
    // ═══════════════════════════════════════════════
    // ANCIENT (បុរាណ) — 10 templates
    // ═══════════════════════════════════════════════
    {
        id: "royal",
        name: "រាជមង្គល",
        style: "Classic Royal Elegance",
        category: "ancient",
        popular: true,
        image: "/image/a1.png",
        video: vdoCurtain,
        music: { url: musicInstrumental },
        Preview: W01Preview,
        groom: "បញ្ញា",
        bride: "ផ្កាយ",
        dateText: "ថ្ងៃសៅរ៍ ១៩ ធ្នូ ២០២៦",
        targetDate: "2026-12-19T17:00:00+07:00",
        ceremonyTime: "០៩:០០",
        receptionTime: "១៧:០០",
        venueName: "គេហដ្ឋាន ខេត្តបាត់ដំបង",
        venueAddress: "ផ្លូវ ៥២០\nក្រុងបាត់ដំបង 02360",
        mapQuery: "ផ្លូវ ៥២០ ក្រុងបាត់ដំបង 02360 Cambodia",
        bg: "#f6efe4",
        paper: "#fffaf1",
        color: "#c8a35f",
        accent: "#6f4d24",
        dark: "#21180f",
        label: "WEDDING INVITATION",
        description: "គំរូអាពាហ៍ពិពាហ៍បែបរាជវង្ស កាតបើកដូចគេហទំព័រ មានផ្នែកអញ្ជើញ កម្មវិធី ទីតាំង រូបភាព និង RSVP។",
    },
    {
        id: "classic",
        name: "មង្គលជ័យ",
        style: "Classic Khmer",
        category: "ancient",
        popular: false,
        image: "/image/a4.png",
        video: vdoMediterranean,
        music: { url: musicSneha },
        Preview: W04Preview,
        groom: "ដារា",
        bride: "មាលា",
        dateText: "ថ្ងៃអាទិត្យ ១៥ មីនា ២០២៦",
        targetDate: "2026-11-15T17:00:00+07:00",
        ceremonyTime: "០៧:៣០",
        receptionTime: "១៧:០០",
        venueName: "សាលមង្គល សេរីសួស្តី",
        venueAddress: "ផ្លូវម៉ៅសេទុង ខណ្ឌចំការមន\nរាជធានីភ្នំពេញ",
        bg: "#fff6f4",
        paper: "#fffafa",
        color: "#dc2626",
        accent: "#7f1d1d",
        dark: "#2d0f0f",
        label: "KHMER WEDDING",
        description: "បែបខ្មែរបុរាណ ប្រើពណ៌ក្រហមនិងមាស សម្រាប់គូដែលចូលចិត្តភាពសាមញ្ញនិងផ្លូវការ។",
    },
    {
        id: "ancient-gold",
        name: "មាសបុរាណ",
        style: "Ancient Gold",
        category: "ancient",
        popular: false,
        image: "/image/a6.png",
        video: vdoCurtain,
        music: { url: musicInstrumental },
        Preview: W06Preview,
        groom: "សុភា",
        bride: "រស្មី",
        dateText: "ថ្ងៃសៅរ៍ ០៧ មីនា ២០២៦",
        targetDate: "2026-03-07T17:00:00+07:00",
        ceremonyTime: "០៨:០០",
        receptionTime: "១៧:០០",
        venueName: "សាលមង្គល ព្រះវិហារ",
        venueAddress: "ខេត្តព្រះវិហារ",
        bg: "#f7f3e8",
        paper: "#fffdf5",
        color: "#b8860b",
        accent: "#5c4306",
        dark: "#1a1200",
        label: "ANCIENT GOLD",
        description: "រចនាបថមាសបុរាណ ស្រស់ស្អាត មានអារម្មណ៍ដូចសម័យអង្គរ។",
    },
    {
        id: "angkor-spirit",
        name: "ព្រលឹងអង្គរ",
        style: "Angkor Spirit",
        category: "ancient",
        popular: true,
        image: "/image/a3.png",
        video: vdoIntro,
        music: { url: musicThae },
        Preview: W03Preview,
        groom: "វិសាល",
        bride: "ចន្នី",
        dateText: "ថ្ងៃអាទិត្យ ១២ មេសា ២០២៦",
        targetDate: "2026-04-12T17:00:00+07:00",
        ceremonyTime: "០៩:០០",
        receptionTime: "១៧:៣០",
        venueName: "សាលមង្គល អង្គរភ្នំពេញ",
        venueAddress: "ផ្លូវព្រះមុនីវង្ស\nរាជធានីភ្នំពេញ",
        bg: "#f5efe6",
        paper: "#fdf8f0",
        color: "#8b6914",
        accent: "#4a3508",
        dark: "#1c1505",
        label: "ANGKOR SPIRIT",
        description: "ស្មារតីអង្គរ រចនាបថបុរាណខ្មែរ មានលម្អិតដូចប្រាសាទ។",
    },
    {
        id: "khmer-silk",
        name: "សូត្រខ្មែរ",
        style: "Khmer Silk",
        category: "ancient",
        popular: false,
        image: "/image/a5.png",
        video: vdoFinca,
        music: { url: musicDrunk2 },
        Preview: W05Preview,
        groom: "ណារិទ្ធ",
        bride: "សុគន្ធា",
        dateText: "ថ្ងៃសៅរ៍ ២៣ ឧសភា ២០២៦",
        targetDate: "2026-05-23T17:00:00+07:00",
        ceremonyTime: "០៧:៣០",
        receptionTime: "១៧:០០",
        venueName: "សាលមង្គល សូត្រមាស",
        venueAddress: "ខណ្ឌទួលគោក\nរាជធានីភ្នំពេញ",
        bg: "#fdf5f0",
        paper: "#fff9f5",
        color: "#a0522d",
        accent: "#5c2d12",
        dark: "#1f0f06",
        label: "KHMER SILK",
        description: "រចនាបថសូត្រខ្មែរ ពណ៌ត្នោតនិងមាស ស្រស់ស្អាតបែបប្រពៃណី។",
    },
    {
        id: "temple-blessing",
        name: "ពរវត្ត",
        style: "Temple Blessing",
        category: "ancient",
        popular: false,
        image: "/image/a1.png",
        video: vdoCurtain,
        music: { url: musicInstrumental },
        Preview: W01Preview,
        groom: "ពិសិដ្ឋ",
        bride: "កល្យាណី",
        dateText: "ថ្ងៃអាទិត្យ ១៤ មិថុនា ២០២៦",
        targetDate: "2026-06-14T17:00:00+07:00",
        ceremonyTime: "០៦:៣០",
        receptionTime: "១១:០០",
        venueName: "វត្តបទុមវតី",
        venueAddress: "ខណ្ឌដូនពេញ\nរាជធានីភ្នំពេញ",
        bg: "#faf5e8",
        paper: "#fffcf2",
        color: "#d4a017",
        accent: "#6b5009",
        dark: "#1e1603",
        label: "TEMPLE BLESSING",
        description: "គំរូពិធីសូត្រមន្តនៅវត្ត បែបបុរាណពេញលេញ។",
    },
    {
        id: "royal-lotus",
        name: "បទ្មរាជ",
        style: "Royal Lotus",
        category: "ancient",
        popular: false,
        image: "/image/a4.png",
        video: vdoMediterranean,
        music: { url: musicThae },
        Preview: W04Preview,
        groom: "រតនៈ",
        bride: "បទ្មា",
        dateText: "ថ្ងៃសៅរ៍ ១១ កក្កដា ២០២៦",
        targetDate: "2026-07-11T17:00:00+07:00",
        ceremonyTime: "០៨:០០",
        receptionTime: "១៧:០០",
        venueName: "សាលមង្គល បទ្មា",
        venueAddress: "ខេត្តកណ្ដាល",
        bg: "#fef5f7",
        paper: "#fff8fa",
        color: "#c41e3a",
        accent: "#6b0f1e",
        dark: "#2a060c",
        label: "ROYAL LOTUS",
        description: "ផ្កាឈូករាជវង្ស ពណ៌ក្រហមនិងមាស បែបបុរាណខ្មែរ។",
    },
    {
        id: "golden-era",
        name: "យុគមាស",
        style: "Golden Era",
        category: "ancient",
        popular: false,
        image: "/image/a6.png",
        video: vdoCurtain,
        music: { url: musicSneha },
        Preview: W06Preview,
        groom: "សុវណ្ណ",
        bride: "រ៉ាណី",
        dateText: "ថ្ងៃអាទិត្យ ០៩ សីហា ២០២៦",
        targetDate: "2026-08-09T17:00:00+07:00",
        ceremonyTime: "០៩:០០",
        receptionTime: "១៧:៣០",
        venueName: "សាលមង្គល យុគមាស",
        venueAddress: "ខេត្តកំពង់ចាម",
        bg: "#f8f2e4",
        paper: "#fffbf0",
        color: "#daa520",
        accent: "#6d5210",
        dark: "#201805",
        label: "GOLDEN ERA",
        description: "យុគសម័យមាស រចនាបថបុរាណដ៏ស្រស់ស្អាត។",
    },
    {
        id: "apsara-dance",
        name: "រាំអប្សរា",
        style: "Apsara Dance",
        category: "ancient",
        popular: false,
        image: "/image/a3.png",
        video: vdoIntro,
        music: { url: musicInstrumental },
        Preview: W03Preview,
        groom: "ចន្ទ្រា",
        bride: "អប្សរា",
        dateText: "ថ្ងៃសៅរ៍ ១៩ កញ្ញា ២០២៦",
        targetDate: "2026-09-19T17:00:00+07:00",
        ceremonyTime: "០៨:៣០",
        receptionTime: "១៧:០០",
        venueName: "សាលមង្គល អប្សរា",
        venueAddress: "ខេត្តសៀមរាប",
        bg: "#f9f3ea",
        paper: "#fefaf2",
        color: "#cd853f",
        accent: "#5c3a1a",
        dark: "#1e1208",
        label: "APSARA DANCE",
        description: "រចនាបថរាំអប្សរា ស្រស់ស្អាតបែបវប្បធម៌ខ្មែរ។",
    },
    {
        id: "naga-blessing",
        name: "នាគពរ",
        style: "Naga Blessing",
        category: "ancient",
        popular: false,
        image: "/image/a5.png",
        video: vdoFinca,
        music: { url: musicThae },
        Preview: W05Preview,
        groom: "នាគ",
        bride: "មេឃលា",
        dateText: "ថ្ងៃអាទិត្យ ១៨ តុលា ២០២៦",
        targetDate: "2026-10-18T17:00:00+07:00",
        ceremonyTime: "០៧:០០",
        receptionTime: "១២:០០",
        venueName: "សាលមង្គល នាគរាជ",
        venueAddress: "ខេត្តបាត់ដំបង",
        bg: "#f0f5e8",
        paper: "#f8fcf2",
        color: "#6b8e23",
        accent: "#354710",
        dark: "#121a06",
        label: "NAGA BLESSING",
        description: "រចនាបថនាគ សម្រាប់ពិធីបែបបុរាណដ៏មានន័យ។",
    },

    // ═══════════════════════════════════════════════
    // MODERN (ទំនើប) — 10 templates
    // ═══════════════════════════════════════════════
    {
        id: "garden",
        name: "បុប្ផាភ្នំពេញ",
        style: "Modern Garden",
        category: "modern",
        popular: false,
        image: "/image/a2.png",
        video: vdoHeroPhone,
        music: { url: musicThousandYears },
        Preview: W02Preview,
        groom: "បញ្ញា",
        bride: "សុដាណា",
        dateText: "ថ្ងៃអាទិត្យ ២០ ធ្នូ ២០២៦",
        targetDate: "2026-12-20T17:00:00+07:00",
        ceremonyTime: "០៨:៣០",
        receptionTime: "១៨:០០",
        venueName: "សួនមង្គល ភ្នំពេញ",
        venueAddress: "ផ្លូវ ៦០ម៉ែត្រ ខណ្ឌមានជ័យ\nរាជធានីភ្នំពេញ",
        bg: "#f6f2ff",
        paper: "#ffffff",
        color: "#8b5cf6",
        accent: "#4c1d95",
        dark: "#211336",
        label: "MODERN CEREMONY",
        description: "រចនាបថសួនផ្កាដែលមានពណ៌ស្រាល និងអារម្មណ៍ទំនើបសម្រាប់គូស្វាមីភរិយាថ្មី។",
    },
    {
        id: "sky",
        name: "ទេវីសួគ៌ា",
        style: "Royal Blue",
        category: "modern",
        popular: false,
        image: "/image/a5.png",
        video: vdoFinca,
        music: { url: musicDrunk2 },
        Preview: W05Preview,
        groom: "វិចិត្រ",
        bride: "ពេជ្រ",
        dateText: "ថ្ងៃសៅរ៍ ២៥ មេសា ២០២៦",
        targetDate: "2026-12-25T18:00:00+07:00",
        ceremonyTime: "០៩:៣០",
        receptionTime: "១៨:០០",
        venueName: "សាលសួគ៌ org Blue Hall",
        venueAddress: "ផ្លូវសហព័ន្ធរុស្ស៊ី\nរាជធានីភ្នំពេញ",
        bg: "#eaf3ff",
        paper: "#f8fbff",
        color: "#f6d98b",
        accent: "#1e3a8a",
        dark: "#0e1d45",
        label: "ROYAL BLUE",
        description: "ពណ៌ org ខៀវរាជវង្សជាមួយលម្អមាស សមសម្រាប់ពិធីដែលចង់បានអារម្មណ org ៍ដាច់ org ដោយឡែក org ។",
    },

























vdoCurtain
https://web.facebook.com/share/p/1BFypBX32r/
https://web.facebook.com/share/v/1N1thCGtic/
https://web.facebook.com/share/r/1CUDTa1AdW/
https://web.facebook.com/share/r/1E58EVy2Ci/
https://web.facebook.com/share/r/1CNPkaiTwE/
==================
image story
https://web.facebook.com/share/p/18vgmZ44p2/
https://web.facebook.com/share/p/1DYXfogcTH/
https://web.facebook.com/share/p/18ccaTpmU5/
https://web.facebook.com/share/p/1HMVoBiqM6/
https://web.facebook.com/share/p/1DpKWgkcPY/
https://web.facebook.com/share/p/1Lreg2kBbF/

https://web.facebook.com/share/p/17Z4n83Neh/
https://web.facebook.com/share/p/1H8fMJzNHK/
https://web.facebook.com/share/p/1FkBpn2jwb/
https://web.facebook.com/pichpiseyvlogger/posts/pfbid02V9NUjkf5SrU9aeaQ7biieKmgWGqVfzKnhcGukT4QSUCJxW7Fz1yBmBBXSBiVsaAbl
https://web.facebook.com/share/p/1EF2Akktw5/

https://web.facebook.com/pichpiseyvlogger/posts/pfbid0YXBjaMo9SsjtaTow5VeQgiqX1RptWtwjFUz6dWuwgkiSnwoiwuHDq11f3Uys6Z1Vl

https://web.facebook.com/share/p/1Nn8vh56X5/
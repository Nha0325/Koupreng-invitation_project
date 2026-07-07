/**
 * templateExperienceContent — builds the full content model for the shared
 * TemplateExperience engine.
 *
 * Strategy (mirrors royalContent.js):
 *  - Always prefer REAL template values from `tpl` when present.
 *  - Fill story / schedule / party / gift / faq with tasteful DEMO content.
 *    This module powers the /templates/* demo pages only. It never writes
 *    fake data back into a user's real invitation.
 *
 * Per-variant copy (message, couple intros, dress note, badge text) lets each
 * style read with its own personality while keeping identical structure.
 */

import { getVariantTheme } from "./templateExperienceThemes";

const DEMO_GALLERY = [
    { src: "/facebook/all/01-card/01-01.jpg", span: "tall" },
    { src: "/facebook/all/02-card/02-01.jpg", span: "wide" },
    { src: "/facebook/all/01-card/01-02.jpg", span: "small" },
    { src: "/facebook/all/03-card/03-01.jpg", span: "small" },
    { src: "/facebook/all/02-card/02-03.jpg", span: "tall" },
    { src: "/facebook/all/01-card/01-03.jpg", span: "small" },
    { src: "/facebook/all/03-card/03-02.jpg", span: "wide" },
    { src: "/facebook/all/02-card/02-05.jpg", span: "small" },
    { src: "/facebook/all/01-card/01-04.jpg", span: "small" },
    { src: "/facebook/all/03-card/03-04.jpg", span: "tall" },
];

const DEMO_STORY = [
    {
        id: "met",
        kicker: "ជំពូកទី ១",
        title: "ថ្ងៃដែលយើងជួបគ្នា",
        date: "មករា ២០២១",
        text: "ក្នុងពិធីបុណ្យមួយនៅទីក្រុង ភ្នែកទាំងពីរបានជួបគ្នាដំបូង ដោយមិននឹកស្មានថានឹងក្លាយជារឿងរ៉ាវមួយជីវិត។",
        image: "/facebook/all/01-card/01-01.jpg",
    },
    {
        id: "first-date",
        kicker: "ជំពូកទី ២",
        title: "ការណាត់ជួបលើកដំបូង",
        date: "មីនា ២០២១",
        text: "កាហ្វេមួយពែង ការសន្ទនាមួយយប់ ហើយយើងដឹងថា នេះគឺជាមនុស្សដែលយើងចង់នៅជាមួយ។",
        image: "/facebook/all/02-card/02-02.jpg",
    },
    {
        id: "proposal",
        kicker: "ជំពូកទី ៣",
        title: "ថ្ងៃសុំដៃ",
        date: "ធ្នូ ២០២៥",
        text: "នៅក្រោមពន្លឺថ្ងៃលិច ជាមួយចិត្តញាប់ញ័រ សំណួរមួយត្រូវបានសួរ ហើយចម្លើយគឺ បាទ/ចាស។",
        image: "/facebook/all/03-card/03-01.jpg",
    },
    {
        id: "wedding",
        kicker: "ជំពូកចុងក្រោយ",
        title: "ថ្ងៃមង្គលការ",
        date: "ធ្នូ ២០២៦",
        text: "ថ្ងៃនេះ យើងសូមអញ្ជើញអ្នកមកចែករំលែកនូវការចាប់ផ្ដើមនៃជីវិតថ្មីរបស់យើងទាំងពីរ។",
        image: "/facebook/all/01-card/01-03.jpg",
    },
];

const DEMO_PARTY = [
    { id: "best-man", role: "កូនកំលោះកិត្តិយស", roleEn: "Best Man", name: "សុខ វិបុល", image: "/facebook/all/02-card/02-04.jpg" },
    { id: "maid", role: "កូនក្រមុំកិត្តិយស", roleEn: "Maid of Honor", name: "ចាន់ ស្រីនិច", image: "/facebook/all/02-card/02-06.jpg" },
    { id: "family", role: "គ្រួសារ", roleEn: "Family", name: "ឪពុកម្ដាយទាំងសងខាង", image: "/facebook/all/03-card/03-03.jpg" },
    { id: "friends", role: "មិត្តភក្ដិ", roleEn: "Friends", name: "ក្រុមមិត្តជិតស្និទ្ធ", image: "/facebook/all/03-card/03-05.jpg" },
];

const DEMO_GIFT = [
    { id: "aba", bank: "ABA Bank", account: "ឈ្មោះម្ចាស់គណនី (គំរូ)", number: "000 000 000", note: "ABA PAY", qrImage: "" },
    { id: "acleda", bank: "ACLEDA Bank", account: "ឈ្មោះម្ចាស់គណនី (គំរូ)", number: "0000-00-000000-0", note: "Toanchet", qrImage: "" },
    { id: "wing", bank: "Wing", account: "ឈ្មោះម្ចាស់គណនី (គំរូ)", number: "000 000 000", note: "WingPay", qrImage: "" },
];

const KHMER_GOLDEN_DEMO_SCHEDULE = [
    { id: "procession", time: "០៧:០០", title: "ពិធីហែជំនូន", titleEn: "Procession", description: "ស្វាគមន៍ក្រុមគ្រួសារទាំងសងខាង និងភ្ញៀវកិត្តិយស។" },
    { id: "fruit", time: "០៧:៣០", title: "ពិធីរៀបរាប់ផ្លែឈើ", titleEn: "Fruit Ceremony", description: "រៀបចំជំនូនតាមប្រពៃណីខ្មែរ។" },
    { id: "rings", time: "០៨:១៥", title: "ពិធីបំពាក់ចិញ្ចៀន", titleEn: "Ring Ceremony", description: "ពេលវេលាសន្យាស្នេហ៍របស់គូស្វាមីភរិយា។" },
    { id: "blessing", time: "០៨:៣០", title: "ពិធីសូត្រមន្តចម្រើនព្រះបរិត្ត", titleEn: "Blessing Ceremony", description: "ទទួលពរជ័យ និងសុភមង្គលសម្រាប់ជីវិតថ្មី។" },
    { id: "hair", time: "០៩:៣០", title: "ពិធីកាត់សក់ បង្កក់សិរី", titleEn: "Hair Cutting", description: "ពិធីប្រពៃណីដ៏ពិសិដ្ឋសម្រាប់គូស្វាមីភរិយា។" },
    { id: "palms", time: "១០:២៥", title: "ពិធីសំពះផ្ទឹម", titleEn: "Sompeas Ptem", description: "គោរពដល់មាតាបិតា និងចាស់ទុំទាំងសងខាង។" },
    { id: "lunch", time: "១២:០០", title: "អញ្ជើញភ្ញៀវពិសាអាហារថ្ងៃត្រង់", titleEn: "Lunch", description: "អាហារថ្ងៃត្រង់ជាមួយក្រុមគ្រួសារ និងភ្ញៀវកិត្តិយស។" },
    { id: "welcome", time: "១៧:០០", title: "ទទួលបដិសណ្ឋារកិច្ចភ្ញៀវកិត្តិយស", titleEn: "Guest Welcome", description: "ចុះឈ្មោះ ថតរូប និងទទួលភ្ញៀវ។" },
    { id: "reception", time: "១៨:០០", title: "ពិធីជប់លៀងមង្គលការ", titleEn: "Reception Dinner", description: "អាហារពេលល្ងាច តន្ត្រី និងពាក្យជូនពរ។" },
];

const DEMO_WISH =
    "សូមឱ្យសេចក្ដីស្រឡាញ់របស់យើងកាន់តែរីកចម្រើន និងពោរពេញដោយសុភមង្គល។ យើងខ្ញុំរីករាយទទួលពាក្យជូនពរពីលោកអ្នកក្នុងថ្ងៃដ៏មានន័យនេះ។";

const DEMO_FAQ = [
    {
        id: "venue",
        q: "តើពិធីប្រព្រឹត្តទៅនៅទីណា?",
        a: "ពិធីនឹងប្រព្រឹត្តទៅនៅទីតាំងដែលបានបញ្ជាក់ក្នុងផ្នែក «ទីតាំង»។ សូមចុចប៊ូតុង «មើលទិសដៅ» ដើម្បីបើកផែនទី Google Maps។",
    },
    {
        id: "dress",
        q: "តើគួរស្លៀកពាក់បែបណា?",
        a: "សូមមើលផ្នែក «សម្លៀកបំពាក់» សម្រាប់ពណ៌ និងរចនាបថដែលស្នើ។",
    },
    {
        id: "plus-one",
        q: "តើខ្ញុំអាចនាំភ្ញៀវបន្ថែមបានទេ?",
        a: "សូមបញ្ជាក់ចំនួនភ្ញៀវនៅពេលបំពេញ RSVP ដើម្បីឱ្យយើងអាចរៀបចំកន្លែងអង្គុយឱ្យបានគ្រប់គ្រាន់។",
    },
    {
        id: "parking",
        q: "តើមានកន្លែងចតរថយន្តទេ?",
        a: "មាន។ កន្លែងចតរថយន្តត្រូវបានរៀបចំនៅជិតទីតាំងពិធី ដោយឥតគិតថ្លៃ។",
    },
    {
        id: "rsvp",
        q: "តើខ្ញុំ RSVP ដោយរបៀបណា?",
        a: "សូមចុចប៊ូតុង «ឆ្លើយតបការអញ្ជើញ» ហើយបំពេញព័ត៌មានរបស់អ្នក។ យើងរង់ចាំការឆ្លើយតបពីអ្នក។",
    },
];

/**
 * Single-template copy. The experience engine still accepts a variant arg, but
 * routing now resolves every template/demo alias to this kept template.
 */
const VARIANT_COPY = {
    "garden-royal-khmer-wedding": {
        message:
            "ដោយក្តីសោមនស្សរីករាយ និងសេចក្ដីស្រឡាញ់ដ៏ជ្រាលជ្រៅ យើងខ្ញុំសូមគោរពអញ្ជើញលោកអ្នកមកចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីមង្គលការរបស់យើងទាំងពីរ។",
        groomIntro: "កូនកំលោះដ៏សុភាពរាបសា ស្រឡាញ់គ្រួសារ និងត្រៀមចាប់ផ្តើមជីវិតថ្មីដោយក្តីទទួលខុសត្រូវ។",
        brideIntro: "កូនក្រមុំដ៏ទន់ភ្លន់ មានស្នាមញញឹមកក់ក្ដៅ និងសេចក្តីស្រឡាញ់ចំពោះគ្រួសារ។",
        dressName: "ខៀវផ្កា បៃតងស្លឹក ស និងមាស",
        dressStyle: "ខ្មែរផ្លូវការ / Garden formal",
        dressNote: "ពណ៌ខៀវ ស បៃតងស្លឹក និងមាសស្រាល សមរម្យសម្រាប់បរិយាកាសសួនផ្កាផ្លូវការនិងរូបថតអនុស្សាវរីយ៍។",
    },
    "khmer-golden-canva-inspired-wedding": {
        message:
            "ដោយក្តីសោមនស្សរីករាយ យើងខ្ញុំសូមគោរពអញ្ជើញលោកអ្នក និងក្រុមគ្រួសារ មកចូលរួមជាភ្ញៀវកិត្តិយសក្នុងពិធីអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ។ វត្តមានរបស់លោកអ្នកគឺជាកិត្តិយសដ៏ខ្ពង់ខ្ពស់សម្រាប់គ្រួសារយើងខ្ញុំ។",
        groomIntro: "កូនកំលោះសុភាព មានចិត្តថ្លៃថ្នូរ និងស្រឡាញ់ការរួមដំណើរជីវិតដោយការគោរពគ្នាទៅវិញទៅមក។",
        brideIntro: "កូនក្រមុំមានស្នាមញញឹមទន់ភ្លន់ ចិត្តកក់ក្ដៅ និងសេចក្តីស្រឡាញ់ចំពោះគ្រួសារយ៉ាងជ្រាលជ្រៅ។",
        dressName: "Ivory មាស Champagne និងត្នោតខ្ចី",
        dressStyle: "Khmer formal / Golden evening elegant",
        dressNote: "សូមជ្រើសរើសពណ៌ស្រាលប្រណិតដូចជា ivory, champagne, មាស និងត្នោតខ្ចី ដើម្បីសមនឹងបរិយាកាសពិធីខ្មែរបែបមាស។",
        giftNote: "វត្តមាន និងពរជ័យរបស់លោកអ្នកមានន័យជាងអ្វីៗទាំងអស់។ សម្រាប់ភ្ញៀវដែលចង់ផ្ញើចំណងដៃ យើងបានរៀបចំព័ត៌មានគណនីគំរូខាងក្រោម។",
        footerThanks: "សូមអរគុណចំពោះវត្តមាន ក្ដីស្រឡាញ់ និងពរជ័យដ៏កក់ក្ដៅរបស់លោកអ្នក",
        footerThanksEn: "With love, gratitude, and golden memories",
        wishMessage:
            "សូមឱ្យថ្ងៃមង្គលនេះក្លាយជាការចាប់ផ្តើមដ៏ភ្លឺរលោង សម្រាប់ជីវិតគូពោរពេញដោយសេចក្តីស្រឡាញ់ ការគោរព និងសុភមង្គល។",
    },
};

const VARIANT_STORY = {
    "khmer-golden-canva-inspired-wedding": [
        {
            id: "first-light",
            kicker: "OUR STORY",
            title: "ថ្ងៃដែលស្នេហាចាប់ផ្តើម",
            date: "២០២១",
            text: "ពីការជួបគ្នាដំបូង រហូតដល់ថ្ងៃសន្យារួមដំណើរជីវិត យើងបានរៀនថាសេចក្តីស្រឡាញ់ពិតប្រាកដ គឺកើតពីការគោរព ការយកចិត្តទុកដាក់ និងស្នាមញញឹមរៀងរាល់ថ្ងៃ។",
            image: "/facebook/all/05-card/05-01.jpg",
        },
        {
            id: "promise",
            kicker: "PROMISE",
            title: "ពាក្យសន្យាមួយជីវិត",
            date: "២០២៥",
            text: "ពាក្យសន្យារបស់យើងគឺរស់នៅជាមួយគ្នាដោយចិត្តស្មោះ តស៊ូជាមួយគ្នា និងថែរក្សាអនុស្សាវរីយ៍ល្អៗជារៀងរហូត។",
            image: "/facebook/all/05-card/05-02.jpg",
        },
        {
            id: "golden-day",
            kicker: "WEDDING DAY",
            title: "ថ្ងៃមាសរបស់យើង",
            date: "២៨ មករា ២០២៦",
            text: "ថ្ងៃនេះ យើងសូមអញ្ជើញលោកអ្នកមកចែករំលែកសុភមង្គល និងធ្វើជាសាក្សីដ៏មានតម្លៃក្នុងការចាប់ផ្តើមជីវិតថ្មីរបស់យើង។",
            image: "/facebook/all/05-card/05-03.jpg",
        },
    ],
};

const DEFAULT_CONTENT_VARIANT = "garden-royal-khmer-wedding";

const GALLERY_SPANS = ["tall", "wide", "small", "small", "small"];

/**
 * Collect a template's OWN images (from its primary story card / folder) so the
 * gallery + story show only that card's photos — never a mix from other cards.
 * Returns null when the template carries no media, so callers fall back to demo.
 */
function getTemplateOwnImages(tpl) {
    const fromStoryCard = Array.isArray(tpl.storyCards) && tpl.storyCards[0]?.images?.length
        ? tpl.storyCards[0].images
        : null;
    const fromStoryImages = Array.isArray(tpl.storyImages) && tpl.storyImages.length
        ? tpl.storyImages.map((img) => (typeof img === "string" ? img : img.src)).filter(Boolean)
        : null;
    const images = fromStoryCard || fromStoryImages;
    if (!images || !images.length) return null;
    // De-duplicate while preserving order (cover image can repeat).
    return [...new Set(images)];
}

/** Build the gallery from the template's own images (no cross-card mixing). */
function buildGallery(tpl) {
    const own = getTemplateOwnImages(tpl);
    if (!own) return DEMO_GALLERY;
    return own.map((src, index) => ({ src, span: GALLERY_SPANS[index % GALLERY_SPANS.length] }));
}

/** Build the story timeline using the template's own images, demo copy intact. */
function buildStory(tpl, variant) {
    const own = getTemplateOwnImages(tpl);
    const story = VARIANT_STORY[variant] || DEMO_STORY;
    const storyWithTemplateText = tpl.storyText && story.length
        ? story.map((chapter, index) => (index === 0 ? { ...chapter, text: tpl.storyText } : chapter))
        : story;
    if (!own) return storyWithTemplateText;
    return storyWithTemplateText.map((chapter, index) => ({
        ...chapter,
        image: own[index % own.length],
    }));
}

function normalizeScheduleItems(schedule) {
    if (!Array.isArray(schedule)) return null;
    const items = schedule
        .map((s, index) => ({
            id: s.id || `schedule-${index}`,
            time: s.time || s.startTime || s.timeText || "",
            title: s.title || s.name || s.label || "",
            titleEn: s.titleEn || "",
            description: s.description || "",
            location: s.location || "",
        }))
        .filter((item) => item.time || item.title || item.description);
    return items.length ? items : null;
}

function buildSchedule(tpl, variant) {
    const templateSchedule = normalizeScheduleItems(tpl.schedule);
    if (templateSchedule) return templateSchedule;
    if (variant === "khmer-golden-canva-inspired-wedding") return KHMER_GOLDEN_DEMO_SCHEDULE;

    return [
        {
            id: "ceremony",
            time: tpl.ceremonyTime || "០៩:០០",
            title: "ពិធីសូត្រមន្ត",
            titleEn: "Ceremony",
            description: "ពិធីបុណ្យតាមប្រពៃណីខ្មែរ ស្វាគមន៍ភ្ញៀវកិត្តិយស។",
        },
        {
            id: "reception",
            time: tpl.receptionTime || "១៧:០០",
            title: "ពិធីជប់លៀង",
            titleEn: "Reception",
            description: "ស្វាគមន៍ភ្ញៀវ ការថតរូប និងពាក្យជូនពរ។",
        },
        {
            id: "dinner",
            time: "១៨:៣០",
            title: "អាហារពេលល្ងាច",
            titleEn: "Dinner",
            description: "ម្ហូបអាហារ និងតន្ត្រីរីករាយជាមួយគ្រួសារ និងមិត្តភក្ដិ។",
        },
        {
            id: "after",
            time: "២០:៣០",
            title: "ថតរូបជាមួយគ្រួសារ",
            titleEn: "Family Photo",
            description: "ពេលវេលាពិសេសសម្រាប់ការចងចាំ និងថតរូបអនុស្សាវរីយ៍។",
        },
    ];
}

function normalizeGiftAccounts(gift) {
    const accounts = Array.isArray(gift) ? gift : (gift ? [gift] : []);
    return accounts
        .map((g, index) => ({
            id: g.id || `gift-${index}`,
            bank: g.bank || "",
            account: g.account || g.accountName || g.name || "",
            number: g.number || g.accountNumber || g.phone || "",
            note: g.note || "",
            qrImage: g.qrImage || g.qr || g.qrUrl || "",
            qrValue: g.qrValue || g.qrPayload || "",
        }))
        .filter((account) => account.bank || account.account || account.number || account.qrImage || account.qrValue);
}

function buildGift(tpl) {
    const templateGift = normalizeGiftAccounts(tpl.gift);
    return templateGift.length ? templateGift : DEMO_GIFT;
}

/**
 * Build the full content model for a template experience.
 * @param {object} tpl resolved template object (from getTemplateById)
 * @param {string} variant variant key, resolved to the kept template variant.
 */
export function buildTemplateContent(tpl = {}, variant = DEFAULT_CONTENT_VARIANT) {
    const copy = VARIANT_COPY[variant] || VARIANT_COPY[DEFAULT_CONTENT_VARIANT];
    const theme = getVariantTheme(variant);

    // Host-authored content (from the wedding builder). When present, these
    // real values are preferred over the demo fallbacks below. The demo pages
    // pass no hostContent, so they keep showing tasteful sample data.
    const host = tpl.hostContent || {};
    const hostCouple = host.couple || {};
    const hostContact = host.contact || {};
    const hostEnabledSections = host.enabledSections || {};
    const hasHostContent = Boolean(tpl.hostContent) || Object.keys(host).length > 0;
    const sectionEnabled = (key) => hostEnabledSections[key] !== false;
    const nonEmpty = (arr) => (Array.isArray(arr) && arr.length ? arr : null);
    const nonBlank = (value) => (typeof value === "string" && value.trim() ? value.trim() : "");

    const venueName = tpl.venueName || "";
    const venueAddress = (tpl.venueAddress || "").replace(/\n/g, ", ");
    const mapValue = nonBlank(tpl.mapQuery);
    const mapValueIsUrl = /^https?:\/\//i.test(mapValue);
    const mapSearch = (mapValueIsUrl ? `${venueName} ${venueAddress}` : (mapValue || `${venueName} ${venueAddress}`))
        .replace(/\s+/g, " ")
        .trim();
    const hasMap = Boolean(mapValue || mapSearch);
    const mapLink = hasMap
        ? (mapValueIsUrl
            ? mapValue
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapSearch)}`)
        : null;
    const mapEmbedUrl = mapSearch
        ? `https://www.google.com/maps?q=${encodeURIComponent(mapSearch)}&output=embed`
        : null;

    const dressCode = tpl.dressCode && Array.isArray(tpl.dressCode.colors) && tpl.dressCode.colors.length
        ? {
            name: tpl.dressCode.name || copy.dressName,
            description: tpl.dressCode.description || copy.dressNote,
            style: tpl.dressCode.style || copy.dressStyle,
            colors: tpl.dressCode.colors,
        }
        : {
            name: copy.dressName,
            description: copy.dressNote,
            style: copy.dressStyle,
            colors: theme.dressColors,
        };

    const coverImage = hasHostContent
        ? nonBlank(tpl.customMainImage)
        : tpl.customMainImage || tpl.mainImage || tpl.phoneCoverImage || "/facebook/all/01-card/cover-card.jpg";

    // Map host story chapters onto the timeline shape, layering template images.
    const ownImages = getTemplateOwnImages(tpl);
    const hostGallery = nonEmpty(host.gallery)
        ? host.gallery
            .map((item, index) => ({
                src: typeof item === "string" ? item : item?.src || item?.preview || "",
                span: GALLERY_SPANS[index % GALLERY_SPANS.length],
            }))
            .filter((item) => item.src)
        : null;
    const hostStoryText = nonBlank(host.storyText || tpl.storyText);
    const hostStoryTextEn = nonBlank(host.storyTextEn);
    const languageMode = host.languageMode || "both";
    const combinedStoryText = languageMode === "en"
        ? (hostStoryTextEn || hostStoryText)
        : languageMode === "both" && hostStoryTextEn
            ? [hostStoryText, hostStoryTextEn].filter(Boolean).join("\n\n")
            : hostStoryText;
    const hostStoryChapters = nonEmpty(host.storyChapters);
    const hostStory = hostStoryChapters
        ? hostStoryChapters.map((c, index) => ({
            id: c.id || `chapter-${index}`,
            kicker: c.kicker || `ជំពូកទី ${index + 1}`,
            title: c.title || "",
            date: c.date || "",
            text: c.text || "",
            image: ownImages ? ownImages[index % ownImages.length] : undefined,
        }))
        : combinedStoryText
            ? [{
                id: "story-text",
                kicker: "រឿងរ៉ាវស្នេហា",
                title: "ដំណើររបស់យើង",
                date: tpl.dateText || "",
                text: combinedStoryText,
                image: ownImages ? ownImages[0] : coverImage,
            }]
        : null;

    const hostSchedule = nonEmpty(host.schedule)
        ? host.schedule.map((s, index) => ({
            id: s.id || `sched-${index}`,
            time: s.time || "",
            title: s.title || "",
            titleEn: s.titleEn || "",
            description: s.description || "",
            location: s.location || "",
        }))
        : null;

    const hostParty = nonEmpty(host.party)
        ? host.party.map((m, index) => ({
            id: m.id || `member-${index}`,
            role: m.role || "",
            roleEn: m.roleEn || "",
            name: m.name || "",
            image: ownImages ? ownImages[index % ownImages.length] : DEMO_PARTY[index % DEMO_PARTY.length].image,
        }))
        : null;

    const hostGift = nonEmpty(host.gift)
        ? host.gift.map((g, index) => ({
            id: g.id || `gift-${index}`,
            bank: g.bank || "",
            account: g.account || g.accountName || g.name || "",
            number: g.number || g.accountNumber || "",
            note: g.note || "",
            qrImage: g.qrImage || g.qr || g.qrUrl || "",
            qrValue: g.qrValue || g.qrPayload || "",
        }))
        : null;

    const hostFaq = nonEmpty(host.faq)
        ? host.faq.map((f, index) => ({
            id: f.id || `faq-${index}`,
            q: f.q || "",
            a: f.a || "",
        }))
        : null;

    const contactTelegram = hostContact.telegram
        ? (/^https?:\/\//i.test(hostContact.telegram)
            ? hostContact.telegram
            : `https://t.me/${hostContact.telegram.replace(/^@/, "")}`)
        : (hasHostContent ? "" : "https://t.me/koupreng");
    const contactFacebook = hostContact.facebook
        ? (/^https?:\/\//i.test(hostContact.facebook)
            ? hostContact.facebook
            : `https://www.facebook.com/${hostContact.facebook.replace(/^@/, "")}`)
        : "";
    const design = tpl.design || {};

    return {
        variant,
        amp: theme.amp,
        badge: theme.badge,
        enabledSections: hostEnabledSections,
        monogramText: tpl.monogramText || (tpl.groom && tpl.bride ? `${tpl.groom.charAt(0)} & ${tpl.bride.charAt(0)}` : "V & P"),
        groom: tpl.groom || "ប្រុស",
        bride: tpl.bride || "ស្រី",
        groomNickname: nonBlank(hostCouple.groomNickname),
        brideNickname: nonBlank(hostCouple.brideNickname),
        eventTitle: nonBlank(host.eventTitle),
        dateText: tpl.dateText || "",
        targetDate: tpl.targetDate,
        ceremonyTime: tpl.ceremonyTime || "",
        receptionTime: tpl.receptionTime || "",
        coverImage,
        portraitImage: coverImage,
        message: tpl.message || copy.message,
        families: "រួមជាមួយក្រុមគ្រួសារទាំងសងខាង",
        couple: {
            groomIntro: hostCouple.groomIntro || copy.groomIntro,
            brideIntro: hostCouple.brideIntro || copy.brideIntro,
            groomParents: hostCouple.groomParents || (hasHostContent ? "" : "បុត្រាលោក ... និងលោកស្រី ..."),
            brideParents: hostCouple.brideParents || (hasHostContent ? "" : "បុត្រីលោក ... និងលោកស្រី ..."),
        },
        venue: {
            name: venueName,
            address: tpl.venueAddress || "",
            mapLink,
            mapEmbedUrl,
            image: coverImage,
        },
        gallery: hasHostContent ? (sectionEnabled("gallery") ? (hostGallery || []) : []) : buildGallery(tpl),
        story: hasHostContent ? (sectionEnabled("story") ? (hostStory || []) : []) : buildStory(tpl, variant),
        schedule: hasHostContent ? (sectionEnabled("schedule") ? (hostSchedule || []) : []) : buildSchedule(tpl, variant),
        party: hasHostContent ? (sectionEnabled("party") ? (hostParty || []) : []) : DEMO_PARTY,
        dressCode,
        gift: hasHostContent ? (sectionEnabled("gift") ? (hostGift || []) : []) : buildGift(tpl),
        giftNote: tpl.giftNote || copy.giftNote || "",
        wish: {
            message: nonBlank(host.wishMessage) || copy.wishMessage || DEMO_WISH,
        },
        faq: hasHostContent ? (sectionEnabled("faq") ? (hostFaq || []) : []) : DEMO_FAQ,
        contact: {
            telegram: contactTelegram,
            phone: hostContact.phone || (hasHostContent ? "" : "+855 12 345 678"),
            email: hostContact.email || "",
            facebook: contactFacebook,
        },
        footerThanks: copy.footerThanks,
        footerThanksEn: copy.footerThanksEn,
        design: {
            openingStyle: design.openingStyle || "cinematic",
            ornamentTheme: design.ornamentTheme || "royal-floral",
        },
        music: typeof tpl.music === "string" ? tpl.music : tpl.music?.url,
        openingVideo: tpl.openingVideo || null,
        rsvpDeadline: nonBlank(host.rsvp?.deadline),
    };
}

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
function buildStory(tpl) {
    const own = getTemplateOwnImages(tpl);
    if (!own) return DEMO_STORY;
    return DEMO_STORY.map((chapter, index) => ({
        ...chapter,
        image: own[index % own.length],
    }));
}

function buildSchedule(tpl) {
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

/**
 * Build the full content model for a template experience.
 * @param {object} tpl resolved template object (from getTemplateById)
 * @param {string} variant variant key, resolved to the kept template variant.
 */
export function buildTemplateContent(tpl = {}, variant = DEFAULT_CONTENT_VARIANT) {
    const copy = VARIANT_COPY[DEFAULT_CONTENT_VARIANT];
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

    const coverImage = tpl.customMainImage || tpl.mainImage || tpl.phoneCoverImage || "/facebook/all/01-card/cover-card.jpg";

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
            account: g.account || "",
            number: g.number || "",
            note: g.note || "",
            qrImage: g.qrImage || "",
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
        dateText: tpl.dateText || "",
        targetDate: tpl.targetDate,
        ceremonyTime: tpl.ceremonyTime || "",
        receptionTime: tpl.receptionTime || "",
        coverImage,
        portraitImage: tpl.customMainImage || tpl.phoneCoverImage || tpl.mainImage || coverImage,
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
            image: tpl.customMainImage || tpl.mainImage || tpl.phoneCoverImage || coverImage,
        },
        gallery: hasHostContent ? (sectionEnabled("gallery") ? (hostGallery || []) : []) : buildGallery(tpl),
        story: hasHostContent ? (sectionEnabled("story") ? (hostStory || []) : []) : buildStory(tpl),
        schedule: hasHostContent ? (sectionEnabled("schedule") ? (hostSchedule || []) : []) : buildSchedule(tpl),
        party: hasHostContent ? (sectionEnabled("party") ? (hostParty || []) : []) : DEMO_PARTY,
        dressCode,
        gift: hasHostContent ? (sectionEnabled("gift") ? (hostGift || []) : []) : DEMO_GIFT,
        wish: {
            message: nonBlank(host.wishMessage) || DEMO_WISH,
        },
        faq: hasHostContent ? (sectionEnabled("faq") ? (hostFaq || []) : []) : DEMO_FAQ,
        contact: {
            telegram: contactTelegram,
            phone: hostContact.phone || (hasHostContent ? "" : "+855 12 345 678"),
            email: hostContact.email || "",
            facebook: contactFacebook,
        },
        design: {
            openingStyle: design.openingStyle || "cinematic",
            ornamentTheme: design.ornamentTheme || "royal-floral",
        },
        music: typeof tpl.music === "string" ? tpl.music : tpl.music?.url,
        openingVideo: tpl.openingVideo || null,
    };
}

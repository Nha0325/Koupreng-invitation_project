import musicInstrumental from "../../../assets/music/Instrumental Wedding Music (VioSounds Cover).m4a";

export const KEEP_TEMPLATE_CODE = "garden-royal-khmer-wedding";

export const TEMPLATE_CATEGORIES = [
    { id: "all", label: "ទាំងអស់", labelEn: "All" },
    { id: "ancient", label: "បុរាណ", labelEn: "Ancient" },
];

const STORY_IMAGE_CLASSES = ["tpl-gallery-a", "tpl-gallery-b", "tpl-gallery-c", "tpl-gallery-d"];

function getSourceMedia() {
    return Array.from(
        { length: 7 },
        (_, index) => `/facebook/all/03-card/03-${String(index + 1).padStart(2, "0")}.jpg`
    );
}

function withTemplateMedia(template) {
    const primaryImages = getSourceMedia();
    const coverImage = "/facebook/all/03-card/cover-card.jpg";
    const fallbackMedia = [coverImage, ...primaryImages];

    return {
        ...template,
        mainImage: template.mainImage || coverImage,
        phoneCoverImage: template.phoneCoverImage || coverImage,
        slideshowImages: template.slideshowImages || fallbackMedia.slice(0, 7),
        storyImages: template.storyImages || fallbackMedia.slice(0, 4).map((src, imageIndex) => ({
            src,
            alt: `${template.style} ${imageIndex + 1}`,
            className: STORY_IMAGE_CLASSES[imageIndex % STORY_IMAGE_CLASSES.length],
        })),
        storyCards: template.storyCards || [
            {
                id: `${template.id}-03-card`,
                title: template.style,
                images: fallbackMedia,
            },
        ],
    };
}

const KEPT_TEMPLATE = withTemplateMedia({
    id: KEEP_TEMPLATE_CODE,
    name: "សួនរាជហង្សខ្មែរ",
    style: "Garden Royal Khmer Wedding",
    category: "ancient",
    popular: true,
    image: "/facebook/all/03-card/cover-card.jpg",
    mainImage: "/facebook/all/03-card/cover-card.jpg",
    phoneCoverImage: "/facebook/all/03-card/cover-card.jpg",
    music: { url: musicInstrumental },
    groom: "វណ្ណដា",
    bride: "ស្រីពេជ្រ",
    dateText: "ថ្ងៃពុធ ២៨ មករា ២០២៦",
    targetDate: "2026-01-28T17:00:00+07:00",
    ceremonyTime: "០៧:០០",
    receptionTime: "១៧:០០",
    venueName: "ដឹប្រីមៀលែនដ៍ សែនសុខ",
    venueAddress: "អគារ A ភ្នំពេញ",
    mapQuery: "The Premier Land Sen Sok Phnom Penh Cambodia",
    bg: "#DFF4FF",
    paper: "#FFFDF7",
    color: "#D6A63C",
    accent: "#2D7FA6",
    dark: "#253F57",
    label: "GARDEN ROYAL KHMER",
    description: "គំរូសន្លឹកការរចនាបថសួនផ្កា និងទឹកពណ៌បែបព្រះរាជវង្សខ្មែរ ពណ៌ខៀវស្រាល បៃតង និងមាស។",
});

export const TEMPLATES = [KEPT_TEMPLATE];

export const FACEBOOK_TEMPLATE_CARDS = TEMPLATES;

export function normalizeTemplateId(id) {
    return id || KEEP_TEMPLATE_CODE;
}

export function getTemplateById() {
    return KEPT_TEMPLATE;
}

export function isTemplatePremium() {
    return false;
}

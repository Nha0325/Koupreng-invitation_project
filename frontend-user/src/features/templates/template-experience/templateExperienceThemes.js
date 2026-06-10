/**
 * templateExperienceThemes — variant theme registry for the shared
 * TemplateExperience engine.
 *
 * Each variant maps to:
 *  - className   : CSS modifier applied on the root (.template-experience--*)
 *  - mood        : "light" | "dark" (used for a couple of conditional tweaks)
 *  - badge       : short style label shown in the hero
 *  - amp         : the glyph rendered between the couple names
 *  - dressColors : palette swatches that match the variant identity
 *
 * The actual colors live in template-experience.css (CSS variables per
 * variant class) so styling stays maintainable and out of JS.
 *
 * Every template page (Royal included) renders the single TemplateExperience
 * engine; the variant key chooses the visual identity.
 */

export const TEMPLATE_VARIANTS = {
    royal: {
        className: "template-experience--royal",
        mood: "light",
        badge: "Royal Gold",
        amp: "&",
        dressColors: [
            { hex: "#C8A35F", name: "មាស" },
            { hex: "#F5E6D3", name: "ស" },
            { hex: "#B0926A", name: "ត្នោតស្រាល" },
            { hex: "#6F4D24", name: "ត្នោតចាស់" },
        ],
    },
    classic: {
        className: "template-experience--classic",
        mood: "light",
        badge: "Classic Cream",
        amp: "&",
        dressColors: [
            { hex: "#C9A66B", name: "មាសស្រាល" },
            { hex: "#F6ECDD", name: "ភ្លឺ" },
            { hex: "#E7C9B1", name: "ផ្កាឈូក" },
            { hex: "#8A6A3A", name: "ត្នោតមាស" },
        ],
    },
    luxury: {
        className: "template-experience--luxury",
        mood: "dark",
        badge: "Dark Luxury",
        amp: "&",
        dressColors: [
            { hex: "#0F0D0A", name: "ខ្មៅ" },
            { hex: "#D2A85E", name: "ស្ប៉ាញ់មាស" },
            { hex: "#F3E7D0", name: "ភ្លឺ" },
            { hex: "#3A332A", name: "ប្រផេះចាស់" },
        ],
    },
    "modern-khmer": {
        className: "template-experience--modern-khmer",
        mood: "light",
        badge: "Modern Khmer",
        amp: "&",
        dressColors: [
            { hex: "#2E7D6B", name: "បៃតងស្លឹក" },
            { hex: "#F4F1EA", name: "ស" },
            { hex: "#C9A24B", name: "មាស" },
            { hex: "#C67B53", name: "ដីឥដ្ឋ" },
        ],
    },
    "royal-khmer": {
        className: "template-experience--royal-khmer",
        mood: "light",
        badge: "Royal Khmer",
        amp: "♛",
        dressColors: [
            { hex: "#7C1F24", name: "ឈាមជ្រូក" },
            { hex: "#B8862B", name: "មាសរាជ" },
            { hex: "#F3E7D0", name: "ក្រមួន" },
            { hex: "#4A130F", name: "ត្នោតចាស់" },
        ],
    },
    "vintage-gold": {
        className: "template-experience--vintage-gold",
        mood: "light",
        badge: "Vintage Gold",
        amp: "❦",
        dressColors: [
            { hex: "#A07C3A", name: "មាសបុរាណ" },
            { hex: "#E8DCC2", name: "ក្រដាសចាស់" },
            { hex: "#B89B6A", name: "សេពៀ" },
            { hex: "#6E5223", name: "ត្នោតក្តៅ" },
        ],
    },
    "garden-royal-khmer-wedding": {
        className: "template-experience--garden-royal-khmer-wedding",
        mood: "light",
        badge: "Garden Royal",
        amp: "❀",
        dressColors: [
            { hex: "#2D7FA6", name: "ខៀវផ្កា" },
            { hex: "#6F9E2E", name: "បៃតងស្លឹក" },
            { hex: "#FFFDF7", name: "ស" },
            { hex: "#D6A63C", name: "មាស" },
        ],
    },
};

export const DEFAULT_VARIANT = "classic";

/**
 * Maps each known template id to a variant. The grouping mirrors the visual
 * style family each template belongs to, so a template that looks "luxury"
 * on the grid also gets the luxury experience on its detail page.
 */
export const TEMPLATE_VARIANT_BY_ID = {
    // ── Royal gold family ─────────────────────────────────────
    royal: "royal",
    "temple-blessing": "royal",
    minimalist: "classic",
    "emerald-modern": "modern-khmer",
    "ink-brush": "luxury",

    // ── Classic cream family ──────────────────────────────────
    classic: "classic",
    "royal-lotus": "royal-khmer",
    "rose-gold": "classic",
    terracotta: "vintage-gold",
    "glass-garden": "modern-khmer",

    // ── Luxury dark family ────────────────────────────────────
    "angkor-spirit": "luxury",
    "urban-glam": "luxury",
    "nordic-frost": "modern-khmer",
    "art-deco-now": "luxury",
    "crystal-light": "modern-khmer",

    // ── Modern Khmer family ───────────────────────────────────
    garden: "modern-khmer",
    "floral-chic": "classic",
    "boho-chic": "vintage-gold",
    "pampas-grass": "vintage-gold",

    // ── Royal Khmer family ────────────────────────────────────
    "khmer-silk": "royal-khmer",
    sky: "royal-khmer",
    "midnight-luxe": "luxury",
    "lush-tropics": "modern-khmer",

    // ── Vintage gold family ───────────────────────────────────
    "ancient-gold": "vintage-gold",
    "golden-era": "vintage-gold",
    celestial: "luxury",
    "sage-wedding": "modern-khmer",
    "velvet-touch": "luxury",
    "garden-royal-khmer-wedding": "garden-royal-khmer-wedding",
};

/**
 * Representative real template id used when a route uses a *style name*
 * (e.g. /templates/luxury) that is not itself a template id.
 */
export const VARIANT_ROUTE_ALIASES = {
    classic: "classic",
    luxury: "angkor-spirit",
    "modern-khmer": "garden",
    "royal-khmer": "khmer-silk",
    "vintage-gold": "golden-era",
};

/** Resolve the variant key for a resolved template object. */
export function resolveVariant(tpl, explicitVariant) {
    if (explicitVariant && TEMPLATE_VARIANTS[explicitVariant]) {
        return explicitVariant;
    }
    if (tpl?.id && TEMPLATE_VARIANT_BY_ID[tpl.id]) {
        return TEMPLATE_VARIANT_BY_ID[tpl.id];
    }
    return DEFAULT_VARIANT;
}

/** Get the theme descriptor for a variant key (always returns a valid theme). */
export function getVariantTheme(variant) {
    return TEMPLATE_VARIANTS[variant] || TEMPLATE_VARIANTS[DEFAULT_VARIANT];
}

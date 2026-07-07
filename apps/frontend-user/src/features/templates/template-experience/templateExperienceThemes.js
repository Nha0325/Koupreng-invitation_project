export const KEEP_TEMPLATE_CODE = "garden-royal-khmer-wedding";
export const KHMER_GOLDEN_CANVA_INSPIRED_CODE = "khmer-golden-canva-inspired-wedding";

export const TEMPLATE_VARIANTS = {
    [KEEP_TEMPLATE_CODE]: {
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
    [KHMER_GOLDEN_CANVA_INSPIRED_CODE]: {
        className: "template-experience--khmer-golden-canva-inspired-wedding",
        mood: "light",
        badge: "Khmer Golden",
        amp: "✦",
        dressColors: [
            { hex: "#FFFDF7", name: "ivory" },
            { hex: "#C99A3D", name: "មាស" },
            { hex: "#E9D0A2", name: "champagne" },
            { hex: "#4B2F1A", name: "ត្នោត" },
        ],
    },
};

export const DEFAULT_VARIANT = KEEP_TEMPLATE_CODE;

export const TEMPLATE_VARIANT_BY_ID = {
    [KEEP_TEMPLATE_CODE]: KEEP_TEMPLATE_CODE,
    [KHMER_GOLDEN_CANVA_INSPIRED_CODE]: KHMER_GOLDEN_CANVA_INSPIRED_CODE,
};

export const VARIANT_ROUTE_ALIASES = {
    classic: KEEP_TEMPLATE_CODE,
    luxury: KEEP_TEMPLATE_CODE,
    royal: KEEP_TEMPLATE_CODE,
    "modern-khmer": KEEP_TEMPLATE_CODE,
    "royal-khmer": KEEP_TEMPLATE_CODE,
    "vintage-gold": KEEP_TEMPLATE_CODE,
};

export function resolveVariant(tpl = {}, explicitVariant) {
    if (explicitVariant) {
        if (TEMPLATE_VARIANTS[explicitVariant]) return explicitVariant;
        if (VARIANT_ROUTE_ALIASES[explicitVariant]) return VARIANT_ROUTE_ALIASES[explicitVariant];
    }

    const candidate = tpl.variant || tpl.templateId || tpl.id || tpl.slug || tpl.code || tpl.templateCode;
    if (candidate) {
        if (TEMPLATE_VARIANTS[candidate]) return candidate;
        if (TEMPLATE_VARIANT_BY_ID[candidate]) return TEMPLATE_VARIANT_BY_ID[candidate];
        if (VARIANT_ROUTE_ALIASES[candidate]) return VARIANT_ROUTE_ALIASES[candidate];
    }

    return DEFAULT_VARIANT;
}

export function getVariantTheme(variant = DEFAULT_VARIANT) {
    const resolvedVariant = TEMPLATE_VARIANTS[variant]
        ? variant
        : (TEMPLATE_VARIANT_BY_ID[variant] || VARIANT_ROUTE_ALIASES[variant] || DEFAULT_VARIANT);
    return TEMPLATE_VARIANTS[resolvedVariant] || TEMPLATE_VARIANTS[DEFAULT_VARIANT];
}

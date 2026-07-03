export const KEEP_TEMPLATE_CODE = "garden-royal-khmer-wedding";

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
};

export const DEFAULT_VARIANT = KEEP_TEMPLATE_CODE;

export const TEMPLATE_VARIANT_BY_ID = {
    [KEEP_TEMPLATE_CODE]: KEEP_TEMPLATE_CODE,
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
    const candidate = explicitVariant || tpl.variant || tpl.templateId || tpl.id || DEFAULT_VARIANT;
    return TEMPLATE_VARIANT_BY_ID[candidate] || VARIANT_ROUTE_ALIASES[candidate] || candidate;
}

export function getVariantTheme(variant = DEFAULT_VARIANT) {
    return TEMPLATE_VARIANTS[variant] || TEMPLATE_VARIANTS[DEFAULT_VARIANT];
}

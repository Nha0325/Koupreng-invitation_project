import { getTemplateById, isTemplatePremium, KEEP_TEMPLATE_CODE, TEMPLATES } from "./data/templatesData";
import { VARIANT_ROUTE_ALIASES } from "./template-experience/templateExperienceThemes";

const CATEGORY_MAP = {
    traditional: "ancient",
    floral: "contemporary",
    minimalist: "modern",
    modern: "modern",
    other: "contemporary",
};

export function normalizeBackendCategory(category) {
    const normalized = String(category || "").trim().toLowerCase();
    return CATEGORY_MAP[normalized] || normalized || "contemporary";
}

export function isBackendPremium(template) {
    return Boolean(template?.isPremium ?? template?.premium);
}

export function getTemplateRouteId(template) {
    return template?.slug || template?.code || String(template?.id || "");
}

export function findStaticTemplate(templateId) {
    const aliasTargetId = VARIANT_ROUTE_ALIASES[templateId];
    return getTemplateById(aliasTargetId || templateId);
}

export function mergeBackendTemplate(remoteTemplate, fallbackId = KEEP_TEMPLATE_CODE) {
    const routeId = getTemplateRouteId(remoteTemplate) || fallbackId;
    const localMatch = TEMPLATES.find((template) => template.id === routeId)
        || TEMPLATES.find((template) => template.id === remoteTemplate?.code)
        || findStaticTemplate(fallbackId);
    const premium = remoteTemplate ? isBackendPremium(remoteTemplate) : isTemplatePremium(localMatch.id);
    const image = remoteTemplate?.thumbnailUrl || remoteTemplate?.previewUrl || localMatch.image;
    const mainImage = remoteTemplate?.previewUrl || remoteTemplate?.thumbnailUrl || localMatch.mainImage;

    return {
        ...localMatch,
        id: routeId,
        localTemplateId: localMatch.id,
        backendId: remoteTemplate?.id,
        code: remoteTemplate?.code || remoteTemplate?.slug || routeId,
        name: remoteTemplate?.name || localMatch.name,
        category: normalizeBackendCategory(remoteTemplate?.category || localMatch.category),
        description: remoteTemplate?.description || localMatch.description,
        image,
        mainImage,
        phoneCoverImage: remoteTemplate?.thumbnailUrl || localMatch.phoneCoverImage || mainImage,
        previewUrl: remoteTemplate?.previewUrl,
        thumbnailUrl: remoteTemplate?.thumbnailUrl,
        price: remoteTemplate?.price,
        currency: remoteTemplate?.currency || "USD",
        isPremium: premium,
        premium,
        status: remoteTemplate?.status,
    };
}

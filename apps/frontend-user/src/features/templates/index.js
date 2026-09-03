// Pages
export { default as BrowseTemplatesFeature } from "./pages/BrowseTemplatesFeature";
export { default as HostTemplateDemoFeature } from "./pages/HostTemplateDemoFeature";
export { default as TemplateDemoFeature } from "./pages/TemplateDemoFeature";
export { default as TemplatesFeature } from "./pages/TemplatesFeature";

// Components
export { default as TemplateGrid } from "./components/TemplateGrid";

// Experience Engine
export { default as TemplateExperience } from "./experience/TemplateExperience";

// API Services
export { templateCatalogService } from "./api/templateCatalogApi";
export { templateService } from "./api/templateService";

// Data & Constants
export {
    TEMPLATES,
    FACEBOOK_TEMPLATE_CARDS,
    KEEP_TEMPLATE_CODE,
    KHMER_GOLDEN_CANVA_INSPIRED_CODE,
    COVER_KHMER_GOLDEN_CODE,
    TEMPLATE_CATEGORIES,
    getTemplateById,
    normalizeTemplateId,
    isTemplatePremium,
} from "./data/templatesData";

// Experience Config & Themes
export {
    TEMPLATE_VARIANTS,
    DEFAULT_VARIANT,
    TEMPLATE_VARIANT_BY_ID,
    VARIANT_ROUTE_ALIASES,
    resolveVariant,
    getVariantTheme,
} from "./experience/config/templateExperienceThemes";

export {
    DEFAULT_OPENING_DESIGN,
    DEFAULT_OPENING_COPY,
    normalizeOpeningCopy,
    normalizeOpeningDesign,
    resolveOpeningVideo,
} from "./experience/config/openingConfig";

export { buildTemplateContent } from "./experience/config/templateExperienceContent";
export { templateIcons } from "./experience/config/templateIcons";

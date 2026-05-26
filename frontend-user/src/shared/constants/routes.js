/**
 * Centralized route paths for the public/builder/invitation flow.
 * Use these constants instead of hard-coded strings so renaming a
 * route only requires changing one place.
 */
export const ROUTES = {
    home: "/",
    templates: "/templates",
    templateDetail: (id) => `/templates/${id}`,
    templateDemo: (id) => `/templates/${id}/demo`,
    createWedding: "/create/wedding",
    createWeddingDraft: (draftId) => `/create/wedding/${draftId}`,
    weddingPreview: (draftId) => `/preview/${draftId}`,
    publicInvitation: (slug) => `/i/${slug}`,
    legacyPublicInvitation: (slug) => `/w/${slug}`,
};

export default ROUTES;

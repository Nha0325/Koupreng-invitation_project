import { api } from "../../shared/api/client";

function unwrap(response) {
    return response?.data ?? response;
}

export const templateService = {
    listPublic: () => api.get("/v1/templates", { auth: false }).then(unwrap),
    getPublic: (templateId) => api.get(`/v1/templates/${encodeURIComponent(templateId)}`, { auth: false }).then(unwrap),
    getPublicBySlug: (slug) => api.get(`/v1/templates/slug/${encodeURIComponent(slug)}`, { auth: false }).then(unwrap),
};

export default templateService;

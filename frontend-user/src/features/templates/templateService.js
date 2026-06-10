import { api } from "../../shared/api/client";

function unwrap(response) {
    return response?.data ?? response;
}

export const templateService = {
    listPublic: () => api.get("/v1/templates", { skipAuth: true }).then(unwrap),
    getPublic: (templateId) => api.get(`/v1/templates/${encodeURIComponent(templateId)}`, { skipAuth: true }).then(unwrap),
    getPublicBySlug: (slug) => api.get(`/v1/templates/slug/${encodeURIComponent(slug)}`, { skipAuth: true }).then(unwrap),
};

export default templateService;

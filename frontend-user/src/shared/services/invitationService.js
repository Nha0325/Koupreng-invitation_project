import { api } from "../api/client";

function unwrap(response) {
    return response?.data ?? response;
}

function toQuery(params) {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            search.set(key, value);
        }
    });
    const query = search.toString();
    return query ? `?${query}` : "";
}

export const invitationService = {
    listMine: (status) => api.get(`/v1/invitations/my${toQuery({ status })}`).then(unwrap),
    get: (id) => api.get(`/v1/invitations/${id}`).then(unwrap),
    create: (data) => api.post("/v1/invitations", data).then(unwrap),
    update: (id, data) => api.put(`/v1/invitations/${id}`, data).then(unwrap),
    remove: (id) => api.delete(`/v1/invitations/${id}`).then(unwrap),
    saveDraft: (id) => api.patch(`/v1/invitations/${id}/draft`).then(unwrap),
    publish: (id) => api.patch(`/v1/invitations/${id}/publish`).then(unwrap),
    unpublish: (id) => api.patch(`/v1/invitations/${id}/unpublish`).then(unwrap),
    preview: (id) => api.get(`/v1/invitations/${id}/preview`).then(unwrap),
    getCustomization: (id) => api.get(`/v1/invitations/${id}/customization`).then(unwrap),
    updateCustomization: (id, data) => api.put(`/v1/invitations/${id}/customization`, data).then(unwrap),
    publicBySlug: (slug, params = {}) => {
        const queryParams = typeof params === "string" ? { token: params } : params;
        return api
            .get(`/v1/public/invitations/${encodeURIComponent(slug)}${toQuery(queryParams)}`, { auth: false })
            .then(unwrap);
    },
    verifyPublicAccess: (slug, data) => api
        .post(`/v1/public/invitations/${encodeURIComponent(slug)}/access/verify`, data, { auth: false })
        .then(unwrap),
};

export default invitationService;

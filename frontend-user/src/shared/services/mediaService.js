import { api } from "../api/client";

function unwrap(response) {
    return response?.data ?? response;
}

function toQuery(params) {
    const search = new URLSearchParams();
    Object.entries(params || {}).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
            search.set(key, value);
        }
    });
    const query = search.toString();
    return query ? `?${query}` : "";
}

function fileForm(file) {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
}

function galleryForm(files, sortOrder) {
    const formData = new FormData();
    Array.from(files || []).forEach((file) => formData.append("files", file));
    if (sortOrder !== undefined && sortOrder !== null && sortOrder !== "") {
        formData.append("sortOrder", sortOrder);
    }
    return formData;
}

export const mediaService = {
    list: (invitationId) => api.get(`/v1/invitations/${invitationId}/media`).then(unwrap),
    publicBySlug: (slug, params = {}) => {
        const queryParams = typeof params === "string" ? { token: params } : params;
        return api
            .get(`/v1/public/invitations/${encodeURIComponent(slug)}/media${toQuery(queryParams)}`, { auth: false })
            .then(unwrap);
    },
    uploadCover: (invitationId, file) => api
        .post(`/v1/invitations/${invitationId}/media/cover`, fileForm(file))
        .then(unwrap),
    uploadGallery: (invitationId, files, sortOrder) => api
        .post(`/v1/invitations/${invitationId}/media/gallery`, galleryForm(files, sortOrder))
        .then(unwrap),
    uploadVideo: (invitationId, file) => api
        .post(`/v1/invitations/${invitationId}/media/video`, fileForm(file))
        .then(unwrap),
    uploadMusic: (invitationId, file) => api
        .post(`/v1/invitations/${invitationId}/media/music`, fileForm(file))
        .then(unwrap),
    replace: (invitationId, mediaId, file) => api
        .put(`/v1/invitations/${invitationId}/media/${mediaId}/replace`, fileForm(file))
        .then(unwrap),
    remove: (invitationId, mediaId) => api.delete(`/v1/invitations/${invitationId}/media/${mediaId}`).then(unwrap),
};

export default mediaService;

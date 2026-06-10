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

export const rsvpService = {
    submitPublic: (slug, data) => api
        .post(`/v1/public/invitations/${encodeURIComponent(slug)}/rsvp`, data, { skipAuth: true })
        .then(unwrap),
    submitPublicWithToken: (slug, token, data) => api
        .post(`/v1/public/invitations/${encodeURIComponent(slug)}/guests/${encodeURIComponent(token)}/rsvp`, data, { skipAuth: true })
        .then(unwrap),
    publicWishes: (slug, token) => api
        .get(`/v1/public/invitations/${encodeURIComponent(slug)}/wishes${toQuery({ token })}`, { skipAuth: true })
        .then(unwrap),
    listByInvitation: (invitationId) => api.get(`/v1/invitations/${invitationId}/rsvps`).then(unwrap),
    summary: (invitationId) => api.get(`/v1/invitations/${invitationId}/rsvps/summary`).then(unwrap),
};

export default rsvpService;

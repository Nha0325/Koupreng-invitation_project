import { api } from "../api/client";

import { unwrap } from "../api/helpers";

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

export const rsvpService = {
    submitPublic: (slug, data, params = {}) => api
        .post(`/v1/public/invitations/${encodeURIComponent(slug)}/rsvp${toQuery(params)}`, data, { auth: false })
        .then(unwrap),
    submitPublicWithToken: (slug, token, data) => api
        .post(`/v1/public/invitations/${encodeURIComponent(slug)}/guests/${encodeURIComponent(token)}/rsvp`, data, { auth: false })
        .then(unwrap),
    publicSummary: (slug, params = {}) => api
        .get(`/v1/public/invitations/${encodeURIComponent(slug)}/rsvp-summary-public${toQuery(params)}`, { auth: false })
        .then(unwrap),
    publicWishes: (slug, params = {}) => api
        .get(`/v1/public/invitations/${encodeURIComponent(slug)}/wishes${toQuery(params)}`, { auth: false })
        .then(unwrap),
    listByInvitation: (invitationId) => api.get(`/v1/invitations/${invitationId}/rsvps`).then(unwrap),
    summary: (invitationId) => api.get(`/v1/invitations/${invitationId}/rsvps/summary`).then(unwrap),
    wishes: (invitationId) => api.get(`/v1/invitations/${invitationId}/wishes`).then(unwrap),
    update: (invitationId, rsvpId, data) =>
        api.patch(`/v1/invitations/${invitationId}/rsvps/${rsvpId}`, data).then(unwrap),
    delete: (invitationId, rsvpId) =>
        api.delete(`/v1/invitations/${invitationId}/rsvps/${rsvpId}`).then(unwrap),
};

export default rsvpService;

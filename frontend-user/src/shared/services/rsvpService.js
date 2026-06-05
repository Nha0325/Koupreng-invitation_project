import { api } from "../api/client";

function unwrap(response) {
    return response?.data ?? response;
}

export const rsvpService = {
    submitPublic: (slug, data) => api
        .post(`/v1/public/invitations/${encodeURIComponent(slug)}/rsvp`, data, { auth: false })
        .then(unwrap),
    submitPublicWithToken: (slug, token, data) => api
        .post(`/v1/public/invitations/${encodeURIComponent(slug)}/guests/${encodeURIComponent(token)}/rsvp`, data, { auth: false })
        .then(unwrap),
    publicSummary: (slug) => api
        .get(`/v1/public/invitations/${encodeURIComponent(slug)}/rsvp-summary-public`, { auth: false })
        .then(unwrap),
    publicWishes: (slug) => api
        .get(`/v1/public/invitations/${encodeURIComponent(slug)}/wishes`, { auth: false })
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

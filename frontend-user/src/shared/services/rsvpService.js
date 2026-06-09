import { api } from "../api/client";

import { unwrap } from "../api/helpers";

export const rsvpService = {
    submitPublic: (slug, data) => api
        .post(`/v1/public/invitations/${encodeURIComponent(slug)}/rsvp`, data, { auth: false })
        .then(unwrap),
    submitPublicWithToken: (slug, token, data) => api
        .post(`/v1/public/invitations/${encodeURIComponent(slug)}/guests/${encodeURIComponent(token)}/rsvp`, data, { auth: false })
        .then(unwrap),
    listByInvitation: (invitationId) => api.get(`/v1/invitations/${invitationId}/rsvps`).then(unwrap),
    summary: (invitationId) => api.get(`/v1/invitations/${invitationId}/rsvps/summary`).then(unwrap),
};

export default rsvpService;

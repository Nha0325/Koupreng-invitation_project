import { api } from "@/services/api/httpClient";

import { unwrap, toQuery } from "@/services/api/helpers";

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

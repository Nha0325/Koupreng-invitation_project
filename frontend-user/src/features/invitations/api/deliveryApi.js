import { api } from "@/services/api/httpClient";

import { unwrap } from "@/services/api/helpers";

export const deliveryService = {
    prepare: (invitationId) =>
        api.post(`/v1/invitations/${invitationId}/delivery/prepare`).then(unwrap),

    summary: (invitationId) =>
        api.get(`/v1/invitations/${invitationId}/delivery/summary`).then(unwrap),

    shareMessage: (invitationId, guestId) =>
        api
            .get(`/v1/invitations/${invitationId}/delivery/guests/${guestId}/share-message`)
            .then(unwrap),

    markShared: (invitationId, guestId) =>
        api
            .post(`/v1/invitations/${invitationId}/delivery/guests/${guestId}/mark-shared`)
            .then(unwrap),

    sendEmail: (invitationId, payload) =>
        api.post(`/v1/invitations/${invitationId}/delivery/email`, payload).then(unwrap),

    sendReminders: (invitationId, payload) =>
        api.post(`/v1/invitations/${invitationId}/delivery/reminders`, payload).then(unwrap),

    events: (invitationId) =>
        api.get(`/v1/invitations/${invitationId}/delivery/events`).then(unwrap),
};

export default deliveryService;

import { api } from "@/services/api/httpClient";
import { unwrap } from "@/services/api/helpers";

export const guestService = {
    listByInvitation: (invitationId) => api.get(`/v1/invitations/${invitationId}/guests`).then(unwrap),
    getByInvitation: (invitationId, guestId) => api.get(`/v1/invitations/${invitationId}/guests/${guestId}`).then(unwrap),
    createForInvitation: (invitationId, guest) => api.post(`/v1/invitations/${invitationId}/guests`, guest).then(unwrap),
    updateForInvitation: (invitationId, guestId, guest) => api.put(`/v1/invitations/${invitationId}/guests/${guestId}`, guest).then(unwrap),
    removeFromInvitation: (invitationId, guestId) => api.delete(`/v1/invitations/${invitationId}/guests/${guestId}`).then(unwrap),
    searchByInvitation: (invitationId, keyword) => api
        .get(`/v1/invitations/${invitationId}/guests/search?keyword=${encodeURIComponent(keyword || "")}`)
        .then(unwrap),
    importForInvitation: (invitationId, guests) => api
        .post(`/v1/invitations/${invitationId}/guests/import`, { guests })
        .then(unwrap),
};

export default guestService;

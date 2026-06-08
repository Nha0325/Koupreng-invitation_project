import { api } from "../api/client";
import { unwrap } from "../api/helpers";

export const guestService = {
    list: () => api.get("/guests"),
    create: (guest) => api.post("/guests", guest),
    update: (id, guest) => api.put(`/guests/${id}`, guest),
    remove: (id) => api.delete(`/guests/${id}`),
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

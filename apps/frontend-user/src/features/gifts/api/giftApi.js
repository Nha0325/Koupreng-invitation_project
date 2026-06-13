import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

export const weddingGiftService = {
  listByInvitation: (invitationId) => api.get(`/v1/invitations/${invitationId}/gifts`).then(unwrap),
  createForInvitation: (invitationId, data) => api.post(`/v1/invitations/${invitationId}/gifts`, data).then(unwrap),
  updateForInvitation: (invitationId, giftId, data) =>
    api.put(`/v1/invitations/${invitationId}/gifts/${giftId}`, data).then(unwrap),
  removeFromInvitation: (invitationId, giftId) =>
    api.delete(`/v1/invitations/${invitationId}/gifts/${giftId}`).then(unwrap),
  listGifts: (invitationId) => api.get(`/v1/invitations/${invitationId}/gifts`).then(unwrap),
  createGift: (invitationId, data) => api.post(`/v1/invitations/${invitationId}/gifts`, data).then(unwrap),
  updateGift: (invitationId, giftId, data) => api.put(`/v1/invitations/${invitationId}/gifts/${giftId}`, data).then(unwrap),
  removeGift: (invitationId, giftId) => api.delete(`/v1/invitations/${invitationId}/gifts/${giftId}`).then(unwrap),
};

export default weddingGiftService;

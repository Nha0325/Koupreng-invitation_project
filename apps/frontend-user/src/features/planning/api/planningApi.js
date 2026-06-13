import { api } from "@/shared/api/httpClient";

import { unwrap } from "@/shared/api/helpers";

export const planningService = {
    listBudgetItems: (invitationId) =>
        api.get(`/v1/invitations/${invitationId}/budget-items`).then(unwrap),
    createBudgetItem: (invitationId, data) =>
        api.post(`/v1/invitations/${invitationId}/budget-items`, data).then(unwrap),
    updateBudgetItem: (invitationId, itemId, data) =>
        api.put(`/v1/invitations/${invitationId}/budget-items/${itemId}`, data).then(unwrap),
    removeBudgetItem: (invitationId, itemId) =>
        api.delete(`/v1/invitations/${invitationId}/budget-items/${itemId}`).then(unwrap),

    listGifts: (invitationId) =>
        api.get(`/v1/invitations/${invitationId}/gifts`).then(unwrap),
    createGift: (invitationId, data) =>
        api.post(`/v1/invitations/${invitationId}/gifts`, data).then(unwrap),
    updateGift: (invitationId, giftId, data) =>
        api.put(`/v1/invitations/${invitationId}/gifts/${giftId}`, data).then(unwrap),
    removeGift: (invitationId, giftId) =>
        api.delete(`/v1/invitations/${invitationId}/gifts/${giftId}`).then(unwrap),
};

export default planningService;

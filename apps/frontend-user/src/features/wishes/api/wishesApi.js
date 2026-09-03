import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

export const wishesApi = {
  /** GET /v1/invitations/:id/wishes – list wishes for host dashboard */
  listByInvitation: (invitationId) => {
    if (!invitationId || (typeof invitationId === "string" && !/^\d+$/.test(invitationId))) {
      return Promise.resolve([]);
    }
    return api.get(`/v1/invitations/${invitationId}/wishes`).then(unwrap);
  },

  /** GET /v1/public/invitations/:slug/wishes – public wishes list */
  listPublic: (slug) => api.get(`/v1/public/invitations/${slug}/wishes`).then(unwrap),

  /** POST /v1/public/invitations/:slug/wishes – post a guest wish */
  createPublicWish: (slug, data) =>
    api.post(`/v1/public/invitations/${slug}/wishes`, data).then(unwrap),

  /** DELETE /v1/invitations/:id/wishes/:wishId – delete wish by host */
  deleteWish: (invitationId, wishId) =>
    api.delete(`/v1/invitations/${invitationId}/wishes/${wishId}`).then(unwrap),
};

export default wishesApi;

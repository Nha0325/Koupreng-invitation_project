import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

export const deliveryApi = {
  /** GET /v1/invitations/:id/delivery/list – get all guest delivery statuses */
  list: (invitationId) => {
    if (!invitationId || (typeof invitationId === "string" && !/^\d+$/.test(invitationId))) {
      return Promise.resolve([]);
    }
    return api.get(`/v1/invitations/${invitationId}/delivery/list`).then(unwrap);
  },

  /** GET /v1/invitations/:id/delivery/summary – summary stats */
  summary: (invitationId) => {
    if (!invitationId || (typeof invitationId === "string" && !/^\d+$/.test(invitationId))) {
      return Promise.resolve(null);
    }
    return api.get(`/v1/invitations/${invitationId}/delivery/summary`).then(unwrap);
  },

  /** POST /v1/invitations/:id/delivery/send – send invitation/reminder to guest */
  sendInvitation: (invitationId, guestId, channel = "TELEGRAM") =>
    api.post(`/v1/invitations/${invitationId}/delivery/send`, { guestId, channel }).then(unwrap),

  /** POST /v1/invitations/:id/delivery/send-batch – send to all pending */
  sendBatch: (invitationId, channel = "TELEGRAM") =>
    api.post(`/v1/invitations/${invitationId}/delivery/send-batch`, { channel }).then(unwrap),
};

export default deliveryApi;

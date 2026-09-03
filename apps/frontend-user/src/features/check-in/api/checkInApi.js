import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

export const checkInApi = {
  /** GET /v1/invitations/:id/check-in/summary */
  getSummary: (invitationId) => {
    if (!invitationId || (typeof invitationId === "string" && !/^\d+$/.test(invitationId))) {
      return Promise.resolve(null);
    }
    return api.get(`/v1/invitations/${invitationId}/check-in/summary`).then(unwrap);
  },

  /** GET /v1/invitations/:id/check-in/list */
  getList: (invitationId) => {
    if (!invitationId || (typeof invitationId === "string" && !/^\d+$/.test(invitationId))) {
      return Promise.resolve([]);
    }
    return api.get(`/v1/invitations/${invitationId}/check-in/list`).then(unwrap);
  },

  /** POST /v1/invitations/:id/check-in/scan – scan QR code token */
  scanQr: (invitationId, qrToken) =>
    api.post(`/v1/invitations/${invitationId}/check-in/scan`, { qrToken }).then(unwrap),

  /** POST /v1/invitations/:id/guests/:guestId/check-in – manual check-in */
  manualCheckIn: (invitationId, guestId) =>
    api.post(`/v1/invitations/${invitationId}/guests/${guestId}/check-in`, {}).then(unwrap),

  /** DELETE /v1/invitations/:id/guests/:guestId/check-in – undo check-in */
  undoCheckIn: (invitationId, guestId) =>
    api.delete(`/v1/invitations/${invitationId}/guests/${guestId}/check-in`).then(unwrap),
};

export default checkInApi;

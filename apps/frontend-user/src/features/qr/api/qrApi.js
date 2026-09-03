import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

async function downloadBlob(url, filename) {
  const blob = await api.get(url, { responseType: "blob" });
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}

export const qrApi = {
  /** GET /v1/invitations/:id/qr – get invitation QR code payload/image */
  getInvitationQr: (invitationId) => {
    if (!invitationId || (typeof invitationId === "string" && !/^\d+$/.test(invitationId))) {
      return Promise.resolve(null);
    }
    return api.get(`/v1/invitations/${invitationId}/qr`).then(unwrap);
  },

  /** GET /v1/invitations/:id/guests/:guestId/qr – get guest QR code */
  getGuestQr: (invitationId, guestId) =>
    api.get(`/v1/invitations/${invitationId}/guests/${guestId}/qr`).then(unwrap),

  /** Download QR code as PNG image */
  downloadQrPng: (invitationId, guestId = null) => {
    const endpoint = guestId
      ? `/v1/invitations/${invitationId}/guests/${guestId}/qr/download`
      : `/v1/invitations/${invitationId}/qr/download`;
    const name = guestId ? `qr-guest-${guestId}.png` : `qr-invitation-${invitationId}.png`;
    return downloadBlob(endpoint, name);
  },
};

export default qrApi;

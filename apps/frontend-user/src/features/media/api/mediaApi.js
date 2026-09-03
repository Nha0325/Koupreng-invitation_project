import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

export const mediaApi = {
  /** GET /v1/invitations/:id/media – list all media for invitation */
  list: (invitationId) => {
    if (!invitationId || (typeof invitationId === "string" && !/^\d+$/.test(invitationId))) {
      return Promise.resolve([]);
    }
    return api.get(`/v1/invitations/${invitationId}/media`).then(unwrap);
  },

  /** POST /v1/invitations/:id/media – upload media file */
  upload: (invitationId, file, onProgress) => {
    const form = new FormData();
    form.append("file", file);
    return api
      .post(`/v1/invitations/${invitationId}/media`, form, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: onProgress,
      })
      .then(unwrap);
  },

  /** DELETE /v1/invitations/:id/media/:mediaId */
  delete: (invitationId, mediaId) =>
    api.delete(`/v1/invitations/${invitationId}/media/${mediaId}`).then(unwrap),

  /** PATCH /v1/invitations/:id/media/:mediaId – update metadata */
  updateMetadata: (invitationId, mediaId, data) =>
    api.patch(`/v1/invitations/${invitationId}/media/${mediaId}`, data).then(unwrap),
};

export default mediaApi;

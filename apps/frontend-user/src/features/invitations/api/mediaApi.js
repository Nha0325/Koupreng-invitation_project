import { api } from "@/shared/api/httpClient";
import { toQuery, unwrap } from "@/shared/api/helpers";

function publicParams(params) {
  if (typeof params === "string") {
    return { token: params };
  }
  return params || {};
}

function fileForm(file) {
  const formData = new FormData();
  formData.append("file", file);
  return formData;
}

function galleryForm(files, sortOrder) {
  const formData = new FormData();
  Array.from(files || []).forEach((file) => formData.append("files", file));
  if (sortOrder !== undefined && sortOrder !== null && sortOrder !== "") {
    formData.append("sortOrder", sortOrder);
  }
  return formData;
}

export const mediaService = {
  list: (invitationId) => api.get(`/v1/invitations/${invitationId}/media`).then(unwrap),
  publicBySlug: (slug, params) =>
    api
      .get(`/v1/public/invitations/${encodeURIComponent(slug)}/media${toQuery(publicParams(params))}`, { skipAuth: true })
      .then(unwrap),
  uploadCover: (invitationId, file) =>
    api.post(`/v1/invitations/${invitationId}/media/cover`, fileForm(file)).then(unwrap),
  uploadGallery: (invitationId, files, sortOrder) =>
    api.post(`/v1/invitations/${invitationId}/media/gallery`, galleryForm(files, sortOrder)).then(unwrap),
  uploadVideo: (invitationId, file) =>
    api.post(`/v1/invitations/${invitationId}/media/video`, fileForm(file)).then(unwrap),
  uploadMusic: (invitationId, file) =>
    api.post(`/v1/invitations/${invitationId}/media/music`, fileForm(file)).then(unwrap),
  replace: (invitationId, mediaId, file) =>
    api.put(`/v1/invitations/${invitationId}/media/${mediaId}/replace`, fileForm(file)).then(unwrap),
  remove: (invitationId, mediaId) => api.delete(`/v1/invitations/${invitationId}/media/${mediaId}`).then(unwrap),
};

export default mediaService;

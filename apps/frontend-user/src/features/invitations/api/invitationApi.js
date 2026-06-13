import { api } from "@/shared/api/httpClient";
import { toQuery, unwrap } from "@/shared/api/helpers";

function publicParams(params) {
  if (typeof params === "string") {
    return { token: params };
  }
  return params || {};
}

export const invitationService = {
  listMine: (status) => api.get(`/v1/invitations/my${toQuery({ status })}`).then(unwrap),
  get: (id) => api.get(`/v1/invitations/${id}`).then(unwrap),
  create: (data) => api.post("/v1/invitations", data).then(unwrap),
  update: (id, data) => api.put(`/v1/invitations/${id}`, data).then(unwrap),
  remove: (id) => api.delete(`/v1/invitations/${id}`).then(unwrap),
  saveDraft: (id) => api.patch(`/v1/invitations/${id}/draft`).then(unwrap),
  publish: (id) => api.patch(`/v1/invitations/${id}/publish`).then(unwrap),
  unpublish: (id) => api.patch(`/v1/invitations/${id}/unpublish`).then(unwrap),
  preview: (id) => api.get(`/v1/invitations/${id}/preview`).then(unwrap),
  publicBySlug: (slug, params) =>
    api
      .get(`/v1/public/invitations/${encodeURIComponent(slug)}${toQuery(publicParams(params))}`, { skipAuth: true })
      .then(unwrap),
  verifyPublicAccess: (slug, data) =>
    api.post(`/v1/public/invitations/${encodeURIComponent(slug)}/access/verify`, data, { skipAuth: true }).then(unwrap),
};

export default invitationService;

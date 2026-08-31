import { api } from "../../shared/api/httpClient";

function unwrap(response) {
  return response?.data ?? response;
}

export const notificationService = {
  list: () => api.get("/v1/notifications").then(unwrap),
  summary: () => api.get("/v1/notifications/summary").then(unwrap),
  listByInvitation: (invitationId) => {
    if (!invitationId || (typeof invitationId === "string" && !/^\d+$/.test(invitationId))) {
      return Promise.resolve([]);
    }
    return api.get(`/v1/invitations/${invitationId}/notifications`).then(unwrap);
  },
  markRead: (notificationId) =>
    api.patch(`/v1/notifications/${notificationId}/read`, {}).then(unwrap),
  markAllRead: () => api.patch("/v1/notifications/read-all", {}).then(unwrap),
};

export default notificationService;

import { api } from "../../lib/api";

function unwrap(response) {
  return response?.data ?? response;
}

function query(params) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const value = search.toString();
  return value ? `?${value}` : "";
}

export const notificationService = {
  list: (filters = {}) => api.get(`/v1/admin/notifications${query(filters)}`).then(unwrap),
  create: (payload) => api.post("/v1/admin/notifications", payload).then(unwrap),
  updateStatus: (notificationId, payload) =>
    api.patch(`/v1/admin/notifications/${notificationId}/status`, payload).then(unwrap),
};

export default notificationService;

import { ApiError } from "../../shared/api/errors";
import { api } from "../../shared/api/client";
import { getAccessToken, isCookieAuthStorage } from "../../shared/services/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

function unwrap(response) {
  return response?.data ?? response;
}

async function downloadCsv(path, filename) {
  const token = getAccessToken();
  const useCookieAuth = isCookieAuthStorage();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(!useCookieAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: useCookieAuth ? "include" : undefined,
  });

  if (!response.ok) {
    throw new ApiError(response.statusText || "Export failed", response.status);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export const budgetService = {
  getBudget: (invitationId) => api.get(`/v1/invitations/${invitationId}/budget`).then(unwrap),
  updateBudget: (invitationId, data) =>
    api.put(`/v1/invitations/${invitationId}/budget`, data).then(unwrap),
  summary: (invitationId) =>
    api.get(`/v1/invitations/${invitationId}/budget/summary`).then(unwrap),
  addItem: (invitationId, data) =>
    api.post(`/v1/invitations/${invitationId}/budget/items`, data).then(unwrap),
  updateItem: (invitationId, itemId, data) =>
    api.put(`/v1/invitations/${invitationId}/budget/items/${itemId}`, data).then(unwrap),
  deleteItem: (invitationId, itemId) =>
    api.delete(`/v1/invitations/${invitationId}/budget/items/${itemId}`).then(unwrap),
  exportBudget: (invitationId) =>
    downloadCsv(`/v1/invitations/${invitationId}/budget/export`, `budget-${invitationId}.csv`),
};

export default budgetService;

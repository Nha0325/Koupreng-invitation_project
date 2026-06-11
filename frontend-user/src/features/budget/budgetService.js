import { api } from "../../shared/api/client";

function unwrap(response) {
  return response?.data ?? response;
}

async function downloadCsv(path, filename) {
  const blob = await api.get(path, { responseType: "blob" });
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
  listItems: (invitationId) =>
    api.get(`/v1/invitations/${invitationId}/budget-items`).then(unwrap),
  createItem: (invitationId, data) =>
    api.post(`/v1/invitations/${invitationId}/budget-items`, data).then(unwrap),
  updatePlanningItem: (invitationId, itemId, data) =>
    api.put(`/v1/invitations/${invitationId}/budget-items/${itemId}`, data).then(unwrap),
  deletePlanningItem: (invitationId, itemId) =>
    api.delete(`/v1/invitations/${invitationId}/budget-items/${itemId}`).then(unwrap),
};

export default budgetService;


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

export const dashboardService = {
  summary: () => api.get("/v1/dashboard/summary").then(unwrap),
  invitationDashboard: (invitationId) =>
    api.get(`/v1/invitations/${invitationId}/dashboard`).then(unwrap),
  rsvpReport: (invitationId) =>
    api.get(`/v1/invitations/${invitationId}/reports/rsvp`).then(unwrap),
  guestReport: (invitationId) =>
    api.get(`/v1/invitations/${invitationId}/reports/guests`).then(unwrap),
  exportRsvpReport: (invitationId) =>
    downloadCsv(`/v1/invitations/${invitationId}/reports/rsvp/export`, `rsvp-report-${invitationId}.csv`),
  exportGuestReport: (invitationId) =>
    downloadCsv(`/v1/invitations/${invitationId}/reports/guests/export`, `guest-report-${invitationId}.csv`),
};

export default dashboardService;


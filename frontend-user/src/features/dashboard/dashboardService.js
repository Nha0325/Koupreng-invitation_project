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

import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

export const dashboardService = {
  getMySummary: () => api.get("/v1/dashboard/summary").then(unwrap),
  getInvitationDashboard: (invitationId) =>
    api.get(`/v1/invitations/${invitationId}/dashboard`).then(unwrap),
  getRsvpReport: (invitationId) =>
    api.get(`/v1/invitations/${invitationId}/reports/rsvp`).then(unwrap),
  getGuestReport: (invitationId) =>
    api.get(`/v1/invitations/${invitationId}/reports/guests`).then(unwrap),
};

export default dashboardService;

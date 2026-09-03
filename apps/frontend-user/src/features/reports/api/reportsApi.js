import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

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

export const reportsApi = {
  /** GET /v1/invitations/:id/reports?type=...&from=...&to=... */
  getReport: (invitationId, params = {}) => {
    if (!invitationId || (typeof invitationId === "string" && !/^\d+$/.test(invitationId))) {
      return Promise.resolve(null);
    }
    const query = new URLSearchParams(params).toString();
    const endpoint = query
      ? `/v1/invitations/${invitationId}/reports?${query}`
      : `/v1/invitations/${invitationId}/reports`;
    return api.get(endpoint).then(unwrap);
  },

  /** Export report data as CSV file */
  exportCsv: (invitationId, reportType = "GUEST") => {
    const filename = `report-${reportType.toLowerCase()}-${invitationId}.csv`;
    return downloadCsv(`/v1/invitations/${invitationId}/reports/export?type=${reportType}`, filename);
  },
};

export default reportsApi;

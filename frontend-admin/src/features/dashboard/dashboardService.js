import { api } from "../../lib/api";

function unwrap(response) {
  return response?.data ?? response;
}

export const dashboardService = {
  summary: () => api.get("/v1/admin/dashboard/summary").then(unwrap),
};

export default dashboardService;

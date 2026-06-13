import { api } from "../../shared/api/httpClient";

function unwrap(response) {
    return response?.data ?? response;
}

export const organizationService = {
    list: () => api.get("/v1/organizations").then(unwrap),
    create: (name) => api.post("/v1/organizations", { name }).then(unwrap),
    get: (organizationId) => api.get(`/v1/organizations/${organizationId}`).then(unwrap),
    addMember: (organizationId, payload) => api.post(`/v1/organizations/${organizationId}/members`, payload).then(unwrap),
    removeMember: (organizationId, memberId) => api.delete(`/v1/organizations/${organizationId}/members/${memberId}`).then(unwrap),
};

export default organizationService;

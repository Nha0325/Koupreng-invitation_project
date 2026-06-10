import { api } from "../lib/api";

function unwrap(res) {
    // Backend wraps admin payloads in ApiResponse { success, message, data }.
    return res?.data ?? res;
}

/**
 * Admin invitation management.
 * Listing is admin-scoped; mutations reuse the owner endpoints under /v1.
 */
export const invitationService = {
    /** GET /admin/invitations — every invitation across all users */
    listAll: () => api.get("/admin/invitations").then(unwrap),

    /** GET /v1/invitations/{id} — full invitation detail */
    get: (id) => api.get(`/v1/invitations/${id}`).then(unwrap),

    /** PATCH /v1/invitations/{id}/publish */
    publish: (id) => api.patch(`/v1/invitations/${id}/publish`).then(unwrap),

    /** PATCH /v1/invitations/{id}/unpublish */
    unpublish: (id) => api.patch(`/v1/invitations/${id}/unpublish`).then(unwrap),

    /** DELETE /v1/invitations/{id} */
    remove: (id) => api.delete(`/v1/invitations/${id}`).then(unwrap),
};

export default invitationService;

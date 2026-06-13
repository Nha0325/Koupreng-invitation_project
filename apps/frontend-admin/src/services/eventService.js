import { api } from "../lib/api";

function unwrap(res) {
    // Backend wraps event payloads in ApiResponse { success, message, data }.
    return res?.data ?? res;
}

/**
 * Admin event management — backed by /api/v1/events.
 * These endpoints are global (not user-scoped), so an admin can list, view,
 * publish/unpublish, and delete every wedding event in the system.
 */
export const eventService = {
    /** GET /v1/events — every event */
    listAll: () => api.get("/v1/events").then(unwrap),

    /** GET /v1/events/{id} — full event detail */
    get: (id) => api.get(`/v1/events/${id}`).then(unwrap),

    /** PATCH /v1/events/{id}/publish */
    publish: (id) => api.patch(`/v1/events/${id}/publish`).then(unwrap),

    /** PATCH /v1/events/{id}/unpublish */
    unpublish: (id) => api.patch(`/v1/events/${id}/unpublish`).then(unwrap),

    /** PATCH /v1/events/{id}/draft */
    saveAsDraft: (id) => api.patch(`/v1/events/${id}/draft`).then(unwrap),

    /** DELETE /v1/events/{id} — soft delete */
    remove: (id) => api.delete(`/v1/events/${id}`).then(unwrap),
};

export default eventService;

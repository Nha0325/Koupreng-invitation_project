import { api } from "../lib/api";

function unwrap(response) {
    return response?.data ?? response;
}

/**
 * Admin user management — backed by /api/v1/admin/users (ROLE_ADMIN only).
 */
export const userService = {
    /** GET /v1/admin/users — list every user */
    list: () => api.get("/v1/admin/users").then(unwrap),

    /** PATCH /v1/admin/users/{id}/role — promote/demote a user ("USER" | "ADMIN") */
    updateRole: (userId, role) => api.patch(`/v1/admin/users/${userId}/role`, { role }).then(unwrap),
};

export default userService;

import { api } from "../lib/api";

function unwrap(response) {
    return response?.data ?? response;
}

/**
 * Admin user management — backed by /api/admin/users (ROLE_ADMIN only).
 */
export const userService = {
    /** GET /admin/users — list every user */
    list: () => api.get("/admin/users").then(unwrap),

    /** PATCH /admin/users/{id}/role — promote/demote a user ("USER" | "ADMIN") */
    updateRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }).then(unwrap),
};

export default userService;

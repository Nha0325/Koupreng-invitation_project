import { api } from "../lib/api";

/**
 * Admin user management — backed by /api/admin/users (ROLE_ADMIN only).
 */
export const userService = {
    /** GET /admin/users — list every user */
    list: () => api.get("/admin/users"),

    /** PATCH /admin/users/{id}/role — promote/demote a user ("USER" | "ADMIN") */
    updateRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
};

export default userService;

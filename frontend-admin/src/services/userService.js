import { api } from "../lib/api";

/**
 * Legacy admin user screens, kept on the current /api/v1/admin route family.
 */
export const userService = {
    /** GET /v1/admin/users — list every user */
    list: () => api.get("/v1/admin/users"),

    /** PATCH /v1/admin/users/{id}/role — promote/demote a user ("USER" | "ADMIN") */
    updateRole: (userId, role) => api.patch(`/v1/admin/users/${userId}/role`, { role }),
};

export default userService;

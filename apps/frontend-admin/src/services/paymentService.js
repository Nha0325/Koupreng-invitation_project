import { api } from "../lib/api";

function unwrap(res) {
    return res?.data ?? res;
}

/**
 * Admin payment reporting — backed by /api/v1/admin/payments (ROLE_ADMIN only).
 */
export const paymentService = {
    /** GET /v1/admin/payments — all template and subscription payment orders */
    listOrders: () => api.get("/v1/admin/payments").then(unwrap),
};

export default paymentService;

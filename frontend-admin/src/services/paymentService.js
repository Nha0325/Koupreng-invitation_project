import { api } from "../lib/api";

function unwrap(res) {
    return res?.data ?? res;
}

/**
 * Admin payment reporting — backed by /api/v1/admin/template-payments (ROLE_ADMIN only).
 */
export const paymentService = {
    /** GET /v1/admin/template-payments — all template payment orders */
    listOrders: () => api.get("/v1/admin/template-payments").then(unwrap),
};

export default paymentService;

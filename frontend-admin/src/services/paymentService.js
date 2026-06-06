import { api } from "../lib/api";

function unwrap(res) {
    return res?.data ?? res;
}

/**
 * Legacy admin payment screens, kept on the current /api/v1/admin route family.
 */
export const paymentService = {
    /** GET /v1/admin/payments — all payment orders */
    listOrders: () => api.get("/v1/admin/payments").then(unwrap),
};

export default paymentService;

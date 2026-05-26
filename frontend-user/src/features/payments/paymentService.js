import { api } from "../../shared/api/client";

function unwrap(response) {
    return response?.data ?? response;
}

export const paymentService = {
    createPaywayCheckout: (payload) => api.post("/v1/template-payments/payway/create", payload).then(unwrap),
    getTemplateOrder: (orderCode) => api.get(`/v1/template-payments/${encodeURIComponent(orderCode)}`).then(unwrap),
    paidTemplates: () => api.get("/v1/me/templates/paid").then(unwrap),
    templateAccess: (templateId) => api.get(`/v1/me/templates/${templateId}/access`).then(unwrap),
};

export default paymentService;

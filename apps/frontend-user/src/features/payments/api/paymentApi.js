import { api } from "@/shared/api/httpClient";

function unwrap(response) {
    return response?.data ?? response;
}

export const paymentService = {
    createStaticPaymentOrder: (payload) => api.post("/v1/template-payments/static/create", payload).then(unwrap),
    getTemplateOrder: (orderCode) => api.get(`/v1/template-payments/${encodeURIComponent(orderCode)}`).then(unwrap),
    paidTemplates: () => api.get("/v1/me/templates/paid").then(unwrap),
    templateAccess: (templateId) => api.get(`/v1/me/templates/${templateId}/access`).then(unwrap),
};

export default paymentService;

import { api } from "../../../shared/api/httpClient";

function unwrap(response) {
  return response?.data ?? response;
}

export const paymentsApi = {
  createPaymentOrder: (payload) => api.post("/v1/template-payments/orders", payload).then(unwrap),
  getOrderStatus: (orderCode) => api.get(`/v1/template-payments/orders/${orderCode}`).then(unwrap),
  listMyOrders: () => api.get("/v1/template-payments/mine").then(unwrap),
  confirmInternalOrder: (payload) =>
    api.post("/v1/internal/template-payments/confirm", payload).then(unwrap),
  paymentHistory: () => api.get("/v1/me/payments").then(unwrap),
  paymentReceipt: (orderCode) =>
    api.get(`/v1/me/payments/${encodeURIComponent(orderCode)}/receipt`).then(unwrap),
};

export const paymentService = paymentsApi;
export default paymentsApi;

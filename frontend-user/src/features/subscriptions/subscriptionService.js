import { api } from "../../shared/api/client";

function unwrap(response) {
    return response?.data ?? response;
}

export const subscriptionService = {
    packages: () => api.get("/v1/packages").then(unwrap),
    current: () => api.get("/v1/me/subscriptions/current").then(unwrap),
    history: () => api.get("/v1/me/subscriptions").then(unwrap),
    purchase: (packageId) => api.post("/v1/me/subscriptions/purchase", { packageId }).then(unwrap),
};

export default subscriptionService;

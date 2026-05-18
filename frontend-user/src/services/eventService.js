import { api } from "../lib/apiClient";

export const eventService = {
    list: () => api.get("/weddings"),
    create: (data) => api.post("/weddings", data),
    update: (id, data) => api.put(`/weddings/${id}`, data),
};

export default eventService;

import { api } from "../api/client";

export const eventService = {
    list: () => api.get("/weddings"),
    create: (data) => api.post("/weddings", data),
    update: (id, data) => api.put(`/weddings/${id}`, data),
};

export default eventService;

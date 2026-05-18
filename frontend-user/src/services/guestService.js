import { api } from "../lib/apiClient";

export const guestService = {
    list: () => api.get("/guests"),
    create: (guest) => api.post("/guests", guest),
    update: (id, guest) => api.put(`/guests/${id}`, guest),
    remove: (id) => api.delete(`/guests/${id}`),
};

export default guestService;

/**
 * កំណត់ចំណាំ: ម៉ូឌុល
 * ឯកសារ: src/shared/services/guestService.js
 */
import { api } from "../api/client";

export const guestService = {
    list: () => api.get("/guests"),
    create: (guest) => api.post("/guests", guest),
    update: (id, guest) => api.put(`/guests/${id}`, guest),
    remove: (id) => api.delete(`/guests/${id}`),
};

export default guestService;

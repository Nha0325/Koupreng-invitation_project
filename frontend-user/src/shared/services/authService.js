/**
 * កំណត់ចំណាំ: API auth
 * ឯកសារ: src/shared/services/authService.js
 * ចាស់: ./services/authService.js
 */
import { api } from "../api/client";

export const authService = {
    login: (email, password) => api.post("/auth/login", { email, password }),
    register: (userData) => api.post("/auth/register", userData),
    logout: () => api.post("/auth/logout"),
};

export default authService;

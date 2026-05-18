import { api } from "../lib/apiClient";

export const authService = {
    login: (email, password) => api.post("/auth/login", { email, password }),
    register: (userData) => api.post("/auth/register", userData),
    logout: () => api.post("/auth/logout"),
};

export default authService;

import { api } from "../api/client";

export const authService = {
    login: (identifier, password) => api.post("/auth/login", { identifier, password }),
    register: (userData) => api.post("/auth/register", userData),
    loginWithGoogle: (idToken) => api.post("/auth/google", { idToken }),
    loginWithTelegram: (loginData) => api.post("/auth/telegram", loginData),
    logout: () => api.post("/auth/logout"),
};

export default authService;

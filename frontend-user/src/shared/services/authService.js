import { api } from "../api/client";

export const authService = {
    login: (identifier, password) => api.post("/auth/login", { identifier, password }, { auth: false }),
    register: (userData) => api.post("/auth/register", userData, { auth: false }),
    loginWithGoogle: (idToken) => api.post("/auth/google", { idToken }, { auth: false }),
    loginWithTelegram: (loginData) => api.post("/auth/telegram", loginData, { auth: false }),
    logout: () => api.post("/auth/logout"),
};

export default authService;

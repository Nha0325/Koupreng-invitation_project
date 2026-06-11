import { api } from "@/services/api/httpClient";

export const authService = {
    login: (identifier, password) => 
        api.post("/auth/login", { identifier, password }, { skipAuth: true }),

    register: (userData) => 
        api.post("/auth/register", userData, { skipAuth: true }),

    loginWithGoogle: (idToken) => 
        api.post("/auth/google", { idToken }, { skipAuth: true }),

    loginWithTelegram: (loginData) => 
        api.post("/auth/telegram", loginData, { skipAuth: true }),

    logout: () => 
        api.post("/auth/logout"),

    me: () => 
        api.get("/auth/me"),

    changePassword: (currentPassword, newPassword) =>
        api.post("/auth/change-password", { currentPassword, newPassword }),

    forgotPassword: (email) =>
        api.post("/auth/forgot-password", { email }, { skipAuth: true }),

    resetPassword: (token, newPassword) =>
        api.post("/auth/reset-password", { token, newPassword }, { skipAuth: true }),
};

export default authService;

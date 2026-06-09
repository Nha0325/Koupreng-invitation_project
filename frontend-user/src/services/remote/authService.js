import { api } from "./api/client";

export const authService = {
    login: (identifier, password) => 
        api.post("/auth/login", { identifier, password }),

    register: (userData) => 
        api.post("/auth/register", userData),

    loginWithGoogle: (idToken) => 
        api.post("/auth/google", { idToken }),

    loginWithTelegram: (loginData) => 
        api.post("/auth/telegram", loginData),

    logout: () => 
        api.post("/auth/logout"),

    me: () => 
        api.get("/auth/me"),

    updateMe: (profileData) =>
        api.put("/auth/me", profileData),

    changePassword: (oldPassword, newPassword) =>
        api.post("/auth/change-password", { oldPassword, newPassword }),

    forgotPassword: (email) =>
        api.post("/auth/forgot-password", { email }),

    resetPassword: (token, newPassword) =>
        api.post("/auth/reset-password", { token, newPassword }),
};

export default authService;

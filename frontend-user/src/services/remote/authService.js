import { api } from "../../shared/api/client";

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
};

export default authService;

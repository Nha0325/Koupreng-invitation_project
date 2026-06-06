import { api } from "./api/client";

export const userService = {
    /** GET /auth/me — fetch current user profile */
    getProfile: () => api.get("/auth/me"),

    /** PUT /auth/me — update profile fields supported by backend */
    updateProfile: (profileData) => api.put("/auth/me", profileData),
};

export default userService;

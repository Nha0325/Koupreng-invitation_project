import { api } from "./api/client";

export const userService = {
    /** GET /auth/me — fetch current user profile */
    getProfile: () => api.get("/auth/me"),

    /** PUT /auth/me — update profile fields supported by backend */
    updateProfile: (profileData) => api.put("/auth/me", profileData),

    /** POST /users/me/profile-image — upload profile avatar. */
    uploadProfileImage: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post("/users/me/profile-image", formData);
    },

    /** POST /auth/change-password — change account password */
    changePassword: (currentPassword, newPassword) =>
        api.post("/auth/change-password", { currentPassword, newPassword }),
};

export default userService;

import { api } from "./api/client";

export const userService = {
    /** GET /auth/me — fetch current user profile */
    getProfile: () => api.get("/auth/me"),

    /** PUT /auth/me — update profile fields supported by backend */
    updateProfile: (profileData) => api.put("/auth/me", profileData),

    /** Placeholder until the backend adds persisted profile image support. */
    uploadProfileImage: async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return { data: { profileImage: null, profileImageUrl: null } };
    },

    /** POST /users/me/change-password — change account password */
    changePassword: (currentPassword, newPassword) =>
        api.post("/users/me/change-password", { currentPassword, newPassword }),
};

export default userService;

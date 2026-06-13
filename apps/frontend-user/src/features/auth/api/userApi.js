import { api } from "@/shared/api/httpClient";

export const userService = {
    /** GET /users/me — fetch current user profile */
    getProfile: () => api.get("/users/me"),

    /** PATCH /users/me — update profile (full_name, phone, profile_image) */
    updateProfile: (profileData) => api.patch("/users/me", profileData),

    /** POST /users/me/profile-image — upload profile image (multipart) */
    uploadProfileImage: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post("/users/me/profile-image", formData);
    },

    /** POST /users/me/change-password — change account password */
    changePassword: (currentPassword, newPassword) =>
        api.post("/users/me/change-password", { currentPassword, newPassword }),
};

export default userService;

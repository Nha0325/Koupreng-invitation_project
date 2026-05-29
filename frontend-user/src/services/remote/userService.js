import { api } from "./api/client";

export const userService = {
    /** GET /users/me/profile — fetch current user profile */
    getProfile: () => api.get("/users/me/profile"),

    /** PUT /users/me/profile — update profile (full_name, phone, profile_image) */
    updateProfile: (profileData) => api.put("/users/me/profile", profileData),

    /** POST /users/me/profile-image — upload profile image (multipart) */
    uploadProfileImage: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post("/users/me/profile-image", formData);
    },
};

export default userService;

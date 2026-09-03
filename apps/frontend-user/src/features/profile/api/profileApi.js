import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

export const profileApi = {
  /** GET /v1/profile – current user profile */
  get: () => api.get("/v1/profile").then(unwrap),

  /** PUT /v1/profile – update profile info */
  update: (data) => api.put("/v1/profile", data).then(unwrap),

  /** POST /v1/profile/avatar – upload avatar image */
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append("file", file);
    return api
      .post("/v1/profile/avatar", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(unwrap);
  },

  /** DELETE /v1/profile/avatar – remove avatar */
  removeAvatar: () => api.delete("/v1/profile/avatar").then(unwrap),
};

export default profileApi;

import client from "../api/client";

function unwrap(request) {
  return request.then((response) => response.data);
}

const userService = {
  getMe: () => unwrap(client.get("/users/me")),

  updateMe: ({ fullName }) =>
    unwrap(client.patch("/users/me", { fullName })),

  changePassword: ({ currentPassword, newPassword }) =>
    unwrap(
      client.post("/users/me/change-password", {
        currentPassword,
        newPassword,
      }),
    ),
};

export default userService;

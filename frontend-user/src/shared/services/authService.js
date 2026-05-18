import client from "../api/client";

function unwrap(request) {
  return request.then((response) => response.data);
}

const authService = {
  login: ({ email, password }) =>
    unwrap(client.post("/auth/login", { email, password }, { public: true })),

  register: ({ email, password, fullName }) =>
    unwrap(
      client.post(
        "/auth/register",
        { email, password, fullName },
        { public: true },
      ),
    ),

  loginWithGoogle: ({ idToken }) =>
    unwrap(client.post("/auth/google", { idToken }, { public: true })),

  loginWithTelegram: (payload) =>
    unwrap(client.post("/auth/telegram", payload, { public: true })),

  logout: (token) =>
    unwrap(
      client.post(
        "/auth/logout",
        undefined,
        token
          ? {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          : undefined,
      ),
    ),

  forgotPassword: ({ email }) =>
    unwrap(client.post("/auth/forgot-password", { email }, { public: true })),

  resetPassword: ({ token, newPassword }) =>
    unwrap(
      client.post(
        "/auth/reset-password",
        { token, newPassword },
        { public: true },
      ),
    ),

  verifyEmail: ({ token }) =>
    unwrap(client.post("/auth/verify-email", { token }, { public: true })),

  resendVerificationEmail: ({ email }) =>
    unwrap(
      client.post("/auth/resend-verification", { email }, { public: true }),
    ),
};

export default authService;

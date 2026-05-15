import { TOKEN_STORAGE_KEY } from "../api/client";
import * as db from "./inMemoryDb";

/**
 * Authentication service (UI-only mode).
 *
 * Originally a thin wrapper around the shared Axios `client`, this module now
 * talks to the in-memory user store (`./inMemoryDb`) so the user app can run
 * end-to-end in the browser without a backend. The public surface is
 * unchanged on purpose so the rest of the app — `AuthContext`, the auth
 * pages, the route guard — stays oblivious:
 *
 *     const { accessToken, user } = await authService.login({ email, password });
 *
 * Each method returns a Promise so call sites can keep using `await`. Errors
 * thrown by the store (`USER_NOT_FOUND`, `INVALID_PASSWORD`, …) propagate as
 * `Error` instances with a `code` property so the UI can branch on them.
 */

/**
 * Read the current bearer token from localStorage. The token-key constant is
 * shared with `client.js` so any future migration back to a real API keeps
 * working without touching every caller.
 */
function readToken() {
  try {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
  return null;
}

const authService = {
  /**
   * "POST /auth/login" — exchange credentials for a token + user.
   *
   * Accepts either an email or a phone number in the `email` field to keep
   * parity with the login form, which reuses one input for both.
   *
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ accessToken: string, user: object }>}
   */
  async login({ email, password }) {
    return db.login({ email, password });
  },

  /**
   * "POST /auth/logout" — invalidate the current token. Always resolves.
   *
   * @returns {Promise<{ ok: true }>}
   */
  async logout() {
    const token = readToken();
    return db.logout(token);
  },

  /**
   * "POST /auth/register" — create a new account and immediately mint a
   * session for it so the user is dropped straight into the host app.
   *
   * @param {{ name: string, email?: string, phone?: string, password: string }} payload
   * @returns {Promise<{ accessToken: string, user: object }>}
   */
  async register({ name, email, phone, password }) {
    return db.register({ name, email, phone, password });
  },

  /**
   * "POST /auth/forgot-password" — request a one-time code for the given
   * email or phone. The store logs the OTP to the console in dev so the
   * flow can be completed without a real mail/SMS provider.
   *
   * @param {{ email: string }} payload — the field is named `email` to keep
   *   the existing API signature, but a phone number is also accepted.
   * @returns {Promise<{ ok: true, devOtp: string }>}
   */
  async forgotPassword({ email }) {
    return db.requestOtp({ identifier: email });
  },

  /**
   * Verify an OTP and obtain a short-lived reset token.
   *
   * @param {{ identifier: string, code: string }} payload
   * @returns {Promise<{ resetToken: string }>}
   */
  async verifyOtp({ identifier, code }) {
    return db.verifyOtp({ identifier, code });
  },

  /**
   * "POST /auth/reset-password" — finish the reset using the token returned
   * by `verifyOtp`.
   *
   * @param {{ token: string, password: string }} payload
   * @returns {Promise<{ ok: true }>}
   */
  async resetPassword({ token, password }) {
    return db.resetPassword({ token, password });
  },

  /**
   * "GET /users/me" — fetch the authenticated user's profile.
   *
   * @returns {Promise<object>}
   */
  async me() {
    const token = readToken();
    const user = db.getUserByToken(token);
    if (!user) {
      const err = new Error("មិនបានចូលគណនី");
      err.code = "UNAUTHENTICATED";
      throw err;
    }
    return user;
  },

  /**
   * "POST /users/me/change-password" — change the password for the current
   * authenticated user.
   *
   * @param {{ currentPassword: string, newPassword: string }} payload
   * @returns {Promise<{ ok: true }>}
   */
  async changePassword({ currentPassword, newPassword }) {
    const token = readToken();
    return db.changePassword(token, { currentPassword, newPassword });
  },
};

export default authService;

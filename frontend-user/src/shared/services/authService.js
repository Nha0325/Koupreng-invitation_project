import client from '../api/client';

/**
 * Authentication service.
 *
 * Thin wrapper around the shared Axios `client`. Every method awaits the
 * client promise and returns the unwrapped response payload (`response.data`)
 * so call sites stay terse:
 *
 *     const { accessToken, user } = await authService.login({ email, password });
 *
 * Endpoints map 1:1 to the Spring Boot controllers under `/api/auth/*` and
 * `/api/users/me`. Errors propagate as raw Axios errors; UI callers should
 * funnel them through `parseError` from `../api/errors.js` before display.
 */
const authService = {
  /**
   * POST `/auth/login` — exchange credentials for a JWT.
   *
   * @param {{ email: string, password: string }} credentials
   * @returns {Promise<{ accessToken: string, user: object }>}
   */
  async login({ email, password }) {
    const response = await client.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * POST `/auth/logout` — invalidate the current session on the server.
   *
   * @returns {Promise<unknown>}
   */
  async logout() {
    const response = await client.post('/auth/logout');
    return response.data;
  },

  /**
   * POST `/auth/register` — create a new account.
   *
   * @param {{ email: string, password: string, name: string }} payload
   * @returns {Promise<unknown>}
   */
  async register({ email, password, name }) {
    const response = await client.post('/auth/register', { email, password, name });
    return response.data;
  },

  /**
   * POST `/auth/forgot-password` — request a reset email.
   *
   * @param {{ email: string }} payload
   * @returns {Promise<unknown>}
   */
  async forgotPassword({ email }) {
    const response = await client.post('/auth/forgot-password', { email });
    return response.data;
  },

  /**
   * POST `/auth/reset-password` — complete the reset using a one-time token.
   *
   * @param {{ token: string, password: string }} payload
   * @returns {Promise<unknown>}
   */
  async resetPassword({ token, password }) {
    const response = await client.post('/auth/reset-password', { token, password });
    return response.data;
  },

  /**
   * GET `/users/me` — fetch the authenticated user's profile.
   *
   * @returns {Promise<object>}
   */
  async me() {
    const response = await client.get('/users/me');
    return response.data;
  },

  /**
   * POST `/users/me/change-password` — change the password for the
   * authenticated user.
   *
   * @param {{ currentPassword: string, newPassword: string }} payload
   * @returns {Promise<unknown>}
   */
  async changePassword({ currentPassword, newPassword }) {
    const response = await client.post('/users/me/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

export default authService;

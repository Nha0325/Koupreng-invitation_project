import client from '../api/client';

/**
 * User profile service.
 *
 * Calls against `/users/me`. Methods unwrap `response.data` so callers
 * receive the profile payload directly. Errors should be funneled through
 * `parseError` from `../api/errors.js` at the UI layer.
 */
const userService = {
    /**
     * GET `/users/me` — current authenticated user's profile.
     *
     * @returns {Promise<object>}
     */
    async getMe() {
        const response = await client.get('/users/me');
        return response.data;
    },

    /**
     * PUT `/users/me` — update the authenticated user's profile.
     *
     * @param {object} payload
     * @returns {Promise<object>}
     */
    async updateMe(payload) {
        const response = await client.put('/users/me', payload);
        return response.data;
    },
};

export default userService;

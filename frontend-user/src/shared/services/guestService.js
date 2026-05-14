import client from '../api/client';

/**
 * Guest service.
 *
 * Wraps `/guests/*`. The `getByToken` lookup is the public-invitation
 * personalization call (resolves `?g=<token>` on the invitation route) and
 * therefore sets `config.public = true` to skip the Authorization header.
 *
 * Mocks are returned behind the `VITE_USE_MOCK` flag because the backend
 * has not implemented these endpoints yet.
 */
const MOCK =
    typeof import.meta !== 'undefined' &&
        import.meta.env &&
        import.meta.env.VITE_USE_MOCK !== undefined
        ? import.meta.env.VITE_USE_MOCK === 'true'
        : true;

/**
 * Canonical sample guest used by the mock branch.
 *
 * Matches the shape of `GuestModel` from design.md → "Data Models".
 */
const SAMPLE_GUEST = {
    id: 'gst_panha_001',
    token: 'sample-token',
    name: 'Mr. Panha',
    partyMaxSize: 2,
    status: 'pending',
};

const guestService = {
    /**
     * GET `/guests?eventId=:id` — list guests for an event (host-side).
     *
     * @param {string} eventId
     * @returns {Promise<object[]>}
     */
    async list(eventId) {
        if (MOCK) {
            return [{ ...SAMPLE_GUEST }];
        }
        const response = await client.get('/guests', { params: { eventId } });
        return response.data;
    },

    /**
     * GET `/guests/token/:token` — public lookup used by the invitation
     * route to resolve `?g=<token>` into a personalized greeting. Sets
     * `config.public = true`.
     *
     * @param {string} token
     * @returns {Promise<object>}
     */
    async getByToken(token) {
        if (MOCK) {
            return { ...SAMPLE_GUEST, token };
        }
        const response = await client.get(`/guests/token/${token}`, { public: true });
        return response.data;
    },
};

export default guestService;

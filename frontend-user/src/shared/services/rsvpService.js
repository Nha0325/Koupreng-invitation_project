import client from '../api/client';
import { parseError } from '../api/errors';

/**
 * RSVP submission service.
 *
 * Public endpoint — never sends an Authorization header (the request
 * interceptor honors `config.public = true`). Errors are wrapped via
 * `parseError` so callers always see the typed `ApiError` shape.
 */
const rsvpService = {
    /**
     * POST `/rsvp` — submit a guest response.
     *
     * @param {object} payload — `{ eventSlug, guestToken?, attending, partySize, dietary?, note? }`
     * @returns {Promise<object>} — server-stored RSVP record
     * @throws {import('../api/errors').ApiError}
     */
    async submit(payload) {
        try {
            const response = await client.post('/rsvp', payload, { public: true });
            return response.data;
        } catch (err) {
            throw parseError(err);
        }
    },
};

export default rsvpService;

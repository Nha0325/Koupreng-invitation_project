/**
 * Typed error helpers for the SPA's HTTP layer.
 *
 * The Axios `client` rejects with raw Axios errors. UI callers (RSVP form,
 * login, dashboard widgets) want a uniform shape so they can show
 * user-facing messages without knowing whether the failure came from the
 * network, a 4xx, a 5xx, or a non-Axios throw.
 *
 * `parseError` is the funnel: pass anything you caught and you get back an
 * `ApiError` with `{ code, message, status }`.
 */

/**
 * Stable error contract used across the app.
 *
 * Fields:
 * - `code`    — short machine-readable identifier (e.g. `RSVP_CONFLICT`,
 *               `NETWORK_ERROR`, `UNKNOWN`). Defaults to `'UNKNOWN'`.
 * - `message` — human-readable message safe to render in UI.
 * - `status`  — HTTP status code; `0` when the request never reached a
 *               server (network error, CORS, abort, non-Axios throw).
 */
export class ApiError extends Error {
    /**
     * @param {{ code?: string, message?: string, status?: number }} [params]
     */
    constructor({ code = 'UNKNOWN', message = 'Request failed', status = 0 } = {}) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.message = message;
        this.status = status;
    }
}

/**
 * Map any thrown value to an `ApiError`.
 *
 * - If `err` is already an `ApiError`, it is returned untouched.
 * - If `err` looks like an Axios error (`isAxiosError === true` or
 *   `err.response` is present), pull `code`, `message`, and `status` from
 *   the response payload, falling back to the Axios-level fields.
 * - Plain `Error` instances surface their `message` with `code: 'UNKNOWN'`
 *   and `status: 0`.
 * - Anything else is coerced via `String(err)`.
 *
 * Always returns an `ApiError` — never throws and never returns `null`.
 *
 * @param {unknown} err
 * @returns {ApiError}
 */
export function parseError(err) {
    if (err instanceof ApiError) {
        return err;
    }

    if (err && typeof err === 'object') {
        const maybeAxios = /** @type {{ isAxiosError?: boolean, response?: { status?: number, data?: { code?: string, message?: string } }, code?: string, message?: string }} */ (
            err
        );

        if (maybeAxios.isAxiosError === true || maybeAxios.response) {
            const status = maybeAxios.response?.status ?? 0;
            const code =
                maybeAxios.response?.data?.code ??
                maybeAxios.code ??
                'UNKNOWN';
            const message =
                maybeAxios.response?.data?.message ??
                maybeAxios.message ??
                'Request failed';

            return new ApiError({ code, message, status });
        }
    }

    if (err instanceof Error) {
        return new ApiError({
            code: 'UNKNOWN',
            message: err.message || 'Request failed',
            status: 0,
        });
    }

    return new ApiError({
        code: 'UNKNOWN',
        message: String(err),
        status: 0,
    });
}

import { TOKEN_STORAGE_KEY } from "../api/client";
import * as db from "./inMemoryDb";

/**
 * User profile service (UI-only mode).
 *
 * Sibling of `authService` — talks to the in-memory store in `./inMemoryDb`
 * instead of a real backend. Method shapes are preserved so callers
 * (e.g. `AuthProvider.refresh()`) don't change.
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

const userService = {
    /**
     * "GET /users/me" — current authenticated user's profile.
     *
     * @returns {Promise<object>}
     */
    async getMe() {
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
     * "PUT /users/me" — update the authenticated user's profile.
     *
     * @param {{ name?: string, email?: string, phone?: string }} payload
     * @returns {Promise<object>}
     */
    async updateMe(payload) {
        const token = readToken();
        return db.updateUser(token, payload);
    },
};

export default userService;

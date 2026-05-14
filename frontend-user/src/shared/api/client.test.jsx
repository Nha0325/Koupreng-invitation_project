import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import client, { AUTH_EXPIRED_EVENT, TOKEN_STORAGE_KEY } from "./client";

/**
 * Adapter that resolves with a successful response and captures the request
 * config it was invoked with so tests can assert on the headers we attached.
 */
function createSuccessAdapter() {
    const calls = [];
    const adapter = (config) => {
        calls.push(config);
        return Promise.resolve({
            data: {},
            status: 200,
            statusText: "OK",
            headers: {},
            config,
        });
    };
    return { adapter, calls };
}

/**
 * Adapter that rejects with a 401 axios-shaped error. The rejection carries the
 * resolved request `config` so the response interceptor can decide whether the
 * call was authed.
 */
function create401Adapter() {
    const calls = [];
    const adapter = (config) => {
        calls.push(config);
        return Promise.reject({
            isAxiosError: true,
            response: { status: 401, data: {}, headers: {}, statusText: "Unauthorized", config },
            config,
        });
    };
    return { adapter, calls };
}

describe("shared/api/client", () => {
    let originalAdapter;

    beforeEach(() => {
        originalAdapter = client.defaults.adapter;
        // Each test starts with a clean storage slate so token state is explicit.
        localStorage.clear();
    });

    afterEach(() => {
        client.defaults.adapter = originalAdapter;
        localStorage.clear();
        vi.restoreAllMocks();
    });

    describe("request interceptor", () => {
        it("attaches Authorization: Bearer <token> when a token is in localStorage", async () => {
            localStorage.setItem(TOKEN_STORAGE_KEY, "abc");
            const { adapter, calls } = createSuccessAdapter();
            client.defaults.adapter = adapter;

            await client.get("/whoami");

            expect(calls).toHaveLength(1);
            expect(calls[0].headers.Authorization).toBe("Bearer abc");
        });

        it("does not set Authorization when no token is stored", async () => {
            const { adapter, calls } = createSuccessAdapter();
            client.defaults.adapter = adapter;

            await client.get("/public/ping");

            expect(calls).toHaveLength(1);
            expect(calls[0].headers.Authorization).toBeUndefined();
        });

        it("skips the Authorization header when config.public === true", async () => {
            localStorage.setItem(TOKEN_STORAGE_KEY, "abc");
            const { adapter, calls } = createSuccessAdapter();
            client.defaults.adapter = adapter;

            await client.get("/invitations/panha-lyly", { public: true });

            expect(calls).toHaveLength(1);
            expect(calls[0].headers.Authorization).toBeUndefined();
        });
    });

    describe("response interceptor", () => {
        it("dispatches auth:expired and clears the token on 401 from an authed request", async () => {
            localStorage.setItem(TOKEN_STORAGE_KEY, "abc");
            const { adapter } = create401Adapter();
            client.defaults.adapter = adapter;

            const listener = vi.fn();
            window.addEventListener(AUTH_EXPIRED_EVENT, listener);

            try {
                await expect(client.get("/me")).rejects.toMatchObject({
                    response: { status: 401 },
                });

                expect(listener).toHaveBeenCalledTimes(1);
                expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
            } finally {
                window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
            }
        });

        it("does not dispatch auth:expired when the 401 came from a public request", async () => {
            // No token in localStorage and config.public === true means no Authorization
            // header was sent, so a 401 here should NOT log the user out.
            const { adapter } = create401Adapter();
            client.defaults.adapter = adapter;

            const listener = vi.fn();
            window.addEventListener(AUTH_EXPIRED_EVENT, listener);

            try {
                await expect(
                    client.get("/invitations/panha-lyly", { public: true }),
                ).rejects.toMatchObject({
                    response: { status: 401 },
                });

                expect(listener).not.toHaveBeenCalled();
            } finally {
                window.removeEventListener(AUTH_EXPIRED_EVENT, listener);
            }
        });
    });
});

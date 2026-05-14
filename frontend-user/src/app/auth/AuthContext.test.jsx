import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import { useContext } from "react";
import client, {
    AUTH_EXPIRED_EVENT,
    TOKEN_STORAGE_KEY,
} from "../../shared/api/client";
import authService from "../../shared/services/authService";
import userService from "../../shared/services/userService";
import { AuthContext, AuthProvider } from "./AuthContext";
import useAuth from "./useAuth";

/**
 * Test harness that exposes the AuthContext value to the DOM so assertions can
 * inspect it without a separate hook indirection. This mirrors how host pages
 * will consume the provider (via `useAuth`) but keeps the surface narrow.
 */
function ContextProbe() {
    const auth = useContext(AuthContext);
    if (!auth) return <div data-testid="probe">no-context</div>;
    return (
        <div data-testid="probe">
            <span data-testid="status">{auth.status}</span>
            <span data-testid="token">{auth.token ?? ""}</span>
            <span data-testid="user">
                {auth.user ? JSON.stringify(auth.user) : ""}
            </span>
            <button
                type="button"
                data-testid="login"
                onClick={() => auth.login("from-button", { id: 9 })}
            >
                login
            </button>
            <button
                type="button"
                data-testid="login-payload"
                onClick={() =>
                    auth.login({ accessToken: "payload-token", user: { id: 11 } })
                }
            >
                login-payload
            </button>
            <button type="button" data-testid="logout" onClick={() => auth.logout()}>
                logout
            </button>
            <button
                type="button"
                data-testid="refresh"
                onClick={() => {
                    auth.refresh().catch(() => { });
                }}
            >
                refresh
            </button>
        </div>
    );
}

describe("app/auth/AuthContext", () => {
    let originalAdapter;

    beforeEach(() => {
        originalAdapter = client.defaults.adapter;
        localStorage.clear();
    });

    afterEach(() => {
        client.defaults.adapter = originalAdapter;
        localStorage.clear();
        vi.restoreAllMocks();
    });

    describe("hydration on mount", () => {
        it("starts unauthenticated when no token is stored", async () => {
            const getMeSpy = vi.spyOn(userService, "getMe");

            render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            expect(screen.getByTestId("status").textContent).toBe(
                "unauthenticated",
            );
            expect(getMeSpy).not.toHaveBeenCalled();
        });

        it("hydrates the user via userService.getMe when a token is present", async () => {
            localStorage.setItem(TOKEN_STORAGE_KEY, "stored-token");
            const profile = { id: 1, email: "a@b.co" };
            const getMeSpy = vi
                .spyOn(userService, "getMe")
                .mockResolvedValue(profile);

            render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            // Provider exposes 'loading' until the profile resolves.
            expect(screen.getByTestId("status").textContent).toBe("loading");

            await waitFor(() => {
                expect(screen.getByTestId("status").textContent).toBe(
                    "authenticated",
                );
            });

            expect(getMeSpy).toHaveBeenCalledTimes(1);
            expect(screen.getByTestId("token").textContent).toBe("stored-token");
            expect(screen.getByTestId("user").textContent).toContain("a@b.co");
        });

        it("clears a stale token and falls back to unauthenticated when getMe rejects", async () => {
            localStorage.setItem(TOKEN_STORAGE_KEY, "stale-token");
            vi.spyOn(userService, "getMe").mockRejectedValue(
                new Error("expired"),
            );

            render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId("status").textContent).toBe(
                    "unauthenticated",
                );
            });

            expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
            expect(screen.getByTestId("token").textContent).toBe("");
        });
    });

    describe("login()", () => {
        it("persists the token and flips into authenticated when called with (token, user)", async () => {
            render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            await act(async () => {
                screen.getByTestId("login").click();
            });

            expect(screen.getByTestId("status").textContent).toBe(
                "authenticated",
            );
            expect(screen.getByTestId("token").textContent).toBe("from-button");
            expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe("from-button");
        });

        it("accepts the { accessToken, user } shape from auth pages", async () => {
            render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            await act(async () => {
                screen.getByTestId("login-payload").click();
            });

            expect(screen.getByTestId("status").textContent).toBe(
                "authenticated",
            );
            expect(screen.getByTestId("token").textContent).toBe(
                "payload-token",
            );
            expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBe(
                "payload-token",
            );
            expect(screen.getByTestId("user").textContent).toContain('"id":11');
        });
    });

    describe("logout()", () => {
        it("clears the token, resets state, and fires authService.logout", async () => {
            localStorage.setItem(TOKEN_STORAGE_KEY, "stored-token");
            vi.spyOn(userService, "getMe").mockResolvedValue({ id: 7 });
            const logoutSpy = vi
                .spyOn(authService, "logout")
                .mockResolvedValue(undefined);

            render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId("status").textContent).toBe(
                    "authenticated",
                );
            });

            await act(async () => {
                screen.getByTestId("logout").click();
            });

            expect(screen.getByTestId("status").textContent).toBe(
                "unauthenticated",
            );
            expect(screen.getByTestId("token").textContent).toBe("");
            expect(screen.getByTestId("user").textContent).toBe("");
            expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
            expect(logoutSpy).toHaveBeenCalledTimes(1);
        });

        it("swallows authService.logout failures (fire-and-forget)", async () => {
            vi.spyOn(authService, "logout").mockRejectedValue(
                new Error("network down"),
            );

            render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            await act(async () => {
                screen.getByTestId("login").click();
            });

            await act(async () => {
                screen.getByTestId("logout").click();
            });

            // No unhandled rejection should surface; state still becomes unauthenticated.
            expect(screen.getByTestId("status").textContent).toBe(
                "unauthenticated",
            );
        });
    });

    describe("refresh()", () => {
        it("re-fetches the profile via userService.getMe", async () => {
            const getMeSpy = vi
                .spyOn(userService, "getMe")
                .mockResolvedValueOnce({ id: 1, email: "first@x.io" })
                .mockResolvedValueOnce({ id: 1, email: "second@x.io" });
            localStorage.setItem(TOKEN_STORAGE_KEY, "stored-token");

            render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId("status").textContent).toBe(
                    "authenticated",
                );
            });
            expect(screen.getByTestId("user").textContent).toContain(
                "first@x.io",
            );

            await act(async () => {
                screen.getByTestId("refresh").click();
            });

            await waitFor(() => {
                expect(screen.getByTestId("user").textContent).toContain(
                    "second@x.io",
                );
            });

            expect(getMeSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe("auth:expired listener", () => {
        it("logs the user out when the api client dispatches auth:expired", async () => {
            localStorage.setItem(TOKEN_STORAGE_KEY, "stored-token");
            vi.spyOn(userService, "getMe").mockResolvedValue({ id: 1 });
            vi.spyOn(authService, "logout").mockResolvedValue(undefined);

            render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            await waitFor(() => {
                expect(screen.getByTestId("status").textContent).toBe(
                    "authenticated",
                );
            });

            await act(async () => {
                window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT));
            });

            expect(screen.getByTestId("status").textContent).toBe(
                "unauthenticated",
            );
            expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
        });

        it("removes the auth:expired listener on unmount", async () => {
            const addSpy = vi.spyOn(window, "addEventListener");
            const removeSpy = vi.spyOn(window, "removeEventListener");

            const { unmount } = render(
                <AuthProvider>
                    <ContextProbe />
                </AuthProvider>,
            );

            const added = addSpy.mock.calls.some(
                ([event]) => event === AUTH_EXPIRED_EVENT,
            );
            expect(added).toBe(true);

            unmount();

            const removed = removeSpy.mock.calls.some(
                ([event]) => event === AUTH_EXPIRED_EVENT,
            );
            expect(removed).toBe(true);
        });
    });

    describe("useAuth()", () => {
        it("throws a helpful error when used outside <AuthProvider>", () => {
            function Bare() {
                useAuth();
                return null;
            }

            // Suppress the expected React error log so test output stays clean.
            const errSpy = vi.spyOn(console, "error").mockImplementation(() => { });
            try {
                expect(() => render(<Bare />)).toThrow(
                    /useAuth must be used within an <AuthProvider>/,
                );
            } finally {
                errSpy.mockRestore();
            }
        });

        it("returns the context value when wrapped in <AuthProvider>", () => {
            function Probe() {
                const auth = useAuth();
                return <div data-testid="hook-status">{auth.status}</div>;
            }

            render(
                <AuthProvider>
                    <Probe />
                </AuthProvider>,
            );

            expect(screen.getByTestId("hook-status").textContent).toBe(
                "unauthenticated",
            );
        });
    });
});

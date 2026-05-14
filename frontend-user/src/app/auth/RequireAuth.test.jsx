import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import {
    MemoryRouter,
    Route,
    Routes,
    useLocation,
} from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { RequireAuth } from "./RequireAuth";

/**
 * Render `<RequireAuth />` with a synthetic AuthContext value and a
 * MemoryRouter pre-seeded to `initialEntry`. The caller supplies the
 * `<Route>` children inside `routes` so each test can shape the route
 * tree it needs (protected child, fake `/login` page, etc.).
 *
 * Injecting `AuthContext.Provider` directly avoids spinning up the real
 * `<AuthProvider>` (which would call `userService.getMe`) and keeps these
 * tests fully deterministic without any module-level mocks.
 */
function renderWithAuth(authValue, initialEntry, routes) {
    return render(
        <AuthContext.Provider value={authValue}>
            <MemoryRouter initialEntries={[initialEntry]}>{routes}</MemoryRouter>
        </AuthContext.Provider>,
    );
}

/**
 * Minimal stand-in for the real protected page. If this renders, it
 * confirms `<RequireAuth />` rendered the `<Outlet />` for the matched
 * child route.
 */
function ProtectedChild() {
    return <div data-testid="protected">protected content</div>;
}

/**
 * Stand-in for the real `/login` route. Reads the current `location.search`
 * via `useLocation` so the redirect test can assert that `?next=...` was
 * preserved with the original (encoded) path + query.
 */
function FakeLoginPage() {
    const location = useLocation();
    return (
        <div data-testid="login">
            <span data-testid="login-search">{location.search}</span>
        </div>
    );
}

describe("RequireAuth", () => {
    it("renders the loading placeholder while auth is hydrating", () => {
        // status === 'loading' — the guard should render its own placeholder
        // and must NOT render the protected child yet.
        const auth = {
            user: null,
            token: null,
            status: "loading",
            login: () => { },
            logout: () => { },
            refresh: async () => null,
        };

        renderWithAuth(
            auth,
            "/app/dashboard",
            <Routes>
                <Route element={<RequireAuth />}>
                    <Route path="/app/dashboard" element={<ProtectedChild />} />
                </Route>
            </Routes>,
        );

        const loader = screen.getByRole("status", { name: /loading/i });
        expect(loader).toBeInTheDocument();
        expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
    });

    it("redirects unauthenticated users to /login with an encoded ?next= param", () => {
        // status === 'unauthenticated' — the guard should `<Navigate />` to
        // /login and preserve the original path + query string in `?next=`,
        // url-encoded so nested paths and query separators survive the round
        // trip.
        const auth = {
            user: null,
            token: null,
            status: "unauthenticated",
            login: () => { },
            logout: () => { },
            refresh: async () => null,
        };

        const originalPath = "/app/dashboard?tab=guests";
        const expectedNext = encodeURIComponent(originalPath);

        renderWithAuth(
            auth,
            originalPath,
            <Routes>
                <Route element={<RequireAuth />}>
                    <Route path="/app/dashboard" element={<ProtectedChild />} />
                </Route>
                <Route path="/login" element={<FakeLoginPage />} />
            </Routes>,
        );

        // We landed on the fake login page, not the protected child.
        expect(screen.getByTestId("login")).toBeInTheDocument();
        expect(screen.queryByTestId("protected")).not.toBeInTheDocument();

        // And `?next=` carries the exact encoded original path + query.
        const search = screen.getByTestId("login-search").textContent;
        expect(search).toBe(`?next=${expectedNext}`);
    });

    it("renders the matched child <Outlet /> when authenticated", () => {
        // status === 'authenticated' — the guard should pass through to the
        // child route's element via `<Outlet />`.
        const auth = {
            user: { id: "u1", email: "host@example.com" },
            token: "tok-abc",
            status: "authenticated",
            login: () => { },
            logout: () => { },
            refresh: async () => null,
        };

        renderWithAuth(
            auth,
            "/app/dashboard",
            <Routes>
                <Route element={<RequireAuth />}>
                    <Route path="/app/dashboard" element={<ProtectedChild />} />
                </Route>
            </Routes>,
        );

        expect(screen.getByTestId("protected")).toBeInTheDocument();
        expect(screen.getByTestId("protected")).toHaveTextContent(
            "protected content",
        );
        // No loading placeholder when authenticated.
        expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("uses <Outlet /> so nested route content is what renders", () => {
        // Belt-and-braces sanity check: prove the authenticated branch is
        // delegating to react-router's Outlet rather than rendering a fixed
        // child. We swap in a different child and confirm it appears.
        function OtherChild() {
            return <div data-testid="other">other content</div>;
        }

        const auth = {
            user: { id: "u1" },
            token: "tok",
            status: "authenticated",
            login: () => { },
            logout: () => { },
            refresh: async () => null,
        };

        renderWithAuth(
            auth,
            "/app/events",
            <Routes>
                <Route element={<RequireAuth />}>
                    <Route path="/app/events" element={<OtherChild />} />
                    <Route
                        path="/app/dashboard"
                        element={<ProtectedChild />}
                    />
                </Route>
            </Routes>,
        );

        expect(screen.getByTestId("other")).toBeInTheDocument();
        expect(screen.queryByTestId("protected")).not.toBeInTheDocument();
    });
});

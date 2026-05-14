import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";
import Spinner from "../../shared/ui/Spinner";

/**
 * `<RequireAuth />` is the route guard for the `/app/*` host group.
 *
 * Behavior (matches design → Routing & guard invariants):
 *
 *   - `status === 'loading'`        → render a centered spinner placeholder
 *   - `status === 'unauthenticated'` → `<Navigate to="/login?next=..." replace />`,
 *                                       preserving the originally requested path
 *                                       (and query string) so the login flow can
 *                                       restore it after a successful sign-in.
 *   - otherwise                     → `<Outlet />`
 *
 * The original location is encoded with `encodeURIComponent` so that nested
 * paths and query strings (`/app/events/123?tab=guests`) survive the round
 * trip through the URL.
 *
 * Used as a layout route:
 *
 *   <Route element={<RequireAuth />}>
 *     <Route path="/app/dashboard" element={<DashboardPage />} />
 *   </Route>
 */
export function RequireAuth() {
    const { status } = useAuth();
    const location = useLocation();

    if (status === "loading") {
        // Render the shared accessible `<Spinner />` (`role="status"`) so
        // screen readers announce the busy state. The wrapper centers the
        // spinner in the viewport while auth is hydrating.
        return (
            <div
                style={{
                    display: "flex",
                    minHeight: "100dvh",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Spinner size={32} aria-label="Loading" />
            </div>
        );
    }

    if (status === "unauthenticated") {
        const encodedPath = encodeURIComponent(
            location.pathname + location.search,
        );
        return <Navigate to={`/login?next=${encodedPath}`} replace />;
    }

    return <Outlet />;
}

export default RequireAuth;

import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./auth/RequireAuth";
import HostShell from "../shared/layout/HostShell";
import MarketingShell from "../shared/layout/MarketingShell";
import InvitationShell from "../shared/layout/InvitationShell";
import Spinner from "../shared/ui/Spinner";

/**
 * Application router.
 *
 * Implements the design's Routing Map exactly. The route tree is built from
 * three layout routes — `<MarketingShell>`, `<RequireAuth><HostShell>`, and
 * `<InvitationShell>` — which give each audience its own chrome (full marketing
 * header, authenticated host shell, or no chrome at all) without each page
 * having to re-declare it.
 *
 * Every page module is loaded with `React.lazy(...)` and the whole tree is
 * wrapped in a single top-level `<Suspense fallback={<Spinner />}>` so the
 * initial bundle stays small and route-level chunks are streamed in on demand.
 *
 * Top-level providers (`MotionConfig`, `ThemeProvider`, `AuthProvider`) live
 * in `App.jsx` — this file only owns routing.
 */

/* ───────────────────────────────────────────────────────────────────
 * Lazy page imports
 *
 * Each `lazy(() => import(...))` call produces a separate chunk so the
 * marketing visitor never downloads the host dashboard, and the public
 * invitation never downloads the host shell.
 * ─────────────────────────────────────────────────────────────────── */

// Marketing / auth
const HomePage = lazy(() => import("../pages/marketing/HomePage"));
const NotFoundPage = lazy(() => import("../pages/marketing/NotFoundPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("../pages/auth/RegisterPage"));
const ForgotPasswordPage = lazy(() =>
    import("../pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(() =>
    import("../pages/auth/ResetPasswordPage"),
);

// Host (authenticated)
const DashboardPage = lazy(() => import("../pages/host/DashboardPage"));
const EventsPage = lazy(() => import("../pages/host/EventsPage"));
const CreateEventPage = lazy(() => import("../pages/host/CreateEventPage"));
const GuestsPage = lazy(() => import("../pages/host/GuestsPage"));
const ExpensesPage = lazy(() => import("../pages/host/ExpensesPage"));
const WeddingGiftPage = lazy(() => import("../pages/host/WeddingGiftPage"));
const TemplatePage = lazy(() => import("../pages/host/TemplatePage"));
const AddTemplatePage = lazy(() => import("../pages/host/AddTemplatePage"));
const SettingsPage = lazy(() => import("../pages/host/SettingsPage"));

// Public invitation
const InvitationPage = lazy(() =>
    import("../invitation/pages/InvitationPage"),
);

/**
 * Centered spinner used as the Suspense fallback while a lazy chunk loads.
 * Mirrors the loader rendered by `<RequireAuth />` so transitions feel
 * consistent across guarded and unguarded routes.
 */
const SuspenseFallback = () => (
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

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<SuspenseFallback />}>
                <Routes>
                    {/* ── Marketing / auth (public, header chrome) ── */}
                    <Route element={<MarketingShell />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPasswordPage />}
                        />
                        <Route
                            path="/reset-password"
                            element={<ResetPasswordPage />}
                        />
                        {/* Catch-all 404 lives inside the marketing shell so
                            visitors keep the header and can navigate home. */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>

                    {/* ── Host app (authed, header + aside chrome) ──
                        `<RequireAuth />` is the outer layout route so its
                        guard runs before `<HostShell />` ever mounts. */}
                    <Route element={<RequireAuth />}>
                        <Route element={<HostShell />}>
                            {/* `/app` alone redirects to the dashboard so the
                                bare host root is never a blank page. */}
                            <Route
                                path="/app"
                                element={
                                    <Navigate to="/app/dashboard" replace />
                                }
                            />
                            <Route
                                path="/app/dashboard"
                                element={<DashboardPage />}
                            />
                            <Route
                                path="/app/events"
                                element={<EventsPage />}
                            />
                            <Route
                                path="/app/events/new"
                                element={<CreateEventPage />}
                            />
                            <Route
                                path="/app/guests"
                                element={<GuestsPage />}
                            />
                            <Route
                                path="/app/expenses"
                                element={<ExpensesPage />}
                            />
                            <Route
                                path="/app/gifts"
                                element={<WeddingGiftPage />}
                            />
                            <Route
                                path="/app/templates"
                                element={<TemplatePage />}
                            />
                            <Route
                                path="/app/templates/new"
                                element={<AddTemplatePage />}
                            />
                            <Route
                                path="/app/settings"
                                element={<SettingsPage />}
                            />
                        </Route>
                    </Route>

                    {/* ── Public invitation (no auth, no chrome) ── */}
                    <Route element={<InvitationShell />}>
                        <Route path="/i/:slug" element={<InvitationPage />} />
                        <Route
                            path="/invitation/:slug"
                            element={<InvitationPage />}
                        />
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default AppRouter;

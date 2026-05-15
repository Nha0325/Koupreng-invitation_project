import { Outlet } from "react-router-dom";
import Header from "./Header";
import PageTransition from "../ui/PageTransition";
import Toaster from "../ui/Toaster";

/**
 * MarketingShell
 *
 * Public chrome for the marketing homepage (`/`). Per the design's Routing
 * Map and "Component Architecture" section, the homepage gets the site
 * `<Header />` only — no authenticated `<Aside />` — and the matched child
 * route is rendered through react-router's `<Outlet />`, wrapped in
 * `<PageTransition>` so navigation animates.
 *
 * The auth pages (`/login`, `/register`, `/forgot-password`,
 * `/reset-password`) and the `*` 404 use `<AuthShell />` instead so they can
 * present a header-less, focused canvas.
 *
 * A `<Toaster />` is mounted at the shell level so any marketing page (or any
 * service called from inside it, e.g. forgot-password confirmation) can
 * raise non-blocking feedback without each page wiring its own.
 *
 * Layout structure:
 *   <Header />                                ← fixed top bar (already self-spacing)
 *   <main>
 *     <PageTransition><Outlet /></PageTransition>
 *   </main>
 *   <Toaster />                               ← fixed-position toast portal
 *
 * The component takes no props; the surrounding `<Routes>` feeds the outlet.
 */
const MarketingShell = () => {
    return (
        <>
            <Header />
            <main>
                <PageTransition>
                    <Outlet />
                </PageTransition>
            </main>
            <Toaster />
        </>
    );
};

export default MarketingShell;

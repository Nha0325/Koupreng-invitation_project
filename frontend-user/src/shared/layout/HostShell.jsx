import { Outlet } from "react-router-dom";
import Header from "./Header";
import Aside from "./Aside";
import PageTransition from "../ui/PageTransition";
import Toaster from "../ui/Toaster";

/**
 * HostShell
 *
 * Authenticated chrome for the Host App (`/app/*`). Composes the existing
 * `<Header />` and `<Aside />` primitives with a scrollable `<main>` that
 * renders the matched child route via react-router's `<Outlet />`, wrapped
 * in `<PageTransition>` so route changes animate.
 *
 * A `<Toaster />` is mounted at the shell level so any host page (or any
 * service called from inside the host tree, e.g. the auth-expired handler)
 * can raise non-blocking feedback without each page wiring its own.
 *
 * Layout structure:
 *   <Header />                                   ← fixed top bar (already self-spacing)
 *   <div class="app-layout-with-aside">          ← flex row
 *     <Aside />                                  ← sticky sidebar
 *     <main class="app-main-content">            ← scrollable region
 *       <PageTransition><Outlet /></PageTransition>
 *     </main>
 *   </div>
 *   <Toaster />                                  ← fixed-position toast portal
 *
 * The component takes no props; the surrounding `<Routes>` feeds the outlet.
 * Task 6.1 will wrap this shell in `<RequireAuth>` for the `/app/*` group.
 */
const HostShell = () => {
    return (
        <>
            <Header />
            <div className="app-layout-with-aside">
                <Aside />
                <main className="app-main-content">
                    <PageTransition>
                        <Outlet />
                    </PageTransition>
                </main>
            </div>
            <Toaster />
        </>
    );
};

export default HostShell;

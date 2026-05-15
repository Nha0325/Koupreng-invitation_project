import { Outlet } from "react-router-dom";
import Aside from "./Aside";
import PageTransition from "../ui/PageTransition";
import Toaster from "../ui/Toaster";

/**
 * Authenticated host shell.
 *
 * The marketing `<Header />` is intentionally NOT rendered here: once a user
 * has logged in and entered `/app/*`, the sidebar (`<Aside />`) is the
 * primary chrome and the marketing nav (Home / FAQs / Pricing / Get Started)
 * would be redundant and visually noisy. The auth-aware "Open app" CTA on
 * the marketing header still lets logged-in users jump back into the app
 * from public pages.
 */
const HostShell = () => {
    return (
        <>
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

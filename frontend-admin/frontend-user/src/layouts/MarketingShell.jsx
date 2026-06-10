import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

/**
 * MarketingShell — public pages with the global header & footer.
 * Child pages are responsible for their own top padding to clear the fixed header.
 */
export default function MarketingShell() {
    return (
        <>
            <Header />
            <main style={{ minHeight: "100vh" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

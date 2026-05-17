import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

/**
 * MarketingShell — public pages with the global header & footer.
 */
export default function MarketingShell() {
    return (
        <>
            <Header />
            <main className="main-content-layout" style={{minHeight: "100vh" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
}

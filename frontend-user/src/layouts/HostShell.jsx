import { Outlet, useLocation } from "react-router-dom";
import Aside from "./components/Aside";
import "../features/dashboard/Dashboard.css";

/**
 * HostShell — sidebar + scrollable main area for logged-in dashboard pages.
 * The /events route renders its own full-screen layout, so we let it
 * skip the sidebar wrapper.
 */
export default function HostShell() {
    const { pathname } = useLocation();
    const isFullScreen = pathname.startsWith("/events");

    if (isFullScreen) {
        return <Outlet />;
    }

    return (
        <div className="dash-wrapper">
            <div className="dash-sidebar">
                <Aside />
            </div>
            <div className="dash-main-scroll">
                <Outlet />
            </div>
        </div>
    );
}

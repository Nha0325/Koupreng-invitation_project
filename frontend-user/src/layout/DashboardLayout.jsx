import { Outlet, useLocation } from "react-router-dom";
import Aside from "../components/Aside";
import "../pages/Dashboard/DashboardPage.css";

/**
 * Sidebar layout for host dashboard pages (not used on /events).
 */
export default function DashboardLayout({ children }) {
  const { pathname } = useLocation();
  const isFullScreen = pathname.startsWith("/events");

  if (isFullScreen) {
    return children ?? <Outlet />;
  }

  return (
    <div className="dash-wrapper">
      <div className="dash-sidebar">
        <Aside />
      </div>
      <div className="dash-main-scroll">{children ?? <Outlet />}</div>
    </div>
  );
}

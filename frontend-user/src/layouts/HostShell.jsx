/**
 * កំណត់ចំណាំ: sidebar dashboard
 * ឯកសារ: src/layouts/HostShell.jsx
 * ចាស់: ./layout/DashboardLayout.jsx
 */
import { Outlet, useLocation } from "react-router-dom";
import Aside from "./components/Aside"; // ចាស់: ../components/Aside
import "../features/dashboard/styles/Dashboard.css";

/** Sidebar layout for host dashboard pages (មិនបង្ហាញ sidebar លើ /events full screen) */
export default function HostShell({ children }) {
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

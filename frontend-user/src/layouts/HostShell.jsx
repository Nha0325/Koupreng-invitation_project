import { Outlet } from "react-router-dom";
import Aside from "./components/Aside";
import "../pages/host/dashboard/Dashboard.css";

export default function HostShell() {
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

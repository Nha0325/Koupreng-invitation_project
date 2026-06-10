import { Outlet } from "react-router-dom";
import HostNav from "./components/HostNav";
import "../pages/host/dashboard/Dashboard.css";

export default function HostShell() {
    return (
        <div className="dash-wrapper">
            <HostNav />
            <div className="dash-main-scroll">
                <Outlet />
            </div>
        </div>
    );
}

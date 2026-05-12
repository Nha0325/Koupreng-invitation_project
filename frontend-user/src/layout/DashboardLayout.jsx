import { Outlet } from "react-router-dom";
import Aside from "../components/Aside";
import "../features/Dashboard/Dashboard.css";
import "./DashboardLayout.css";

const DashboardLayout = () => {
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

export default DashboardLayout;

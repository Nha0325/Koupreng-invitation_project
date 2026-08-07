import { Outlet } from "react-router-dom";
import HostNav from "./components/HostNav";
import { ToastContainer } from "@/shared/ui";
import "./HostShell.css";

export default function HostShell() {
    return (
        <div className="dash-wrapper">
            <HostNav />
            <div className="dash-main-scroll">
                <Outlet />
            </div>
            <ToastContainer />
        </div>
    );
}

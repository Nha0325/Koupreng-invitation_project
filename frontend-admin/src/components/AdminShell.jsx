import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../auth/AuthContext";

const TITLES = {
    "/dashboard": "ផ្ទាំងគ្រប់គ្រងទូទៅ",
    "/users": "គ្រប់គ្រងអ្នកប្រើប្រាស់",
    "/events": "គ្រប់គ្រងព្រឹត្តិការណ៍",
    "/invitations": "គ្រប់គ្រងធៀបការ",
    "/payments": "របាយការណ៍ការទូទាត់",
};

function initials(name = "") {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "A";
    return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
}

export default function AdminShell() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const title =
        TITLES[Object.keys(TITLES).find((key) => location.pathname.startsWith(key))] ||
        "រដ្ឋបាលគូព្រេង";

    const displayName = user?.fullName || user?.email || user?.phone || "Admin";

    return (
        <div className="admin-layout">
            <Sidebar />
            <div className="admin-main">
                <header className="topbar">
                    <div className="topbar-title">{title}</div>
                    <div className="topbar-user">
                        <div className="topbar-user-info">
                            <span className="topbar-user-name">{displayName}</span>
                            <span className="topbar-user-role">👑 Admin</span>
                        </div>
                        <div className="avatar">{initials(displayName)}</div>
                        <button type="button" className="logout-btn" onClick={logout}>
                            ចាកចេញ
                        </button>
                    </div>
                </header>
                <main className="content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

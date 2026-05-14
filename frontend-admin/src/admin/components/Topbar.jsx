import { useAdmin } from "../../shared/AdminContext";
import { useNavigate } from "react-router-dom";
import { LogOut, Bell, User } from "lucide-react";
import { useState } from "react";

export default function Topbar() {
  const { user, logout } = useAdmin();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-gray-900">Welcome back</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition duration-200 relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition duration-200"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.[0] || "A"}
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-2">
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">Profile</span>
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

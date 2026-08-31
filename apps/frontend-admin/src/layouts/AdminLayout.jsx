import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "../components/navigation/AdminSidebar";
import TopMenu from "../components/navigation/TopMenu";

const PAGE_TITLES = {
  "/dashboard": "ផ្ទាំងគ្រប់គ្រងទូទៅ",
  "/users": "គ្រប់គ្រងអ្នកប្រើប្រាស់",
  "/events": "គ្រប់គ្រងព្រឹត្តិការណ៍",
  "/invitations": "គ្រប់គ្រងធៀបការ & RSVP",
  "/templates": "គ្រប់គ្រងគំរូធៀបការ",
  "/packages": "គ្រប់គ្រងកញ្ចប់សេវាកម្ម",
  "/payments": "របាយការណ៍ការទូទាត់ (KHQR)",
  "/notifications": "គ្រប់គ្រងការជូនដំណឹង",
  "/system-logs": "កំណត់ហេតុប្រព័ន្ធ",
  "/reports": "របាយការណ៍សង្ខេប & Analytics",
};

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(true);
  const location = useLocation();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") === "dark";
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const title =
    PAGE_TITLES[Object.keys(PAGE_TITLES).find((key) => location.pathname.startsWith(key))] ||
    "ផ្ទាំងរដ្ឋបាលគូព្រេង";

  const isExpanded = isMobileOpen || isPinned;
  const sidebarPadding = isExpanded ? "lg:pl-[260px]" : "lg:pl-[72px]";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-[#09090b] dark:text-zinc-100 transition-colors duration-300">
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="បិទម៉ឺនុយ"
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs lg:hidden cursor-pointer"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Modern Collapsible Sidebar */}
      <AdminSidebar
        isMobileOpen={isMobileOpen}
        isExpanded={isExpanded}
        onToggle={() => setIsPinned(!isPinned)}
        onNavigate={() => {
          if (window.innerWidth < 1024) setIsMobileOpen(false);
        }}
      />

      {/* Main Content Area */}
      <div className={`${sidebarPadding} min-w-0 max-w-full transition-all duration-300 flex flex-col min-h-screen`}>
        <TopMenu
          title={title}
          onShowSidebar={() => {
            if (window.innerWidth < 1024) {
              setIsMobileOpen(!isMobileOpen);
            } else {
              setIsPinned(!isPinned);
            }
          }}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="w-full max-w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

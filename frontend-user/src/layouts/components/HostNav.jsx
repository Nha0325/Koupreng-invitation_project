import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../pages/auth/context/useAuth";
import logo from "../../assets/logo.png";

const NAV_ITEMS = [
    { label: "ផ្ទាំងគ្រប់គ្រង", path: "/dashboard" },
    { label: "បញ្ជីភ្ញៀវ", path: "/guests" },
    { label: "គម្រោងថវិកា", path: "/expenses" },
    { label: "ចងដៃមង្គល", path: "/gifts" },
    { label: "បន្ថែមគម្រូ", path: "/templates/browse" },
];

export default function HostNav() {
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path) => {
        if (path === "/dashboard") return location.pathname === path;
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    const handleLogout = () => {
        logout();
        navigate("/", { replace: true });
    };

    return (
        <>
            <style>{`
        .host-header-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 3000;
          padding: ${scrolled ? "10px 0" : "20px 0"};
          transition: 0.4s;
          pointer-events: none;
        }
        .host-header-container {
          pointer-events: auto;
          max-width: 1440px;
          margin: 0 auto;
          width: 92%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          height: 75px;
          background: ${scrolled ? "rgba(252, 248, 242, 0.95)" : "rgba(252, 248, 242, 0.4)"};
          backdrop-filter: blur(5px);
          border-radius: 50px;
          border: 1px solid rgba(176, 146, 106, 0.3);
          box-shadow: ${scrolled ? "0 10px 40px rgba(0,0,0,0.1)" : "none"};
        }
        .host-logo-box {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .host-logo-box img {
          height: 90px;
          width: auto;
          object-fit: contain;
        }
        .host-nav-links {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .host-nav-link {
          font-family: 'Kantumruy Pro', sans-serif;
          text-decoration: none;
          color: #333;
          font-weight: 700;
          font-size: 14px;
          transition: 0.3s;
          background: none;
          border: 0;
          cursor: pointer;
          padding: 0;
        }
        .host-nav-link:hover,
        .host-nav-link.active {
          color: #B0926A;
        }
        .host-user-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .host-logout-nav-btn {
          font-family: 'Kantumruy Pro', sans-serif;
          text-decoration: none;
          color: #8a3434;
          font-weight: 700;
          font-size: 14px;
          transition: 0.3s;
          background: none;
          border: 0;
          cursor: pointer;
          padding: 0;
        }
        .host-logout-nav-btn:hover {
          color: #c24141;
        }
        .host-profile-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #B0926A;
          border: 2px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          cursor: pointer;
          text-decoration: none;
          font-size: 14px;
        }
        @media (max-width: 1024px) {
          .host-nav-links {
            gap: 14px;
          }
          .host-nav-link {
            font-size: 12.5px;
          }
        }
        @media (max-width: 768px) {
          .host-header-container {
            width: calc(100% - 24px);
            padding: 0 16px;
            height: 62px;
          }
          .host-logo-box img {
            height: 65px;
          }
          .host-nav-links {
            gap: 10px;
            overflow-x: auto;
            scrollbar-width: none;
          }
          .host-nav-links::-webkit-scrollbar {
            display: none;
          }
          .host-nav-link {
            font-size: 12px;
            white-space: nowrap;
          }
          .host-logout-nav-btn {
            display: none;
          }
        }
      `}</style>

            <div className="host-header-wrapper">
                <header className="host-header-container">
                    <Link to="/dashboard" className="host-logo-box">
                        <img src={logo} alt="គូព្រេង" />
                    </Link>

                    <nav className="host-nav-links">
                        {NAV_ITEMS.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`host-nav-link${isActive(item.path) ? " active" : ""}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="host-user-actions">
                        <button
                            type="button"
                            className="host-logout-nav-btn"
                            onClick={handleLogout}
                        >
                            ចាកចេញ
                        </button>
                        <Link to="/dashboard" className="host-profile-circle">
                            {user?.name?.charAt(0) || "K"}
                        </Link>
                    </div>
                </header>
            </div>
        </>
    );
}

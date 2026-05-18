import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";

const hostLinks = [
  { to: "/dashboard", label: "ផ្ទាំងគ្រប់គ្រង" },
  { to: "/guests", label: "ភ្ញៀវ" },
  { to: "/expenses", label: "ចំណាយ" },
  { to: "/gifts", label: "ចងដៃមង្គល" },
];

export default function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const closeMobile = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobile();
    navigate("/");
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
  }, [isMobileMenuOpen]);

  return (
    <>
      <style>{`
        .header-wrapper { position: fixed; top: 0; left: 0; width: 100%; z-index: 3000; padding: ${scrolled ? "10px 0" : "20px 0"}; transition: 0.4s; }
        .header-container { max-width: 1440px; margin: 0 auto; width: 92%; display: flex; align-items: center; justify-content: space-between; padding: 0 30px; height: 75px; background: ${scrolled ? "" : "rgba(252, 248, 242, 0.4)"}; backdrop-filter: blur(5px); border-radius: 50px; border: 1px solid rgba(176, 146, 106, 0.3); box-shadow: ${scrolled ? "0 10px 40px rgba(0,0,0,0.1)" : "none"}; }
        .logo-box { display: flex; align-items: center; gap: 12px; text-decoration: none; }
        .logo-text { font-family: 'Moul', serif; color: #7D6443; font-size: 22px; }
        .nav-links { display: flex; gap: 20px; align-items: center; }
        .nav-link { font-family: 'Kantumruy Pro', sans-serif; text-decoration: none; color: #333; font-weight: 700; font-size: 14px; transition: 0.3s; }
        .nav-link:hover { color: #B0926A; }
        .user-profile-circle { width: 40px; height: 40px; border-radius: 50%; background: #B0926A; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; cursor: pointer; }
        .cta-gold { background: linear-gradient(135deg, #B0926A 0%, #7D6443 100%); color: white; padding: 10px 24px; border-radius: 30px; text-decoration: none; font-family: 'Kantumruy Pro', sans-serif; font-weight: 700; font-size: 14px; box-shadow: 0 4px 15px rgba(176, 146, 106, 0.3); }
        .burger-menu { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; z-index: 3001; }
        .burger-menu span { width: 25px; height: 3px; background-color: #7D6443; border-radius: 2px; transition: 0.3s; }
        .mobile-nav { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #FCF8F2; padding: 100px 30px; flex-direction: column; gap: 20px; z-index: 2999; }
        @media (max-width: 1024px) { 
          .nav-links, .desktop-actions { display: none; } 
          .burger-menu { display: flex; }
          .mobile-nav { display: ${isMobileMenuOpen ? "flex" : "none"}; }
        }
      `}</style>

      <div className="header-wrapper">
        <header className="header-container">
          <Link to="/" className="logo-box">
            <img
              src={logo}
              alt="គូព្រេង"
              style={{
                height: "90px",
                width: "auto",
                objectFit: "contain",
              }}
            />
            {/* <span className="logo-text">គូព្រេង</span> */}
          </Link>

          <nav className="nav-links">
            <Link className="nav-link" to="/">
              ទំព័រដើម
            </Link>
            <Link className="nav-link" to="/templates">
              គំរូសន្លឹកការ
            </Link>
            <Link className="nav-link" to="/pricing">
              តម្លៃ
            </Link>
            <Link className="nav-link" to="/venues">
              ទីកន្លែង
            </Link>
            {isAuthenticated &&
              hostLinks.map((item) => (
                <Link key={item.to} className="nav-link" to={item.to}>
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="desktop-actions">
            {isAuthenticated ? (
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Link to="/profile" className="user-profile-circle">
                  V
                </Link>
                <Link to="/profile" className="nav-link">
                  ប្រវត្តិរូបរបស់ខ្ញុំ
                </Link>
                <button type="button" className="nav-link" onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer" }}>
                  ចាកចេញ
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <Link to="/login" className="nav-link">
                  ចូលប្រើ
                </Link>
                <Link to="/register" className="cta-gold">
                  ចាប់ផ្ដើមឥឡូវនេះ
                </Link>
              </div>
            )}
          </div>

          <button
            className="burger-menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span
              style={{
                transform: isMobileMenuOpen
                  ? "rotate(45deg) translate(6px, 5px)"
                  : "none",
              }}
            ></span>
            <span style={{ opacity: isMobileMenuOpen ? 0 : 1 }}></span>
            <span
              style={{
                transform: isMobileMenuOpen
                  ? "rotate(-45deg) translate(6px, -6px)"
                  : "none",
              }}
            ></span>
          </button>
        </header>
      </div>

      <nav className="mobile-nav">
        <Link
          className="nav-link"
          to="/"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ទំព័រដើម
        </Link>
        <Link
          className="nav-link"
          to="/templates"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          គំរូសន្លឹកការ
        </Link>
        <Link
          className="nav-link"
          to="/pricing"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          តម្លៃ
        </Link>
        <Link
          className="nav-link"
          to="/venues"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ទីកន្លែង
        </Link>
        {isAuthenticated ? (
          <>
            {hostLinks.map((item) => (
              <Link key={item.to} className="nav-link" to={item.to} onClick={closeMobile}>
                {item.label}
              </Link>
            ))}
            <Link className="nav-link" to="/profile" onClick={closeMobile}>
              ប្រវត្តិរូបរបស់ខ្ញុំ
            </Link>
            <button type="button" className="nav-link" onClick={handleLogout} style={{ background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
              ចាកចេញ
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ចូលប្រើ
            </Link>
            <Link
              to="/register"
              className="cta-gold"
              style={{ textAlign: "center" }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              ចាប់ផ្ដើមឥឡូវនេះ
            </Link>
          </>
        )}
      </nav>
    </>
  );
}

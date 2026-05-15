import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../app/auth/useAuth";
import "./Header.css";

const NAV_LINKS = [
  { to: "/", label: "Home", scrollTo: "hero-s" },
  { to: "", label: "FAQs", scrollTo: "faqs" },
  { to: "", label: "Pricing", scrollTo: "pricing-s" },
];

/**
 * Marketing/auth header.
 *
 * Renders one of two right-side action clusters depending on the auth state
 * exposed by `useAuth()`:
 *
 *   - authenticated → "Open app" pill that deep-links to `/app/dashboard`
 *   - otherwise     → existing "Log in" + "Get Started" pair
 *
 * Branching here (instead of in each marketing page) keeps the chrome
 * consistent across `/`, `/login`, `/register`, etc., and lets a logged-in
 * user navigate back to the host app without a manual URL.
 */
const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { status } = useAuth();
  const isAuthed = status === "authenticated";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <>
      <header className="site-header">
        <div className="site-header__pill">

          {/* ── Logo ── */}
          <Link
            to="/"
            className="site-header__logo"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <svg className="site-header__logo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
              <path d="M8 7h6M8 11h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M14 2v4h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Koupreng
          </Link>

          {/* ── Center nav ── */}
          <nav className="site-header__nav" aria-label="Main navigation">
            {NAV_LINKS.map(({ to, label, scrollTo }) => (
              <Link
                key={label}
                to={to}
                className={`site-nav__link${isActive(to) ? " site-nav__link--active" : ""}`}
                onClick={scrollTo ? (e) => {
                  e.preventDefault();
                  const el = document.getElementById(scrollTo);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                } : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right cluster ── */}
          <div className="site-header__right">
            {isAuthed ? (
              <Link to="/app/dashboard" className="site-header__cta">បើកកម្មវិធី</Link>
            ) : (
              <>
                <Link to="/login" className="site-header__login">Log in</Link>
                <Link to="/register" className="site-header__cta">Get Started</Link>
              </>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="site-header__burger"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {menuOpen ? (
                  <>
                    <line x1="4" y1="4" x2="16" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="16" y1="4" x2="4" y2="16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="5.5" x2="17" y2="5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="3" y1="10" x2="17" y2="10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <line x1="3" y1="14.5" x2="17" y2="14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {menuOpen && (
          <div className="site-drawer">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={label}
                to={to}
                className={`site-drawer__link${isActive(to) ? " site-drawer__link--active" : ""}`}
              >
                {label}
              </Link>
            ))}
            <div className="site-drawer__divider" />
            {isAuthed ? (
              <Link to="/app/dashboard" className="site-drawer__cta site-drawer__cta--fill">បើកកម្មវិធី</Link>
            ) : (
              <>
                <Link to="/login" className="site-drawer__cta site-drawer__cta--ghost">Log in</Link>
                <Link to="/register" className="site-drawer__cta site-drawer__cta--fill">Get Started</Link>
              </>
            )}
          </div>
        )}
      </header>

      {/* Spacer — pushes page content below fixed header */}
      <div className="site-header__spacer" aria-hidden="true" />
    </>
  );
};

export default Header;

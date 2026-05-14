<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../shared/ui/PageTransition";

/* ── Public layout ── */
import Header from "../shared/layout/Header";
=======
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../shared/ui/PageTransition";

/* ── Layouts ── */
import Header from "../shared/layout/Header";
import Aside from "../shared/layout/Aside";

/* Routes where the header should be shown */
const SHOW_HEADER_ROUTES = ["/"];

/* Routes where the aside (sidebar) should be shown */
const SHOW_ASIDE_ROUTES = ["/dashboard", "/guests", "/expenses", "/gifts", "/templates", "/add-template", "/settings"];
>>>>>>> 60dfe88 (Debug all Frontend pages.)

/* ── Public pages ── */
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPassword from "../pages/Auth/ForgotPassword";

<<<<<<< HEAD
=======
/* ── Feature pages ── */
import EventsPage from "../pages/Events/EventsPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import GuestsPage from "../pages/Dashboard/GuestsPage";
import ExpensesPage from "../pages/Dashboard/ExpensesPage";
import WeddingGiftPage from "../pages/Dashboard/WeddingGiftPage";
import TemplatePage from "../pages/Dashboard/TemplatePage";
import AddTemplatePage from "../pages/Dashboard/AddTemplatePage";
import SettingsPage from "../pages/Dashboard/SettingsPage";

>>>>>>> 60dfe88 (Debug all Frontend pages.)
/* ── Invitation pages ── */
import InvitationPage from "../invitation/pages/InvitationPage";

const AnimatedRoutes = () => {
<<<<<<< HEAD
  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <Routes>
          {/* ── Public routes ── */}
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/login"
            element={
              <PageTransition>
                <LoginPage />
              </PageTransition>
            }
          />
          <Route
            path="/register"
            element={
              <PageTransition>
                <RegisterPage />
              </PageTransition>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PageTransition>
                <ForgotPassword />
              </PageTransition>
            }
          />

          {/* ── Dynamic invitation route ── */}
          <Route
            path="/invitation/:slug"
            element={
              <PageTransition>
                <InvitationPage />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
=======
  const location = useLocation();
  const hideHeader = !SHOW_HEADER_ROUTES.includes(location.pathname);
  const showAside = SHOW_ASIDE_ROUTES.includes(location.pathname);

  return (
    <>
      {!hideHeader && <Header />}
      {showAside ? (
        <div className="app-layout-with-aside">
          <Aside />
          <main className="app-main-content">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
                <Route path="/guests" element={<PageTransition><GuestsPage /></PageTransition>} />
                <Route path="/expenses" element={<PageTransition><ExpensesPage /></PageTransition>} />
                <Route path="/gifts" element={<PageTransition><WeddingGiftPage /></PageTransition>} />
                <Route path="/templates" element={<PageTransition><TemplatePage /></PageTransition>} />
                <Route path="/add-template" element={<PageTransition><AddTemplatePage /></PageTransition>} />
                <Route path="/settings" element={<PageTransition><SettingsPage /></PageTransition>} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* ── Public routes ── */}
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />

            {/* ── Dynamic invitation route ── */}
            <Route path="/invitation/:slug" element={<PageTransition><InvitationPage /></PageTransition>} />

            {/* ── Feature routes ── */}
            <Route path="/events" element={<PageTransition><EventsPage /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      )}
>>>>>>> 60dfe88 (Debug all Frontend pages.)
    </>
  );
};

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <div className="app-container">
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;

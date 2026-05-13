import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../shared/ui/PageTransition";

/* ── Public layout ── */
import Header from "../shared/layout/Header";

/* ── Public pages ── */
import HomePage from "../pages/Home/HomePage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPassword from "../pages/Auth/ForgotPassword";

/* ── Invitation pages ── */
import InvitationPage from "../invitation/pages/InvitationPage";

const AnimatedRoutes = () => {
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

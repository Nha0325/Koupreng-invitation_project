import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "./hooks/useLenis";
import { PageTransition } from "./components/ui/PageTransition";
import { AuthProvider } from "./context/AuthContext";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import EventsPage from "./pages/Events/EventsPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import GuestsPage from "./pages/Dashboard/GuestsPage";
import ExpensesPage from "./pages/Dashboard/ExpensesPage";
import WeddingGiftPage from "./pages/Dashboard/WeddingGiftPage";
import TemplatePage from "./pages/Dashboard/TemplatePage";
import AddTemplatePage from "./pages/Dashboard/AddTemplatePage";

/* ── Routes that hide the Header & Footer ── */
const HIDDEN_LAYOUT_PATHS = [
  "/login", "/register", "/forgot-password", "/events",
  "/dashboard", "/guests", "/expenses", "/gifts", "/templates", "/add-template",
];

/* ── Routes with AnimatePresence ── */
const AnimatedRoutes = () => {
  const location = useLocation();
  const hideLayout = HIDDEN_LAYOUT_PATHS.some(p => location.pathname.startsWith(p));

  return (
    <>
      {!hideLayout && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/guests" element={<GuestsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/gifts" element={<WeddingGiftPage />} />
          <Route path="/templates" element={<TemplatePage />} />
          <Route path="/add-template" element={<AddTemplatePage />} />
        </Routes>
      </AnimatePresence>
      {!hideLayout && <Footer />}
    </>
  );
};

/* ── App ── */
function App() {
  useLenis();

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <AnimatedRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

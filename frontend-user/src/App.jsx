import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "./hooks/useLenis";
import PageTransition from "./components/ui/PageTransition";
import { AuthProvider } from "./context/AuthContext";

/* ── Public layout ── */
import Header from "./layout/Header";
import Footer from "./layout/Footer";

/* ── Dashboard layout (shared sidebar) ── */
import DashboardLayout from "./layout/DashboardLayout";

/* ── Public pages ── */
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";

/* ── Dashboard pages ── */
import DashboardPage from "./pages/Dashboard/DashboardPage";
import GuestsPage from "./pages/Dashboard/GuestsPage";
import ExpensesPage from "./pages/Dashboard/ExpensesPage";
import WeddingGiftPage from "./pages/Dashboard/WeddingGiftPage";
import TemplatePage from "./pages/Dashboard/TemplatePage";
import AddTemplatePage from "./pages/Dashboard/AddTemplatePage";
import SettingsPage from "./pages/Dashboard/SettingsPage";

/* ── Events pages ── */
import EventsPage from "./pages/Events/EventsPage";
import CreateEventPage from "./pages/Events/CreateEventPage";

/* ── Routes that hide the public Header & Footer ── */
const HIDDEN_LAYOUT_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/dashboard",
  "/guests",
  "/expenses",
  "/gifts",
  "/templates",
  "/add-template",
  "/settings",
  "/events",
];

const AnimatedRoutes = () => {
  const location = useLocation();
  const hideLayout = HIDDEN_LAYOUT_PATHS.some(
    (p) => location.pathname === p || location.pathname.startsWith(p + "/"),
  );

  return (
    <>
      {!hideLayout && <Header />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
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

          {/* ── Dashboard routes — all share DashboardLayout (Aside sidebar) ── */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/gifts" element={<WeddingGiftPage />} />
            <Route path="/templates" element={<TemplatePage />} />
            <Route path="/add-template" element={<AddTemplatePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/create" element={<CreateEventPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
      {!hideLayout && <Footer />}
    </>
  );
};

const App = () => {
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

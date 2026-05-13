import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "./shared/hooks/useLenis";
import PageTransition from "./shared/ui/PageTransition";
import { AuthProvider } from "./context/AuthContext";

/* ── Public layout ── */
import Header from "./shared/layout/Header";
import Footer from "./shared/layout/Footer";

/* ── Dashboard layout (shared sidebar) ── */
import DashboardLayout from "./shared/layout/DashboardLayout";

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
import LinksPage from "./pages/Dashboard/LinksPage";
import ComparisonPage from "./pages/Dashboard/ComparisonPage";

/* ── Events pages ── */
import EventsPage from "./pages/Events/EventsPage";
import CreateEventPage from "./pages/Events/CreateEventPage";

/* ── Designer pages ── */
import InvitationTemplatesPage from "./pages/Designer/TemplatesPage";
import InvitationDesignerPage from "./pages/Designer/DesignerPage";
import InvitationMyInvitationsPage from "./pages/Designer/MyInvitationsPage";
import InvitationPreviewPage from "./pages/Designer/PreviewInvitationPage";

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
  "/links",
  "/comparison",
  "/invitation-templates",
  "/designer",
  "/my-invitations",
  "/preview",
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
            <Route path="/links" element={<LinksPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/invitation-templates" element={<InvitationTemplatesPage />} />
            <Route path="/my-invitations" element={<InvitationMyInvitationsPage />} />
          </Route>

          {/* ── Standalone pages (no DashboardLayout) ── */}
          <Route path="/designer/:templateId" element={<InvitationDesignerPage />} />
          <Route path="/preview/:shareToken" element={<InvitationPreviewPage />} />
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
};

export default App;

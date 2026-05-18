import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useLenis } from "./hooks/useLenis";
import { PageTransition } from "./components/ui/PageTransition";
import { AuthProvider } from "./context/AuthContext";
import Header from "./layout/Header";
import Footer from "./layout/Footer";

// ── Pages ធម្មតា និង Auth ──
import HomePage from "./pages/Home/HomePage";
import PricingPage from "./pages/Home/Pricing";
import VenuesPage from "./pages/Home/Venues";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ForgotPassword from "./pages/Auth/ForgotPassword";

// ── User Dashboard Pages ──
import EventsPage from "./pages/Events/EventsPage";
import CreateEventPage from "./pages/Events/CreateEventPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import GuestsPage from "./pages/Dashboard/GuestsPage";
import ExpensesPage from "./pages/Dashboard/ExpensesPage";
import WeddingGiftPage from "./pages/Dashboard/WeddingGiftPage";
import TemplatePage from "./features/Template/TemplatePage";
import AddTemplatePage from "./pages/Dashboard/AddTemplatePage";

// ── ទំព័រគំរូ (លម្អិត / មើលជាមុន) ──
import TemplateDetailPage from "./features/Template/TemplateDetailPage";
import InvitationPreviewPage from "./features/Template/InvitationPreviewPage";

// ── Admin Pages & Layout (បន្ថែមថ្មី) ──
import AdminLayout from "./layout/AdminLayout";
import AdminDashboardPage from "./pages/Admin/DashboardPage";

/* ── បញ្ជី Path ដែលត្រូវលាក់ Header & Footer (រួមទាំងទំព័រ Dashboard និង Admin) ── */
const HIDDEN_LAYOUT_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/events",
  "/dashboard",
  "/guests",
  "/expenses",
  "/gifts",
  "/add-template",
  "/admin", // លាក់ Header/Footer របស់ Website ធម្មតាចោល ពេលចូលទំព័រ Admin
];

const AnimatedRoutes = () => {
  const location = useLocation();

  // ឆែកមើលថា តើ Path បច្ចុប្បន្នស្ថិតក្នុងបញ្ជីដែលត្រូវលាក់ Header ឬទេ
  const isDashboardOrAuth = HIDDEN_LAYOUT_PATHS.some((p) =>
    location.pathname.startsWith(p),
  );
  // ទំព័រមើលជាមុនគំរូ — មិនបង្ហាញ Header/Footer
  const isTemplatePreview = location.pathname.endsWith("/preview");
  const hideLayout = isDashboardOrAuth || isTemplatePreview;

  return (
    <>
      {/* បង្ហាញ Header តែលើទំព័រណាដែលមិនមែនជា Dashboard/Auth/Admin */}
      {!hideLayout && <Header />}

      <main className={!hideLayout ? "main-content-layout" : ""}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* 🌐 Public Pages (ជាមួយ Header/Footer) */}
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
            <Route path="/venues" element={<PageTransition><VenuesPage /></PageTransition>} />
            <Route path="/templates" element={<PageTransition><TemplatePage /></PageTransition>} />
            <Route path="/templates/:id" element={<PageTransition><TemplateDetailPage /></PageTransition>} />
            <Route path="/templates/:id/preview" element={<PageTransition><InvitationPreviewPage /></PageTransition>} />

            {/* 🔐 Auth Pages */}
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />

            {/* 📊 User Dashboard Routes (ប្រើ Sidebar ផ្ទាល់ខ្លួន) */}
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/create" element={<CreateEventPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/gifts" element={<WeddingGiftPage />} />
            <Route path="/add-template" element={<AddTemplatePage />} />

            {/* 👑 Admin Routes (ប្រើ Admin Layout + Sidebar ដាច់ដោយឡែក - បន្ថែមថ្មី) */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              {/* បងអាចដំឡើងលីងផ្សេងៗរបស់ Admin ទៅតាម Folder structure របស់បងនៅទីនេះតាមក្រោយ */}
              <Route path="users" element={<div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">👥 បញ្ជីគ្រប់គ្រងអ្នកប្រើប្រាស់ (កំពុងអភិវឌ្ឍ...)</div>} />
              <Route path="subscriptions" element={<div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">💎 គ្រប់គ្រងកញ្ចប់សេវាកម្ម (កំពុងអភិវឌ្ឍ...)</div>} />
              <Route path="templates" element={<div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">🎨 គ្រប់គ្រង Templates ធៀបការ (កំពុងអភិវឌ្ឍ...)</div>} />
              <Route path="venues" element={<div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">🏢 គ្រប់គ្រងព័ត៌មានសាលមង្គល (កំពុងអភិវឌ្ឍ...)</div>} />
              <Route path="transactions" element={<div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">💵 របាយការណ៍ថវិកាដែលទទួលបាន (កំពុងអភិវឌ្ឍ...)</div>} />
              <Route path="logs" element={<div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">📜 ប្រវត្តិប្រព័ន្ធ System Audit Logs (កំពុងអភិវឌ្ឍ...)</div>} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>

      {/* បង្ហាញ Footer តែលើទំព័រណាដែលមិនមែនជា Dashboard/Auth/Admin */}
      {!hideLayout && <Footer />}

      <style>{`
        /* រុញ Content ចុះក្រោមដើម្បីកុំឱ្យ Header Fixed បាំង */
        .main-content-layout {
          padding-top: 85px;
          min-height: 100vh;
        }
      `}</style>
    </>
  );
};

function App() {
  useLenis(); // សម្រាប់ Smooth Scrolling

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

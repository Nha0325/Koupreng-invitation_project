/**
 * កំណត់ចំណាំ: Route ទាំងអស់
 * ឯកសារ: src/app/router.jsx
 * ចាស់: AnimatedRoutes + Routes ក្នុង App.jsx ចាស់
 */
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "../shared/ui/PageTransition";

// ── Layout shells (ជំនួស layout/Header, Footer, AdminLayout, DashboardLayout) ──
import MarketingShell from "../layouts/MarketingShell";
import InvitationShell from "../layouts/InvitationShell";
import HostShell from "../layouts/HostShell";
import AdminShell from "../layouts/AdminShell";

// ── Pages ធម្មតា (Marketing) ──
import HomePage from "../pages/marketing/HomePage";
import PricingPage from "../pages/marketing/PricingPage";
import VenuesPage from "../pages/marketing/VenuesPage";
import TemplatesPage from "../pages/marketing/TemplatesPage";
import TemplateDetailPage from "../pages/marketing/TemplateDetailPage";
import InvitationPreviewPage from "../pages/marketing/InvitationPreviewPage";
import NotFoundPage from "../pages/marketing/NotFoundPage";

// ── Pages Auth ──
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

// ── User Dashboard Pages (Host) ──
import EventsPage from "../pages/host/EventsPage";
import CreateEventPage from "../pages/host/CreateEventPage";
import DashboardPage from "../pages/host/DashboardPage";
import GuestsPage from "../pages/host/GuestsPage";
import ExpensesPage from "../pages/host/ExpensesPage";
import WeddingGiftPage from "../pages/host/WeddingGiftPage";
import AddTemplatePage from "../pages/host/AddTemplatePage";

// ── Admin Pages & Layout ──
import AdminDashboardPage from "../pages/admin/DashboardPage";
import AdminUsersPage from "../pages/admin/UsersPage";
import AdminTemplatesPage from "../pages/admin/TemplatesPage";

/** រុំទំព័រជាមួយ PageTransition (ដូច <PageTransition><HomePage /></PageTransition>) */
function withTransition(element) {
  return <PageTransition>{element}</PageTransition>;
}

/** Placeholder សម្រាប់ទំព័រ Admin ដែលនៅអភិវឌ្ឍ */
function AdminPlaceholder({ children }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">
      {children}
    </div>
  );
}

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/*
          MarketingShell = Header + Footer + main
          (លាក់ Header/Footer តាម HIDDEN_MARKETING_LAYOUT_PREFIXES ក្នុង MarketingShell.jsx)
        */}
        <Route element={<MarketingShell />}>
          {/* 🌐 Public Pages (ជាមួយ Header/Footer) */}
          <Route path="/" element={withTransition(<HomePage />)} />
          <Route path="/pricing" element={withTransition(<PricingPage />)} />
          <Route path="/venues" element={withTransition(<VenuesPage />)} />
          <Route path="/templates" element={withTransition(<TemplatesPage />)} />
          <Route
            path="/templates/:id"
            element={withTransition(<TemplateDetailPage />)}
          />

          {/* 🔐 Auth Pages */}
          <Route path="/login" element={withTransition(<LoginPage />)} />
          <Route path="/register" element={withTransition(<RegisterPage />)} />
          <Route
            path="/forgot-password"
            element={withTransition(<ForgotPasswordPage />)}
          />

          <Route path="*" element={withTransition(<NotFoundPage />)} />
        </Route>

        {/* មើលជាមុនធៀប — ពេញអេក្រង់ គ្មាន Header/Footer */}
        <Route element={<InvitationShell />}>
          <Route
            path="/templates/:id/preview"
            element={<InvitationPreviewPage />}
          />
        </Route>

        {/* 📊 User Dashboard Routes (ប្រើ HostShell + Sidebar ផ្ទាល់ខ្លួន) */}
        <Route element={<HostShell />}>
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/guests" element={<GuestsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/gifts" element={<WeddingGiftPage />} />
          <Route path="/add-template" element={<AddTemplatePage />} />
        </Route>

        {/* 👑 Admin Routes (ប្រើ AdminShell + Sidebar ដាច់ដោយឡែក) */}
        <Route path="/admin" element={<AdminShell />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="templates" element={<AdminTemplatesPage />} />
          {/* បងអាចដំឡើងលីងផ្សេងៗរបស់ Admin ទៅតាម folder structure នៅទីនេះតាមក្រោយ */}
          <Route
            path="subscriptions"
            element={
              <AdminPlaceholder>
                💎 គ្រប់គ្រងកញ្ចប់សេវាកម្ម (កំពុងអភិវឌ្ឍ...)
              </AdminPlaceholder>
            }
          />
          <Route
            path="venues"
            element={
              <AdminPlaceholder>
                🏢 គ្រប់គ្រងព័ត៌មានសាលមង្គល (កំពុងអភិវឌ្ឍ...)
              </AdminPlaceholder>
            }
          />
          <Route
            path="transactions"
            element={
              <AdminPlaceholder>
                💵 របាយការណ៍ថវិកាដែលទទួលបាន (កំពុងអភិវឌ្ឍ...)
              </AdminPlaceholder>
            }
          />
          <Route
            path="logs"
            element={
              <AdminPlaceholder>
                📜 ប្រវត្តិប្រព័ន្ធ System Audit Logs (កំពុងអភិវឌ្ឍ...)
              </AdminPlaceholder>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

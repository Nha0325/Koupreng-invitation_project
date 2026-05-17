import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "../shared/ui/PageTransition";

import MarketingShell from "../layouts/MarketingShell";
import AuthShell from "../layouts/AuthShell";
import HostShell from "../layouts/HostShell";

import HomePage from "../pages/marketing/HomePage";
import PricingPage from "../pages/marketing/PricingPage";
import VenuesPage from "../pages/marketing/VenuesPage";
import NotFoundPage from "../pages/marketing/NotFoundPage";

import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";

import EventsPage from "../pages/host/EventsPage";
import CreateEventPage from "../pages/host/CreateEventPage";
import DashboardPage from "../pages/host/DashboardPage";
import GuestsPage from "../pages/host/GuestsPage";
import ExpensesPage from "../pages/host/ExpensesPage";
import WeddingGiftPage from "../pages/host/WeddingGiftPage";
import TemplatesPage from "../pages/host/TemplatesPage";
import AddTemplatePage from "../pages/host/AddTemplatePage";

import AdminShell from "../layouts/AdminShell";
import AdminDashboardPage from "../pages/admin/DashboardPage";
import AdminUsersPage from "../pages/admin/UsersPage";
import AdminTemplatesPage from "../pages/admin/TemplatesPage";

export default function AppRouter() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Marketing pages: header + footer */}
        <Route element={<MarketingShell />}>
          <Route
            path="/"
            element={
              <PageTransition>
                <HomePage />
              </PageTransition>
            }
          />
          <Route
            path="/pricing"
            element={
              <PageTransition>
                <PricingPage />
              </PageTransition>
            }
          />
          <Route
            path="/venues"
            element={
              <PageTransition>
                <VenuesPage />
              </PageTransition>
            }
          />
          <Route
            path="/templates"
            element={
              <PageTransition>
                <TemplatesPage />
              </PageTransition>
            }
          />
          <Route
            path="*"
            element={
              <PageTransition>
                <NotFoundPage />
              </PageTransition>
            }
          />
        </Route>

        {/* Auth pages: minimal shell */}
        <Route element={<AuthShell />}>
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
                <ForgotPasswordPage />
              </PageTransition>
            }
          />
        </Route>

        {/* Host (logged-in) pages: dashboard sidebar */}
        <Route element={<HostShell />}>
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/guests" element={<GuestsPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route path="/gifts" element={<WeddingGiftPage />} />
          <Route path="/add-template" element={<AddTemplatePage />} />
        </Route>

        {/* 👑 Admin Routes (ប្រើ Admin Layout + Sidebar ដាច់ដោយឡែក) */}
        <Route path="/admin" element={<AdminShell />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="templates" element={<AdminTemplatesPage />} />
          <Route
            path="subscriptions"
            element={
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">
                💎 គ្រប់គ្រងកញ្ចប់សេវាកម្ម (កំពុងអភិវឌ្ឍ...)
              </div>
            }
          />
          <Route
            path="venues"
            element={
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">
                🏢 គ្រប់គ្រងព័ត៌មានសាលមង្គល (កំពុងអភិវឌ្ឍ...)
              </div>
            }
          />
          <Route
            path="transactions"
            element={
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">
                💵 របាយការណ៍ថវិកាដែលទទួលបាន (កំពុងអភិវឌ្ឍ...)
              </div>
            }
          />
          <Route
            path="logs"
            element={
              <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 font-bold text-gray-700">
                📜 ប្រវត្តិប្រព័ន្ធ System Audit Logs (កំពុងអភិវឌ្ឍ...)
              </div>
            }
          />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

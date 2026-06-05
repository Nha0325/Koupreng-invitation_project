import { Route } from "react-router-dom";

import GuestReportPage from "../../features/dashboard/GuestReportPage";
import InvitationDashboardPage from "../../features/dashboard/InvitationDashboardPage";
import InvitationCheckInPage from "../../features/invitations/InvitationCheckInPage";
import InvitationSeatingPage from "../../features/seating/InvitationSeatingPage";
import RsvpReportPage from "../../features/dashboard/RsvpReportPage";
import AiAssistantPage from "../../features/ai/AiAssistantPage";
import BudgetPage from "../../features/budget/BudgetPage";
import NotificationsPage from "../../features/notifications/NotificationsPage";
import OrganizationsPage from "../../features/organizations/OrganizationsPage";
import PaidTemplatesPage from "../../features/payments/PaidTemplatesPage";
import PaymentHistoryPage from "../../features/payments/PaymentHistoryPage";
import PaymentReceiptPage from "../../features/payments/PaymentReceiptPage";
import SubscriptionPackagesPage from "../../features/subscriptions/SubscriptionPackagesPage";
import HostShell from "../../layouts/HostShell";
import BrowseTemplatesPage from "../../pages/host/templates/BrowseTemplatesPage";
import DashboardPage from "../../pages/host/DashboardPage";
import EventsPage from "../../pages/host/EventsPage";
import ExpensesPage from "../../pages/host/ExpensesPage";
import GuestsPage from "../../pages/host/GuestsPage";
import HostTemplateDemoPage from "../../pages/host/templates/HostTemplateDemoPage";
import ChangePasswordPage from "../../pages/host/ChangePasswordPage";
import InvitationCreatePage from "../../pages/host/invitations/InvitationCreatePage";
import InvitationEditPage from "../../pages/host/invitations/InvitationEditPage";
import InvitationGuestsPage from "../../pages/host/invitations/InvitationGuestsPage";
import InvitationMediaPage from "../../pages/host/invitations/InvitationMediaPage";
import InvitationPreviewPage from "../../pages/host/invitations/InvitationPreviewPage";
import MyInvitationsPage from "../../pages/host/invitations/MyInvitationsPage";
import ProfilePage from "../../pages/host/ProfilePage";
import WeddingGiftPage from "../../pages/host/WeddingGiftPage";
import RequireAuth from "./RequireAuth";

export function hostRoutes() {
  return (
    <Route
      element={
        <RequireAuth>
          <HostShell />
        </RequireAuth>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/notifications" element={<NotificationsPage />} />
      <Route path="/dashboard/invitations" element={<MyInvitationsPage />} />
      <Route path="/dashboard/invitations/:invitationId" element={<InvitationDashboardPage />} />
      <Route path="/dashboard/invitations/:invitationId/rsvp-report" element={<RsvpReportPage />} />
      <Route path="/dashboard/invitations/:invitationId/guest-report" element={<GuestReportPage />} />
      <Route path="/dashboard/invitations/:invitationId/check-in" element={<InvitationCheckInPage />} />
      <Route path="/dashboard/invitations/:invitationId/seating" element={<InvitationSeatingPage />} />
      <Route path="/dashboard/invitations/:invitationId/budget" element={<BudgetPage />} />
      <Route path="/dashboard/invitations/new" element={<InvitationCreatePage />} />
      <Route path="/dashboard/invitations/:id/edit" element={<InvitationEditPage />} />
      <Route path="/dashboard/invitations/:id/preview" element={<InvitationPreviewPage />} />
      <Route path="/dashboard/invitations/:id/guests" element={<InvitationGuestsPage />} />
      <Route path="/dashboard/invitations/:id/media" element={<InvitationMediaPage />} />
      <Route path="/dashboard/packages" element={<SubscriptionPackagesPage />} />
      <Route path="/dashboard/payments" element={<PaymentHistoryPage />} />
      <Route path="/dashboard/payments/:orderCode" element={<PaymentReceiptPage />} />
      <Route path="/dashboard/ai-assistant" element={<AiAssistantPage />} />
      <Route path="/dashboard/organizations" element={<OrganizationsPage />} />
      <Route path="/dashboard/templates/paid" element={<PaidTemplatesPage />} />
      <Route path="/guests" element={<GuestsPage />} />
      <Route path="/event/list" element={<EventsPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
      <Route path="/gifts" element={<WeddingGiftPage />} />
      <Route path="/templates/browse" element={<BrowseTemplatesPage />} />
      <Route path="/templates/browse/:id" element={<HostTemplateDemoPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/dashboard/profile" element={<ProfilePage />} />
      <Route path="/dashboard/change-password" element={<ChangePasswordPage />} />
    </Route>
  );
}

import { Navigate, Route } from "react-router-dom";

import PaidTemplatesPage from "../../features/payments/PaidTemplatesPage";
import HostShell from "../../layouts/HostShell";
import BrowseTemplatesPage from "../../pages/host/templates/BrowseTemplatesPage";
import DashboardPage from "../../pages/host/DashboardPage";
import EventsPage from "../../pages/host/EventsPage";
import ExpensesPage from "../../pages/host/ExpensesPage";
import GuestsPage from "../../pages/host/GuestsPage";
import HostTemplateDemoPage from "../../pages/host/templates/HostTemplateDemoPage";
import InvitationCreatePage from "../../pages/host/invitations/InvitationCreatePage";
import InvitationEditPage from "../../pages/host/invitations/InvitationEditPage";
import InvitationMediaPage from "../../pages/host/invitations/InvitationMediaPage";
import InvitationPreviewPage from "../../pages/host/invitations/InvitationPreviewPage";
import InvitationDeliveryPage from "../../pages/host/invitations/InvitationDeliveryPage";
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
      <Route path="/dashboard/invitations" element={<MyInvitationsPage />} />
      <Route path="/dashboard/invitations/new" element={<InvitationCreatePage />} />
      <Route path="/dashboard/invitations/:id/edit" element={<InvitationEditPage />} />
      <Route path="/dashboard/invitations/:id/preview" element={<InvitationPreviewPage />} />
      <Route path="/dashboard/invitations/:id/guests" element={<Navigate to="/guests" replace />} />
      <Route path="/dashboard/invitations/:id/delivery" element={<InvitationDeliveryPage />} />
      <Route path="/dashboard/invitations/:id/media" element={<InvitationMediaPage />} />
      <Route path="/dashboard/templates/paid" element={<PaidTemplatesPage />} />
      <Route path="/guests" element={<GuestsPage />} />
      <Route path="/event/list" element={<EventsPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
      <Route path="/gifts" element={<WeddingGiftPage />} />
      <Route path="/templates/browse" element={<BrowseTemplatesPage />} />
      <Route path="/templates/browse/:id" element={<HostTemplateDemoPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
  );
}

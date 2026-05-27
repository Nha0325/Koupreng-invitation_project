import { Route } from "react-router-dom";

import PaidTemplatesPage from "../../features/payments/PaidTemplatesPage";
import HostShell from "../../layouts/HostShell";
import BrowseTemplatesPage from "../../pages/host/BrowseTemplatesPage";
import CreateEventPage from "../../pages/host/CreateEventPage";
import DashboardPage from "../../pages/host/DashboardPage";
import EventsPage from "../../pages/host/EventsPage";
import ExpensesPage from "../../pages/host/ExpensesPage";
import GuestsPage from "../../pages/host/GuestsPage";
import InvitationCreatePage from "../../pages/host/InvitationCreatePage";
import InvitationEditPage from "../../pages/host/InvitationEditPage";
import InvitationGuestsPage from "../../pages/host/InvitationGuestsPage";
import InvitationMediaPage from "../../pages/host/InvitationMediaPage";
import InvitationPreviewPage from "../../pages/host/InvitationPreviewPage";
import MyInvitationsPage from "../../pages/host/MyInvitationsPage";
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
      <Route path="/dashboard/invitations/:id/guests" element={<InvitationGuestsPage />} />
      <Route path="/dashboard/invitations/:id/media" element={<InvitationMediaPage />} />
      <Route path="/dashboard/templates/paid" element={<PaidTemplatesPage />} />
      <Route path="/guests" element={<GuestsPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/create" element={<CreateEventPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
      <Route path="/gifts" element={<WeddingGiftPage />} />
      <Route path="/templates/browse" element={<BrowseTemplatesPage />} />
    </Route>
  );
}
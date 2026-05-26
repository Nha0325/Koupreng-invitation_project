import { Route } from "react-router-dom";

import PaymentCancelPage from "../../features/payments/PaymentCancelPage";
import PaymentStatusPage from "../../features/payments/PaymentStatusPage";
import PaymentSuccessPage from "../../features/payments/PaymentSuccessPage";
import WeddingSite from "../../features/wedding-site/WeddingSite";
import CreateWeddingPage from "../../pages/CreateWeddingPage";
import PublicInvitationPage from "../../pages/PublicInvitationPage";
import WeddingPreviewPage from "../../pages/WeddingPreviewPage";
import RequireAuth from "./RequireAuth";

export function builderRoutes() {
  return (
    <>
      <Route path="/templates/:id/preview" element={<WeddingSite />} />
      <Route
        path="/create/wedding"
        element={
          <RequireAuth>
            <CreateWeddingPage />
          </RequireAuth>
        }
      />
      <Route
        path="/create/wedding/:draftId"
        element={
          <RequireAuth>
            <CreateWeddingPage />
          </RequireAuth>
        }
      />
      <Route path="/preview/:draftId" element={<WeddingPreviewPage />} />
      <Route path="/payments/:orderCode/status" element={<PaymentStatusPage />} />
      <Route path="/payments/success" element={<PaymentSuccessPage />} />
      <Route path="/payments/return" element={<PaymentSuccessPage />} />
      <Route path="/payments/cancel" element={<PaymentCancelPage />} />
      <Route path="/w/:slug" element={<PublicInvitationPage />} />
      <Route path="/i/:slug" element={<PublicInvitationPage />} />
    </>
  );
}

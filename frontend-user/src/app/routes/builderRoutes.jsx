import { Route } from "react-router-dom";

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
      <Route path="/w/:slug" element={<PublicInvitationPage />} />
    </>
  );
}

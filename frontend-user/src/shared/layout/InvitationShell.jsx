import { Outlet } from "react-router-dom";
import PageTransition from "../ui/PageTransition";

/**
 * InvitationShell
 *
 * Anonymous, full-bleed shell for the public invitation routes
 * (`/i/:slug` and the legacy alias `/invitation/:slug`). Per the design's
 * "Component Architecture: Host vs Public Invitation" section, the public
 * invitation app must never import from the host tree (no `<Header />`,
 * no `<Aside />`, no `AuthContext`) so this shell deliberately renders
 * no chrome — the matched child route owns the entire `100dvh` viewport.
 *
 * The `<Outlet />` is wrapped in `<PageTransition>` so the cinematic
 * cross-fade still happens if the user navigates between two invitations
 * within the same SPA session. This shell intentionally does NOT mount a
 * `<Toaster />`; in-invitation feedback (e.g. RSVP success / errors) is
 * rendered inline by `RSVPForm` per the design's Error Scenarios section.
 *
 * The component takes no props; the surrounding `<Routes>` feeds the outlet.
 */
const InvitationShell = () => {
    return (
        <PageTransition>
            <Outlet />
        </PageTransition>
    );
};

export default InvitationShell;

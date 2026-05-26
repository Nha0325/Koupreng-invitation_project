import { Outlet } from "react-router-dom";

/**
 * InvitationShell — wrapper for public invitation viewing pages.
 * No header / footer / sidebar so the invitation fills the viewport.
 */
export default function InvitationShell() {
    return <Outlet />;
}

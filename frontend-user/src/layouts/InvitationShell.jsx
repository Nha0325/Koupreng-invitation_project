/**
 * កំណត់ចំណាំ: preview ពេញអេក្រង់
 * ឯកសារ: src/layouts/InvitationShell.jsx
 * ចាស់: isTemplatePreview ក្នុង App.jsx
 */
import { Outlet } from "react-router-dom";

/** Full-screen layout for invitation preview (no site chrome). */
export default function InvitationShell() {
  return <Outlet />;
}

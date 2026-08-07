import { StatusBadge } from "@/shared/ui";
import { ROLE_VARIANTS } from "../model/organizationConstants";

export default function RoleBadge({ role, className = "" }) {
  const normalized = (role || "VIEWER").toUpperCase();
  const variant = ROLE_VARIANTS[normalized] || "neutral";
  const displayLabel = normalized.replace(/_/g, " ");

  return <StatusBadge status={normalized} label={displayLabel} variant={variant} className={className} />;
}

export const ORGANIZATION_ROLES = [
  { value: "MANAGER", label: "Manager", description: "Full workspace & team access" },
  { value: "DESIGNER", label: "Designer", description: "Template & invitation builder access" },
  { value: "CHECK_IN_STAFF", label: "Check-in Staff", description: "Guest check-in & QR scanner access" },
  { value: "VIEWER", label: "Viewer", description: "Read-only access" },
  { value: "MEMBER", label: "Member", description: "Standard team member" },
];

export const ROLE_VARIANTS = {
  OWNER: "primary",
  MANAGER: "info",
  ADMIN: "info",
  DESIGNER: "warning",
  CHECK_IN_STAFF: "success",
  VIEWER: "neutral",
  MEMBER: "neutral",
};

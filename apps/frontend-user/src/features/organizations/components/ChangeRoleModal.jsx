import { useState, useEffect } from "react";
import { FormField, LoadingButton, Modal } from "@/shared/ui";
import { ORGANIZATION_ROLES } from "../model/organizationConstants";

export default function ChangeRoleModal({
  member,
  onClose,
  saving,
  onUpdateRole,
}) {
  const [role, setRole] = useState(member?.role || "VIEWER");

  useEffect(() => {
    if (member) setRole(member.role || "VIEWER");
  }, [member]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member) return;
    const success = await onUpdateRole(member.id, role);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={Boolean(member)}
      onClose={onClose}
      title="Change Member Role"
      subtitle={`Update workspace role for ${member?.email || ""}`}
      size="sm"
      closeOnBackdropClick={!saving}
      closeOnEscape={!saving}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormField label="Role" required>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ORGANIZATION_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </FormField>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button type="button" className="pe-secondary-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <LoadingButton type="submit" isLoading={saving} className="pe-primary-btn">
            Update Role
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

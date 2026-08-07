import { useState } from "react";
import { FormField, LoadingButton, Modal } from "@/shared/ui";
import { ORGANIZATION_ROLES } from "../model/organizationConstants";

export default function InviteMemberModal({
  isOpen,
  onClose,
  saving,
  onInvite,
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("VIEWER");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter member email");
      return;
    }

    const success = await onInvite(email.trim(), role);
    if (success) {
      setEmail("");
      setRole("VIEWER");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      subtitle="Add a collaborator or staff member to your workspace."
      size="md"
      closeOnBackdropClick={!saving}
      closeOnEscape={!saving}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <FormField label="Member Email" required error={error}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="collaborator@example.com"
          />
        </FormField>

        <FormField label="Role" required>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {ORGANIZATION_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label} — {r.description}
              </option>
            ))}
          </select>
        </FormField>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button type="button" className="pe-secondary-btn" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <LoadingButton type="submit" isLoading={saving} className="pe-primary-btn">
            Send Invitation
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

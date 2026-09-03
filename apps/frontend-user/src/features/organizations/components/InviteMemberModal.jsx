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
      setError("សូមបញ្ចូលអ៊ីមែលសមាជិក (Member Email)");
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
      title="អញ្ជើញសមាជិកក្រុមថ្មី (Invite Team Member)"
      subtitle="បន្ថែមសហការី អ្នករៀបចំការ ឬបុគ្គលិកកត់ត្រាលុយចងដៃទៅកាន់ Workspace របស់អ្នក។"
      size="md"
      closeOnBackdropClick={!saving}
      closeOnEscape={!saving}
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <FormField label="អ៊ីមែលសមាជិក (Member Email)" required error={error}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="collaborator@example.com"
            className="k-org-input"
          />
        </FormField>

        <FormField label="តួនាទី និងសិទ្ធិ (Role & Permissions)" required>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="k-org-input"
            style={{ cursor: "pointer" }}
          >
            {ORGANIZATION_ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label} — {r.description}
              </option>
            ))}
          </select>
        </FormField>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
          <button
            type="button"
            className="k-org-modal-cancel-btn"
            onClick={onClose}
            disabled={saving}
          >
            បោះបង់ (Cancel)
          </button>
          <LoadingButton type="submit" isLoading={saving} className="k-org-modal-submit-btn">
            <span>ផ្ញើការអញ្ជើញ (Send Invite)</span>
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

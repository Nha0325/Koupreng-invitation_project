import { useState } from "react";
import { IoAddOutline } from "react-icons/io5";
import { EmptyState, ErrorState, FormField, LoadingButton, Modal, SkeletonCard, toast } from "@/shared/ui";
import { useOrganizations } from "./hooks/useOrganizations";
import OrganizationCard from "./components/OrganizationCard";
import "./OrganizationPage.css";

export default function OrganizationPage() {
  const { organizations, loading, error, creating, loadOrganizations, createOrganization } =
    useOrganizations();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setCreateError("Please enter organization name");
      return;
    }

    const newOrg = await createOrganization(name.trim());
    if (newOrg) {
      setName("");
      setCreateModalOpen(false);
      toast.success("Organization created successfully");
    }
  };

  return (
    <main className="dash-main k-org-page">
      <header className="dash-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <span className="dash-kicker">Team Collaboration</span>
          <h1>ក្រុម និងអង្គភាព / Workspaces</h1>
          <p>គ្រប់គ្រងក្រុមការងារ ដៃគូសហការ និងសិទ្ធិចូលប្រើប្រាស់របស់អ្នក។</p>
        </div>
        <button
          type="button"
          className="dash-btn dash-btn-primary"
          onClick={() => setCreateModalOpen(true)}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
        >
          <IoAddOutline aria-hidden="true" />
          <span>Create Workspace</span>
        </button>
      </header>

      {error ? (
        <ErrorState message={error} onRetry={loadOrganizations} />
      ) : loading ? (
        <div className="k-org-grid">
          <SkeletonCard height="160px" />
          <SkeletonCard height="160px" />
        </div>
      ) : organizations.length === 0 ? (
        <EmptyState
          title="មិនទាន់មានក្រុមការងារនៅឡើយទេ"
          description="បង្កើតក្រុមការងារដំបូងរបស់អ្នក ដើម្បីអញ្ជើញសហការី និងរៀបចំការងាររួមគ្នា។"
          actionLabel="Create First Workspace"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <div className="k-org-grid">
          {organizations.map((org) => (
            <OrganizationCard key={org.id} organization={org} />
          ))}
        </div>
      )}

      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Team Workspace"
        subtitle="Organize planners, designers, and check-in staff under one workspace."
        size="md"
        closeOnBackdropClick={!creating}
        closeOnEscape={!creating}
      >
        <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <FormField label="Workspace / Organization Name" required error={createError}>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Royal Wedding Planners"
            />
          </FormField>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
            <button type="button" className="pe-secondary-btn" onClick={() => setCreateModalOpen(false)} disabled={creating}>
              Cancel
            </button>
            <LoadingButton type="submit" isLoading={creating} className="pe-primary-btn">
              Create
            </LoadingButton>
          </div>
        </form>
      </Modal>
    </main>
  );
}

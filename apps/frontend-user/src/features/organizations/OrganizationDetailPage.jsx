import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { IoArrowBackOutline, IoPersonAddOutline } from "react-icons/io5";
import { ConfirmDialog, EmptyState, ErrorState, SkeletonTable, StatusBadge, toast } from "@/shared/ui";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useOrganizationMembers } from "./hooks/useOrganizationMembers";
import MemberTable from "./components/MemberTable";
import InviteMemberModal from "./components/InviteMemberModal";
import ChangeRoleModal from "./components/ChangeRoleModal";
import "./OrganizationPage.css";

export default function OrganizationDetailPage() {
  const { organizationId } = useParams();
  const { user } = useAuth();
  const {
    organization,
    members,
    loading,
    error,
    saving,
    loadOrganization,
    addMember,
    updateRole,
    removeMember,
  } = useOrganizationMembers(organizationId);

  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [removingMember, setRemovingMember] = useState(null);

  const isOwner =
    organization?.ownerUserId && user?.id
      ? String(organization.ownerUserId) === String(user.id)
      : true;

  const handleInvite = async (email, role) => {
    const success = await addMember(email, role);
    if (success) {
      toast.success("Team member invited successfully");
    }
    return success;
  };

  const handleUpdateRole = async (memberId, role) => {
    const success = await updateRole(memberId, role);
    if (success) {
      setEditingMember(null);
      toast.success("Member role updated successfully");
    }
    return success;
  };

  const handleRemoveMember = async () => {
    if (!removingMember) return;
    const success = await removeMember(removingMember.id);
    if (success) {
      setRemovingMember(null);
      toast.success("Member removed from organization");
    }
  };

  return (
    <main className="dash-main k-org-page">
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/dashboard/organizations" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", color: "var(--brand-text-muted)", textDecoration: "none", fontSize: "0.875rem", fontWeight: "600" }}>
          <IoArrowBackOutline aria-hidden="true" />
          <span>Back to Workspaces</span>
        </Link>
      </div>

      {error ? (
        <ErrorState message={error} onRetry={loadOrganization} />
      ) : loading ? (
        <SkeletonTable rows={4} columns={5} />
      ) : !organization ? (
        <EmptyState title="Workspace not found" description="The requested organization does not exist or you do not have permission to access it." />
      ) : (
        <>
          <header className="dash-page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.25rem" }}>
                <span className="dash-kicker">Workspace</span>
                <StatusBadge status={organization.status || "ACTIVE"} />
              </div>
              <h1>{organization.name}</h1>
              <p style={{ margin: 0, color: "var(--brand-text-muted)" }}>@{organization.slug}</p>
            </div>
            {isOwner && (
              <button
                type="button"
                className="dash-btn dash-btn-primary"
                onClick={() => setInviteModalOpen(true)}
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
              >
                <IoPersonAddOutline aria-hidden="true" />
                <span>Invite Member</span>
              </button>
            )}
          </header>

          <section style={{ background: "var(--brand-surface)", borderRadius: "var(--radius-xl)", padding: "1.5rem", border: "1px solid var(--brand-border)" }}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.125rem", fontWeight: "700" }}>
              Team Members ({members.length})
            </h3>
            {members.length === 0 ? (
              <EmptyState title="No team members yet" description="Invite collaborators, planners, or check-in staff to this workspace." />
            ) : (
              <MemberTable
                members={members}
                ownerUserId={organization.ownerUserId}
                currentUserId={user?.id}
                onEditRole={(m) => setEditingMember(m)}
                onRemove={(m) => setRemovingMember(m)}
                isOwner={isOwner}
              />
            )}
          </section>
        </>
      )}

      <InviteMemberModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        saving={saving}
        onInvite={handleInvite}
      />

      <ChangeRoleModal
        member={editingMember}
        onClose={() => setEditingMember(null)}
        saving={saving}
        onUpdateRole={handleUpdateRole}
      />

      <ConfirmDialog
        isOpen={Boolean(removingMember)}
        onClose={() => setRemovingMember(null)}
        onConfirm={handleRemoveMember}
        title="Remove Member"
        message={`Are you sure you want to remove ${removingMember?.email || "this member"} from the organization?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={saving}
      />
    </main>
  );
}

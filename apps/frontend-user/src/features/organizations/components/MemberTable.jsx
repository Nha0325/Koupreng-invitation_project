import { IoPencilOutline, IoTrashOutline } from "react-icons/io5";
import { ResponsiveTable, StatusBadge } from "@/shared/ui";
import RoleBadge from "./RoleBadge";

export default function MemberTable({
  members = [],
  ownerUserId,
  onEditRole,
  onRemove,
  isOwner,
}) {
  return (
    <ResponsiveTable ariaLabel="Organization Members Table">
      <thead>
        <tr>
          <th>Member Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Invited / Joined</th>
          {isOwner && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {members.map((member) => {
          const isMemberOwner = member.role === "OWNER" || (member.userId && String(member.userId) === String(ownerUserId));

          return (
            <tr key={member.id}>
              <td>
                <strong>{member.email}</strong>
                {isMemberOwner && <span style={{ marginLeft: "0.5rem", fontSize: "0.75rem", color: "var(--brand-primary)", fontWeight: "bold" }}>(Owner)</span>}
              </td>
              <td>
                <RoleBadge role={member.role} />
              </td>
              <td>
                <StatusBadge status={member.status || "ACTIVE"} />
              </td>
              <td>
                {member.joinedAt
                  ? new Date(member.joinedAt).toLocaleDateString()
                  : member.invitedAt
                  ? `Invited ${new Date(member.invitedAt).toLocaleDateString()}`
                  : "—"}
              </td>
              {isOwner && (
                <td>
                  {!isMemberOwner ? (
                    <div style={{ display: "flex", gap: "0.375rem" }}>
                      <button
                        type="button"
                        className="pe-icon-btn"
                        onClick={() => onEditRole(member)}
                        title="Change role"
                        aria-label="Change role"
                      >
                        <IoPencilOutline aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="pe-icon-btn danger"
                        onClick={() => onRemove(member)}
                        title="Remove member"
                        aria-label="Remove member"
                      >
                        <IoTrashOutline aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "var(--brand-text-muted)" }}>Owner protected</span>
                  )}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </ResponsiveTable>
  );
}

import { IoPencilOutline, IoTrashOutline, IoPersonOutline } from "react-icons/io5";
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
          <th>សមាជិក (Member)</th>
          <th>តួនាទី (Role)</th>
          <th>ស្ថានភាព (Status)</th>
          <th>កាលបរិច្ឆេទចូលរួម (Joined Date)</th>
          {isOwner && <th>សកម្មភាព (Actions)</th>}
        </tr>
      </thead>
      <tbody>
        {members.map((member) => {
          const isMemberOwner =
            member.role === "OWNER" ||
            (member.userId && String(member.userId) === String(ownerUserId));

          return (
            <tr key={member.id}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div className="k-org-member-avatar">
                    <IoPersonOutline />
                  </div>
                  <div>
                    <strong style={{ color: "var(--kp-dark)", fontSize: "0.9rem" }}>{member.email}</strong>
                    {isMemberOwner && (
                      <span className="k-org-owner-tag">
                        👑 Owner
                      </span>
                    )}
                  </div>
                </div>
              </td>
              <td>
                <RoleBadge role={member.role} />
              </td>
              <td>
                <StatusBadge status={member.status || "ACTIVE"} />
              </td>
              <td style={{ color: "#64748b", fontSize: "0.85rem" }}>
                {member.joinedAt
                  ? new Date(member.joinedAt).toLocaleDateString("km-KH")
                  : member.invitedAt
                  ? `បានអញ្ជើញ ${new Date(member.invitedAt).toLocaleDateString("km-KH")}`
                  : "—"}
              </td>
              {isOwner && (
                <td>
                  {!isMemberOwner ? (
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        type="button"
                        className="k-org-action-btn edit"
                        onClick={() => onEditRole(member)}
                        title="ប្តូរតួនាទី (Change role)"
                        aria-label="Change role"
                      >
                        <IoPencilOutline aria-hidden="true" />
                        <span>Edit Role</span>
                      </button>
                      <button
                        type="button"
                        className="k-org-action-btn danger"
                        onClick={() => onRemove(member)}
                        title="ដកសមាជិកចេញ (Remove member)"
                        aria-label="Remove member"
                      >
                        <IoTrashOutline aria-hidden="true" />
                      </button>
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontStyle: "italic" }}>
                      Owner Protected
                    </span>
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

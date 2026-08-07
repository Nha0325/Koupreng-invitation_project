import { Link } from "react-router-dom";
import { IoPeopleOutline, IoArrowForwardOutline } from "react-icons/io5";
import { StatusBadge } from "@/shared/ui";

export default function OrganizationCard({ organization }) {
  const memberCount = organization.members?.length || 0;
  const status = organization.status || "ACTIVE";

  return (
    <article className="k-org-card">
      <div className="k-org-card-header">
        <div>
          <h3 className="k-org-title">{organization.name}</h3>
          <span className="k-org-slug">@{organization.slug}</span>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="k-org-card-meta">
        <div className="k-org-stat">
          <IoPeopleOutline aria-hidden="true" />
          <span>{memberCount} {memberCount === 1 ? "Member" : "Members"}</span>
        </div>
      </div>

      <div className="k-org-card-footer">
        <Link to={`/dashboard/organizations/${organization.id}`} className="k-org-open-btn">
          <span>Open Workspace</span>
          <IoArrowForwardOutline aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

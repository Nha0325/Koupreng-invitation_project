import {
  IoCopyOutline,
  IoPencilOutline,
  IoQrCodeOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { StatusBadge } from "@/shared/ui";
import { guestInviteUrl, initials } from "../model/guestMappers";

export default function GuestCard({
  guest,
  currentDraft,
  publicInvitation,
  onEdit,
  onDelete,
  onShowQr,
  onCopyLink,
  t,
}) {
  const inviteUrl = guestInviteUrl(currentDraft, guest, publicInvitation);

  return (
    <article className="pe-guest-card">
      <div className="pe-card-top">
        <span className="pe-avatar">{initials(guest.name)}</span>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0, fontSize: "1rem" }}>{guest.name}</h4>
          {guest.companionName && (
            <small style={{ color: "var(--brand-text-muted)" }}>
              + {guest.companionName}
            </small>
          )}
        </div>
        <div className="pe-guest-statuses">
          <StatusBadge status={guest.sendStatus} />
          {guest.rsvpStatus && (
            <StatusBadge
              status={guest.rsvpStatus}
              label={`RSVP: ${guest.rsvpStatus.replaceAll("_", " ")}`}
            />
          )}
        </div>
      </div>

      <div className="pe-card-details">
        <div>
          <span>{t ? t("thPhone") : "ទូរស័ព្ទ"}:</span>
          <strong>{guest.phone || "-"}</strong>
        </div>
        <div>
          <span>{t ? t("thGroup") : "ក្រុម"}:</span>
          <strong>{guest.group || "-"}</strong>
        </div>
        <div>
          <span>{t ? t("thSeats") : "ចំនួន"}:</span>
          <strong>{guest.count || 1}</strong>
        </div>
      </div>

      <div className="pe-card-actions">
        <button
          type="button"
          className="pe-icon-btn"
          onClick={() => onShowQr(guest)}
          title={t ? t("showQr") : "QR Code"}
          aria-label={t ? t("showQr") : "QR Code"}
        >
          <IoQrCodeOutline aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pe-icon-btn"
          onClick={() => onCopyLink(inviteUrl)}
          title={t ? t("copyLink") : "ចម្លងតំណ"}
          aria-label={t ? t("copyLink") : "ចម្លងតំណ"}
        >
          <IoCopyOutline aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pe-icon-btn"
          onClick={() => onEdit(guest)}
          title={t ? t("edit") : "កែប្រែ"}
          aria-label={t ? t("edit") : "កែប្រែ"}
        >
          <IoPencilOutline aria-hidden="true" />
        </button>
        <button
          type="button"
          className="pe-icon-btn danger"
          onClick={() => onDelete(guest)}
          title={t ? t("delete") : "លុប"}
          aria-label={t ? t("delete") : "លុប"}
        >
          <IoTrashOutline aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

import {
  IoCopyOutline,
  IoPencilOutline,
  IoQrCodeOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { ResponsiveTable, StatusBadge } from "@/shared/ui";
import { guestInviteUrl, initials } from "../model/guestMappers";

export default function GuestTable({
  guests = [],
  currentDraft,
  publicInvitation,
  onEdit,
  onDelete,
  onShowQr,
  onCopyLink,
  t,
}) {
  return (
    <ResponsiveTable ariaLabel="Guests List Table">
      <thead>
        <tr>
          <th>{t ? t("thGuest") : "ឈ្មោះភ្ញៀវ"}</th>
          <th>{t ? t("thPhone") : "លេខទូរស័ព្ទ"}</th>
          <th>{t ? t("thGroup") : "ក្រុម"}</th>
          <th>{t ? t("thCategory") : "ប្រភេទ"}</th>
          <th>{t ? t("thSeats") : "ចំនួន"}</th>
          <th>{t ? t("thStatus") : "ស្ថានភាព"}</th>
          <th>{t ? t("thActions") : "សកម្មភាព"}</th>
        </tr>
      </thead>
      <tbody>
        {guests.map((guest) => {
          const inviteUrl = guestInviteUrl(currentDraft, guest, publicInvitation);
          return (
            <tr key={guest.id}>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span className="pe-avatar">{initials(guest.name)}</span>
                  <div>
                    <strong>{guest.name}</strong>
                    {guest.companionName && (
                      <small style={{ display: "block", color: "var(--brand-text-muted)" }}>
                        + {guest.companionName}
                      </small>
                    )}
                  </div>
                </div>
              </td>
              <td>{guest.phone || "-"}</td>
              <td>{guest.group || "-"}</td>
              <td>{guest.category || "-"}</td>
              <td>{guest.count || 1}</td>
              <td>
                <StatusBadge status={guest.sendStatus} />
              </td>
              <td>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
                  <button
                    type="button"
                    className="pe-icon-btn"
                    onClick={() => onShowQr(guest)}
                    title={t ? t("showQr") : "បង្ហាញ QR Code"}
                  >
                    <IoQrCodeOutline aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="pe-icon-btn"
                    onClick={() => onCopyLink(inviteUrl)}
                    title={t ? t("copyLink") : "ចម្លងតំណភ្ជាប់"}
                  >
                    <IoCopyOutline aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="pe-icon-btn"
                    onClick={() => onEdit(guest)}
                    title={t ? t("edit") : "កែប្រែ"}
                  >
                    <IoPencilOutline aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    className="pe-icon-btn danger"
                    onClick={() => onDelete(guest)}
                    title={t ? t("delete") : "លុប"}
                  >
                    <IoTrashOutline aria-hidden="true" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </ResponsiveTable>
  );
}

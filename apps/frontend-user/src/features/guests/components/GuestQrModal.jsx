import { QRCode } from "react-qr-code";
import { IoCopyOutline, IoDownloadOutline } from "react-icons/io5";
import { Modal } from "@/shared/ui";
import { guestInviteUrl } from "../model/guestMappers";

export default function GuestQrModal({
  guest,
  currentDraft,
  publicInvitation,
  onClose,
  onCopyLink,
  t,
}) {
  if (!guest) return null;

  const inviteUrl = guestInviteUrl(currentDraft, guest, publicInvitation);

  const handleDownloadQr = () => {
    const svg = document.getElementById("guest-qr-svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      if (ctx) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20);
      }
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = `qr-${guest.name.replace(/\s+/g, "-")}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };

    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgData)))}`;
  };

  return (
    <Modal
      isOpen={Boolean(guest)}
      onClose={onClose}
      title={guest.name}
      subtitle={t ? t("qrModalSubtitle") : "កូដ QR សម្រាប់ធៀបការ និង RSVP"}
      size="sm"
    >
      <div className="pe-qr-content" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.25rem" }}>
        <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "16px", border: "1px solid var(--brand-border)" }}>
          <QRCode id="guest-qr-svg" value={inviteUrl} size={180} />
        </div>

        <input
          type="text"
          readOnly
          value={inviteUrl}
          style={{ width: "100%", padding: "0.5rem 0.75rem", fontSize: "0.875rem", borderRadius: "8px", border: "1px solid var(--brand-border)", textAlign: "center" }}
        />

        <div style={{ display: "flex", gap: "0.75rem", width: "100%" }}>
          <button
            type="button"
            className="pe-secondary-btn"
            style={{ flex: 1 }}
            onClick={() => onCopyLink(inviteUrl)}
          >
            <IoCopyOutline aria-hidden="true" />
            <span>{t ? t("copyLink") : "ចម្លងតំណ"}</span>
          </button>
          <button
            type="button"
            className="pe-primary-btn"
            style={{ flex: 1 }}
            onClick={handleDownloadQr}
          >
            <IoDownloadOutline aria-hidden="true" />
            <span>{t ? t("downloadQr") : "ទាញយក QR"}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

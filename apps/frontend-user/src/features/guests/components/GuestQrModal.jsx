import { useState } from "react";
import { QRCode } from "react-qr-code";
import {
  IoCopyOutline,
  IoDownloadOutline,
  IoPaperPlaneOutline,
  IoCheckmarkCircleOutline,
  IoGlobeOutline,
  IoPersonOutline,
  IoCalendarOutline,
} from "react-icons/io5";
import { Modal } from "@/shared/ui";
import { buildShareMessage, copyText, guestInviteUrl } from "../model/guestMappers";

export default function GuestQrModal({
  guest,
  currentDraft,
  publicInvitation,
  onClose,
  onCopyLink,
}) {

  const [copiedMsg, setCopiedMsg] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!guest) return null;

  const inviteUrl = guestInviteUrl(currentDraft, guest, publicInvitation);

  const groomName = publicInvitation?.groomName || currentDraft?.groomName || "";
  const brideName = publicInvitation?.brideName || currentDraft?.brideName || "";
  const coupleText = groomName && brideName ? `${groomName} ❤️ ${brideName}` : "";
  const weddingTitle = publicInvitation?.title || currentDraft?.title || "លិខិតអញ្ជើញអាពាហ៍ពិពាហ៍";
  const eventDate = publicInvitation?.eventDate || currentDraft?.eventDate || currentDraft?.date || "";
  const venueName = publicInvitation?.venueName || currentDraft?.venueName || currentDraft?.venue || "";
  const coverImg =
    publicInvitation?.designJson?.coverImage ||
    currentDraft?.designJson?.coverImage ||
    currentDraft?.coverImage ||
    "/facebook/all/03-card/cover-card.jpg";

  const guestSalutation = guest.companionName
    ? `សូមគោរពអញ្ជើញ៖ ${guest.name} និង ${guest.companionName}`
    : `សូមគោរពអញ្ជើញ៖ ${guest.name}`;

  const shareMessageText = buildShareMessage(guest, currentDraft, publicInvitation);

  const handleCopyMessage = async () => {
    const ok = await copyText(shareMessageText);
    if (ok) {
      setCopiedMsg(true);
      setTimeout(() => setCopiedMsg(false), 2500);
    }
  };

  const handleCopyUrlOnly = async () => {
    const ok = await copyText(inviteUrl);
    if (ok) {
      setCopiedUrl(true);
      if (onCopyLink) onCopyLink(inviteUrl);
      setTimeout(() => setCopiedUrl(false), 2500);
    }
  };

  const handleShareTelegram = () => {
    const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(inviteUrl)}&text=${encodeURIComponent(shareMessageText)}`;
    window.open(tgUrl, "_blank", "noopener,noreferrer");
  };

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
      subtitle="ទម្រង់ផ្ញើធៀបការ និង Link Preview (Telegram / Messenger / Social)"
      size="md"
    >
      <div className="pe-qr-content" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        
        {/* Telegram / Social Media Link Preview Card (ដូចរូបភាពទី ៣) */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            color: "#f8fafc",
            borderRadius: "14px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          }}
        >
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#38bdf8", display: "flex", alignItems: "center", gap: "0.375rem" }}>
              <IoGlobeOutline /> Telegram / Social Link Preview
            </span>
            <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>Koupreng Digital Invitation</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1rem" }}>
            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <div style={{ width: "90px", height: "90px", borderRadius: "10px", overflow: "hidden", flexShrink: 0, background: "#334155", border: "1px solid rgba(255,255,255,0.1)" }}>
                <img
                  src={coverImg}
                  alt="Wedding Cover"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => { e.target.src = "/facebook/all/03-card/cover-card.jpg"; }}
                />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "0.95rem", color: "#ffffff", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {weddingTitle} {coupleText ? `• ${coupleText}` : ""}
                </h4>
                <p style={{ margin: "0 0 0.35rem 0", fontSize: "0.825rem", color: "#e2e8f0", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <IoPersonOutline style={{ color: "#f59e0b" }} />
                  <strong>{guestSalutation}</strong>
                </p>
                {eventDate && (
                  <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.75rem", color: "#94a3b8", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <IoCalendarOutline /> {eventDate} {venueName ? `| ${venueName}` : ""}
                  </p>
                )}
                {guest.note && (
                  <p style={{ margin: "0 0 0.25rem 0", fontSize: "0.75rem", color: "#fef08a" }}>
                    📝 {guest.note}
                  </p>
                )}
                <span style={{ fontSize: "0.7rem", color: "#38bdf8", wordBreak: "break-all" }}>
                  {inviteUrl}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code & Link Field */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", background: "#f8fafc", padding: "1rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
          <div style={{ background: "#ffffff", padding: "0.6rem", borderRadius: "10px", border: "1px solid #cbd5e1", flexShrink: 0 }}>
            <QRCode id="guest-qr-svg" value={inviteUrl} size={110} />
          </div>

          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "#475569" }}>
              តំណភ្ជាប់ផ្ទាល់ខ្លួនរបស់ភ្ញៀវ (Personal Guest Link):
            </label>
            <input
              type="text"
              readOnly
              value={inviteUrl}
              style={{
                width: "100%",
                padding: "0.5rem 0.6rem",
                fontSize: "0.8rem",
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#1e293b",
              }}
            />
            <span style={{ fontSize: "0.725rem", color: "#64748b" }}>
              ភ្ញៀវបើកតំណនេះ នឹងឃើញឈ្មោះរបស់ខ្លួនដោយស្វ័យប្រវត្តិ ព្រមទាំងអាចចុច RSVP បានភ្លាមៗ។
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "0.6rem" }}>
          {/* Share Telegram */}
          <button
            type="button"
            className="pe-primary-btn"
            style={{
              background: "#229ED9",
              borderColor: "#229ED9",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              padding: "0.6rem 0.75rem",
              fontSize: "0.85rem",
              borderRadius: "8px",
            }}
            onClick={handleShareTelegram}
          >
            <IoPaperPlaneOutline aria-hidden="true" />
            <span>ផ្ញើតាម Telegram</span>
          </button>

          {/* Copy Full Message */}
          <button
            type="button"
            className="pe-secondary-btn"
            style={{
              background: copiedMsg ? "#dcfce7" : "#ffffff",
              borderColor: copiedMsg ? "#86efac" : "var(--brand-border)",
              color: copiedMsg ? "#166534" : "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              padding: "0.6rem 0.75rem",
              fontSize: "0.85rem",
              borderRadius: "8px",
            }}
            onClick={handleCopyMessage}
          >
            {copiedMsg ? <IoCheckmarkCircleOutline style={{ color: "#16a34a" }} /> : <IoCopyOutline />}
            <span>{copiedMsg ? "បានចម្លងសារ!" : "ចម្លងសារអញ្ជើញ"}</span>
          </button>

          {/* Copy Link Only */}
          <button
            type="button"
            className="pe-secondary-btn"
            style={{
              background: copiedUrl ? "#dcfce7" : "#ffffff",
              borderColor: copiedUrl ? "#86efac" : "var(--brand-border)",
              color: copiedUrl ? "#166534" : "inherit",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              padding: "0.6rem 0.75rem",
              fontSize: "0.85rem",
              borderRadius: "8px",
            }}
            onClick={handleCopyUrlOnly}
          >
            {copiedUrl ? <IoCheckmarkCircleOutline style={{ color: "#16a34a" }} /> : <IoCopyOutline />}
            <span>{copiedUrl ? "បានចម្លង Link!" : "ចម្លងតែតំណ"}</span>
          </button>

          {/* Download QR */}
          <button
            type="button"
            className="pe-secondary-btn"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.35rem",
              padding: "0.6rem 0.75rem",
              fontSize: "0.85rem",
              borderRadius: "8px",
            }}
            onClick={handleDownloadQr}
          >
            <IoDownloadOutline aria-hidden="true" />
            <span>ទាញយក QR</span>
          </button>
        </div>

      </div>
    </Modal>
  );
}

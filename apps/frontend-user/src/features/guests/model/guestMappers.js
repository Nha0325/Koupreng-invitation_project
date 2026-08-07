import { createHostRecordId } from "@/shared/storage/hostPlanningStorage";
import { DEFAULT_CATEGORIES, DEFAULT_GROUPS, SEND_STATUS } from "./guestConstants";

export function normalizeManualGuest(guest) {
  const name = guest.name || guest.guestName || "Guest";
  return {
    ...guest,
    id: guest.id || createHostRecordId("guest"),
    name,
    companionName: guest.companionName || "",
    phone: guest.phone === "-" ? "" : guest.phone || "",
    group: guest.group || guest.guestGroup || DEFAULT_GROUPS[0].name,
    category:
      guest.category ||
      guest.sideType ||
      guest.status ||
      DEFAULT_CATEGORIES[0].name,
    sendStatus: guest.sendStatus || SEND_STATUS.pending,
    count: Math.max(1, Number(guest.count) || 1),
    seat: guest.seat === "-" ? "" : guest.seat || "",
    note: guest.note || "",
    source: guest.source || "manual",
  };
}

export function normalizeBackendGuest(guest) {
  const name = guest.guestName || guest.name || "Guest";
  const id = guest.id || guest.guestId;
  return {
    id,
    backendId: id,
    raw: guest,
    name,
    companionName: "",
    phone: guest.phone === "-" ? "" : guest.phone || "",
    group: guest.guestGroup || DEFAULT_GROUPS[0].name,
    category: guest.sideType || DEFAULT_CATEGORIES[0].name,
    sendStatus: guest.sendStatus || SEND_STATUS.pending,
    count: Math.max(1, Number(guest.seatCount) || 1),
    seat: guest.tableNumber || "",
    note: guest.note || "",
    inviteToken: guest.inviteToken || "",
    qrCodeUrl: guest.qrCodeUrl || "",
    source: "backend",
  };
}

export function normalizeBackendRsvp(entry) {
  return {
    id: entry.id,
    name: entry.name || entry.guestName || "RSVP Guest",
    companionName: "",
    phone: entry.phone || "",
    group: "RSVP",
    category: "RSVP",
    sendStatus: SEND_STATUS.responded,
    amount: "-",
    seat: "",
    count: Number(entry.count) || 1,
    note: entry.message || "",
    source: "rsvp",
  };
}

export function toManualGuest(form, existingId) {
  return {
    id: existingId || createHostRecordId("guest"),
    name: form.name.trim(),
    companionName: form.companionName.trim(),
    phone: form.phone.trim(),
    group: form.group,
    category: form.category,
    sendStatus: form.sendStatus,
    amount: "-",
    seat: form.seat.trim(),
    count: Math.max(1, Number(form.count) || 1),
    note: form.note.trim(),
    source: "manual",
    updatedAt: Date.now(),
  };
}

export function toBackendGuestPayload(form) {
  return {
    guestName: form.name.trim(),
    phone: form.phone.trim() || null,
    guestGroup: form.group || null,
    sideType: form.category || null,
    tableNumber: form.seat.trim() || null,
    sendStatus: form.sendStatus || null,
    seatCount: Math.max(1, Number(form.count) || 1),
    note: form.note.trim() || null,
  };
}

export function initials(name) {
  return (
    (name || "?")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?"
  );
}

export function guestInviteUrl(draft, guest, publicInvitation) {
  const base = typeof window === "undefined" ? "" : window.location.origin;

  if (guest?.qrCodeUrl) {
    if (!base) return guest.qrCodeUrl;
    try {
      const url = new URL(guest.qrCodeUrl, base);
      return `${base}${url.pathname}${url.search}${url.hash}`;
    } catch {
      return guest.qrCodeUrl;
    }
  }

  const slug = publicInvitation?.slug || draft?.slug || draft?.id || "invitation";
  const token = guest?.inviteToken;
  const query = token ? `?token=${encodeURIComponent(token)}` : "";
  return `${base}/i/${encodeURIComponent(slug)}${query}`;
}

export async function copyText(text) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.top = "-9999px";
  document.body.appendChild(field);
  field.select();
  const copied = document.execCommand("copy");
  document.body.removeChild(field);
  return copied;
}

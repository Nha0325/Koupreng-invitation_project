import { createHostRecordId } from "@/shared/storage/hostPlanningStorage";
import { DEFAULT_CATEGORIES, DEFAULT_GROUPS, SEND_STATUS } from "./guestConstants";

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

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
    guestId: entry.guestId,
    name: entry.name || entry.guestName || "RSVP Guest",
    companionName: "",
    phone: entry.phone || "",
    group: "RSVP",
    category: "RSVP",
    sendStatus: SEND_STATUS.responded,
    amount: "-",
    seat: "",
    count: Number(entry.attendeeCount ?? entry.count) || 1,
    note: entry.message || "",
    rsvpStatus: entry.responseStatus || entry.status || "",
    respondedAt: entry.respondedAt || "",
    source: "rsvp",
  };
}

export function mergeBackendGuestsWithRsvps(guests = [], rsvps = []) {
  const rsvpByGuestId = new Map(
    rsvps
      .filter((rsvp) => rsvp?.guestId != null)
      .map((rsvp) => [String(rsvp.guestId), rsvp])
  );

  return guests.map((guest) => {
    const rsvp = rsvpByGuestId.get(String(guest.backendId ?? guest.id));
    if (!rsvp) return guest;

    return {
      ...guest,
      rsvpStatus: rsvp.rsvpStatus,
      rsvpAttendeeCount: rsvp.count,
      rsvpRespondedAt: rsvp.respondedAt,
    };
  });
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
    guestName: cleanText(form.name),
    phone: cleanText(form.phone) || null,
    guestGroup: form.group || null,
    sideType: form.category || null,
    tableNumber: cleanText(form.seat) || null,
    sendStatus: form.sendStatus || null,
    seatCount: Math.max(1, Number(form.count) || 1),
    note: cleanText(form.note) || null,
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
  const rawSlug = publicInvitation?.slug || draft?.slug || draft?.id || "invitation";
  try {
    return `${base}/w/${decodeURIComponent(rawSlug)}`;
  } catch {
    return `${base}/w/${rawSlug}`;
  }
}


export function buildShareMessage(guest, draft, publicInvitation) {
  if (!guest) return "";
  const inviteUrl = guestInviteUrl(draft, guest, publicInvitation);
  const groomName = publicInvitation?.groomName || draft?.groomName || "";
  const brideName = publicInvitation?.brideName || draft?.brideName || "";
  const coupleText = groomName && brideName ? `(${groomName} ❤️ ${brideName})` : "";
  const weddingTitle = publicInvitation?.title || draft?.title || "លិខិតអញ្ជើញអាពាហ៍ពិពាហ៍";
  const eventDate = publicInvitation?.eventDate || draft?.eventDate || draft?.date || "";
  const venueName = publicInvitation?.venueName || draft?.venueName || draft?.venue || "";

  const guestSalutation = guest.companionName
    ? `សូមគោរពអញ្ជើញ៖ ${guest.name} និង ${guest.companionName}`
    : `សូមគោរពអញ្ជើញ៖ ${guest.name}`;

  const dateText = eventDate ? `\n📅 កាលបរិច្ឆេទ៖ ${eventDate}` : "";
  const venueText = venueName ? `\n📍 ទីតាំង៖ ${venueName}` : "";
  const noteText = guest.note?.trim() ? `\n📝 កំណត់ចំណាំ៖ ${guest.note.trim()}` : "";

  return `💌 ${weddingTitle} ${coupleText ? `${coupleText}\n` : ""}${guestSalutation}
ចូលរួមជាអធិបតី និងជាភ្ញៀវកិត្តិយសក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ។${dateText}${venueText}${noteText}

👉 សូមចុចតំណភ្ជាប់ដើម្បីមើលធៀបការ និង RSVP:
${inviteUrl}`;
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

/**
 * rsvpStorage — minimal localStorage-based RSVP store.
 * Responses are grouped by draftId (or slug).
 */
const RSVP_KEY = "koupreng.wedding.rsvps";

function safeRandomId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `rsvp-${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}

function readAll() {
  try {
    const raw = localStorage.getItem(RSVP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeAll(map) {
  try {
    localStorage.setItem(RSVP_KEY, JSON.stringify(map));
  } catch {
    // ignore localStorage write error
  }
}

export function listRsvps(targetId) {
  if (!targetId) return [];

  const all = readAll();
  return all[targetId] || [];
}

export function addRsvp(targetId, payload) {
  if (!targetId) return null;

  const all = readAll();
  const responses = all[targetId] || [];

  const response = {
    id: safeRandomId(),
    ...payload,
    submittedAt: Date.now(),
  };

  all[targetId] = [response, ...responses];

  writeAll(all);

  return response;
}

/**
 * Backward-compatible API.
 * Use this if your form submits payload.invitationId.
 */
export function submitRsvp(payload) {
  const targetId = payload.invitationId || payload.draftId || payload.slug;

  return addRsvp(targetId, payload);
}

/**
 * Backward-compatible API.
 */
export function listRsvpByInvitation(invitationId) {
  return listRsvps(invitationId);
}

export default {
  listRsvps,
  addRsvp,
  submitRsvp,
  listRsvpByInvitation,
};
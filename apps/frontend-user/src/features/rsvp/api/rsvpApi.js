import { api } from "@/shared/api/httpClient";
import { toQuery, unwrap } from "@/shared/api/helpers";

const RSVP_KEY_PREFIX = "koupreng:rsvps";
const LEGACY_RSVP_KEY = "koupreng.wedding.rsvps";

function scopedRsvpKey(targetId) {
  return `${RSVP_KEY_PREFIX}:${targetId}`;
}

function safeRandomId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `rsvp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function readLegacy(targetId) {
  try {
    const raw = localStorage.getItem(LEGACY_RSVP_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[targetId] || [];
  } catch {
    return [];
  }
}

export function listRsvps(targetId) {
  if (!targetId) return [];

  try {
    const raw = localStorage.getItem(scopedRsvpKey(targetId));
    return raw ? JSON.parse(raw) : readLegacy(targetId);
  } catch {
    return readLegacy(targetId);
  }
}

export function addRsvp(targetId, payload) {
  if (!targetId) return null;

  const response = {
    id: safeRandomId(),
    ...payload,
    submittedAt: Date.now(),
  };

  try {
    localStorage.setItem(scopedRsvpKey(targetId), JSON.stringify([response, ...listRsvps(targetId)]));
  } catch {
    // localStorage may be full or disabled.
  }

  return response;
}

export async function submitRsvp(payload) {
  const slug = payload.slug;
  if (slug) {
    try {
      const response = await rsvpService.submitPublic(slug, payload);
      return response;
    } catch {
      // Fallback to local draft caching if offline
    }
  }
  const targetId = payload.invitationId || payload.draftId || payload.slug;
  return addRsvp(targetId, payload);
}

export function listRsvpByInvitation(invitationId) {
  return listRsvps(invitationId);
}

function publicParams(params) {
  if (typeof params === "string") {
    return { token: params };
  }
  return params || {};
}

export const rsvpService = {
  submitPublic: (slug, data, params) =>
    api
      .post(`/v1/public/invitations/${encodeURIComponent(slug)}/rsvp${toQuery(publicParams(params))}`, data, { skipAuth: true })
      .then(unwrap),
  submitPublicWithToken: (slug, token, data, params) =>
    api
      .post(
        `/v1/public/invitations/${encodeURIComponent(slug)}/guests/${encodeURIComponent(token)}/rsvp${toQuery(publicParams(params))}`,
        data,
        { skipAuth: true },
      )
      .then(unwrap),
  publicWishes: (slug, params) =>
    api.get(`/v1/public/invitations/${encodeURIComponent(slug)}/wishes${toQuery(publicParams(params))}`, { skipAuth: true }).then(unwrap),
  listByInvitation: (invitationId) => api.get(`/v1/invitations/${invitationId}/rsvps`).then(unwrap),
  summary: (invitationId) => api.get(`/v1/invitations/${invitationId}/rsvps/summary`).then(unwrap),
};

export default rsvpService;

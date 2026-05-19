/**
 * weddingStorage — minimal localStorage-based draft store for the
 * wedding builder. No backend yet. Drafts are keyed by draftId.
 *
 * Shape of a draft:
 * {
 *   id: string,
 *   templateId: string,
 *   slug: string,
 *   couple: { groom, bride },
 *   event: { date, ceremonyTime, receptionTime, venueName, venueAddress },
 *   story: string,
 *   gallery: string[],
 *   rsvp: { enabled, deadline },
 *   updatedAt: number,
 * }
 */

const KEY = "koupreng.wedding.drafts";

function readAll() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
}

function writeAll(map) {
    try {
        localStorage.setItem(KEY, JSON.stringify(map));
    } catch {
        // localStorage may be full or disabled; fail silently
    }
}

function generateId() {
    return `wed-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function listDrafts() {
    return Object.values(readAll()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
}

export function getDraft(draftId) {
    if (!draftId) return null;
    const all = readAll();
    return all[draftId] || null;
}

export function getDraftBySlug(slug) {
    if (!slug) return null;
    const all = readAll();
    return Object.values(all).find((d) => d.slug === slug) || null;
}

export function saveDraft(draft) {
    const all = readAll();
    const id = draft.id || generateId();
    const next = { ...draft, id, updatedAt: Date.now() };
    all[id] = next;
    writeAll(all);
    return next;
}

export function deleteDraft(draftId) {
    const all = readAll();
    delete all[draftId];
    writeAll(all);
}

export function createDraft(initial = {}) {
    return saveDraft({
        templateId: initial.templateId || "royal",
        slug: initial.slug || "",
        couple: { groom: "", bride: "", ...initial.couple },
        event: {
            date: "",
            ceremonyTime: "",
            receptionTime: "",
            venueName: "",
            venueAddress: "",
            ...initial.event,
        },
        story: initial.story || "",
        gallery: initial.gallery || [],
        rsvp: { enabled: true, deadline: "", ...initial.rsvp },
        ...initial,
    });
}

export default {
    listDrafts,
    getDraft,
    getDraftBySlug,
    saveDraft,
    deleteDraft,
    createDraft,
};

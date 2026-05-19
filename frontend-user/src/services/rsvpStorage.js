/**
 * rsvpStorage — minimal localStorage-based RSVP store.
 * Responses are grouped by draftId (or slug).
 */

const KEY = "koupreng.wedding.rsvps";

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
        // ignore
    }
}

export function listRsvps(targetId) {
    const all = readAll();
    return all[targetId] || [];
}

export function addRsvp(targetId, response) {
    if (!targetId) return null;
    const all = readAll();
    const list = all[targetId] || [];
    const entry = { id: `rsvp-${Date.now()}`, createdAt: Date.now(), ...response };
    all[targetId] = [...list, entry];
    writeAll(all);
    return entry;
}

export default {
    listRsvps,
    addRsvp,
};

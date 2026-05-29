const STORAGE_KEYS = {
    guests: "koupreng.host.manualGuests",
    expenses: "koupreng.host.expenses",
    gifts: "koupreng.host.gifts",
    activeEvent: "koupreng.host.activeEventId",
};

function readList(key, fallback = []) {
    if (typeof localStorage === "undefined") return fallback;

    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return fallback;

        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

function writeList(key, list) {
    if (typeof localStorage === "undefined") return;

    try {
        localStorage.setItem(key, JSON.stringify(Array.isArray(list) ? list : []));
    } catch {
        // localStorage may be full or disabled.
    }
}

export function createHostRecordId(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ── Active Event ──

export function getActiveEventId() {
    if (typeof localStorage === "undefined") return null;
    return localStorage.getItem(STORAGE_KEYS.activeEvent) || null;
}

export function setActiveEventId(eventId) {
    if (typeof localStorage === "undefined") return;
    if (eventId) {
        localStorage.setItem(STORAGE_KEYS.activeEvent, eventId);
    } else {
        localStorage.removeItem(STORAGE_KEYS.activeEvent);
    }
}

// ── Per-event storage helpers ──

function eventKey(baseKey, eventId) {
    return eventId ? `${baseKey}.${eventId}` : baseKey;
}

export function listManualGuests(eventId) {
    const id = eventId || getActiveEventId();
    return readList(eventKey(STORAGE_KEYS.guests, id));
}

export function saveManualGuests(guests, eventId) {
    const id = eventId || getActiveEventId();
    writeList(eventKey(STORAGE_KEYS.guests, id), guests);
}

export function listBudgetExpenses(defaultItems = [], eventId) {
    const id = eventId || getActiveEventId();
    return readList(eventKey(STORAGE_KEYS.expenses, id), defaultItems);
}

export function saveBudgetExpenses(expenses, eventId) {
    const id = eventId || getActiveEventId();
    writeList(eventKey(STORAGE_KEYS.expenses, id), expenses);
}

export function listWeddingGifts(defaultItems = [], eventId) {
    const id = eventId || getActiveEventId();
    return readList(eventKey(STORAGE_KEYS.gifts, id), defaultItems);
}

export function saveWeddingGifts(gifts, eventId) {
    const id = eventId || getActiveEventId();
    writeList(eventKey(STORAGE_KEYS.gifts, id), gifts);
}

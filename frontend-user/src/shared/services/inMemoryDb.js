/**
 * In-memory user database, persisted to localStorage.
 *
 * Frontend-only mode — no backend required. Mimics the JSON shapes the real
 * Spring Boot API would return so the rest of the app (AuthContext,
 * authService, userService) doesn't have to care that everything is fake.
 *
 * Storage layout (all under one root key to keep dev tools tidy):
 *
 *   koupreng.db = {
 *     users:   [ { id, name, email, phone, password, createdAt } ],
 *     tokens:  { [token]: userId },
 *     otps:    { [identifier]: { code, expiresAt, kind } },
 *     resets:  { [token]: { userId, expiresAt } },
 *   }
 *
 * NOTE: Passwords are stored in plain text on purpose. This is a UI-only
 * sandbox that runs entirely in the browser, so there's nowhere to hide a
 * secret anyway. Do NOT reuse this store as-is for anything that talks to a
 * real server.
 */

const DB_KEY = "koupreng.db";

const OTP_TTL_MS = 10 * 60 * 1000;       // 10 minutes
const RESET_TTL_MS = 30 * 60 * 1000;     // 30 minutes

/* ─────────────────────────────────────────
   Storage helpers
───────────────────────────────────────── */

function emptyDb() {
    return { users: [], tokens: {}, otps: {}, resets: {} };
}

function readDb() {
    try {
        if (typeof localStorage === "undefined") return emptyDb();
        const raw = localStorage.getItem(DB_KEY);
        if (!raw) return emptyDb();
        const parsed = JSON.parse(raw);
        return {
            users: Array.isArray(parsed.users) ? parsed.users : [],
            tokens: parsed.tokens && typeof parsed.tokens === "object" ? parsed.tokens : {},
            otps: parsed.otps && typeof parsed.otps === "object" ? parsed.otps : {},
            resets: parsed.resets && typeof parsed.resets === "object" ? parsed.resets : {},
        };
    } catch {
        return emptyDb();
    }
}

function writeDb(db) {
    try {
        if (typeof localStorage === "undefined") return;
        localStorage.setItem(DB_KEY, JSON.stringify(db));
    } catch {
        // localStorage may be unavailable (private mode, SSR); operations
        // become no-ops which is acceptable for a dev sandbox.
    }
}

/* ─────────────────────────────────────────
   Seed
───────────────────────────────────────── */

function seedIfEmpty() {
    const db = readDb();
    if (db.users.length === 0) {
        db.users.push({
            id: "demo-user",
            name: "Demo Host",
            email: "demo@koupreng.com",
            phone: "012345678",
            password: "demo1234",
            createdAt: new Date().toISOString(),
        });
        writeDb(db);
    }
}
seedIfEmpty();

/* ─────────────────────────────────────────
   Internals
───────────────────────────────────────── */

function makeId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return `id_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function makeToken() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID().replace(/-/g, "");
    }
    return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function makeOtp() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function publicUser(user) {
    if (!user) return null;
    // Strip the password before returning to the UI.
    // eslint-disable-next-line no-unused-vars
    const { password, ...rest } = user;
    return rest;
}

function normalizeIdentifier(identifier) {
    return String(identifier || "").trim().toLowerCase();
}

function findUserByIdentifier(db, identifier) {
    const id = normalizeIdentifier(identifier);
    if (!id) return null;
    return (
        db.users.find(
            (u) =>
                (u.email && u.email.toLowerCase() === id) ||
                (u.phone && u.phone === identifier.trim()),
        ) || null
    );
}

/* ─────────────────────────────────────────
   Public API — auth
───────────────────────────────────────── */

export function login({ email, password }) {
    const db = readDb();
    const user = findUserByIdentifier(db, email);
    if (!user) {
        const err = new Error("គណនីនេះមិនមានទេ"); // Account not found
        err.code = "USER_NOT_FOUND";
        throw err;
    }
    if (user.password !== password) {
        const err = new Error("លេខសម្ងាត់មិនត្រឹមត្រូវ"); // Wrong password
        err.code = "INVALID_PASSWORD";
        throw err;
    }
    const token = makeToken();
    db.tokens[token] = user.id;
    writeDb(db);
    return { accessToken: token, user: publicUser(user) };
}

export function register({ name, email, phone, password }) {
    const db = readDb();

    if (email && db.users.some((u) => u.email && u.email.toLowerCase() === email.toLowerCase())) {
        const err = new Error("អ៊ីមែលនេះត្រូវបានប្រើរួចហើយ"); // Email already in use
        err.code = "EMAIL_TAKEN";
        throw err;
    }
    if (phone && db.users.some((u) => u.phone === phone)) {
        const err = new Error("លេខទូរស័ព្ទនេះត្រូវបានប្រើរួចហើយ"); // Phone already in use
        err.code = "PHONE_TAKEN";
        throw err;
    }

    const user = {
        id: makeId(),
        name: name || "",
        email: email || "",
        phone: phone || "",
        password,
        createdAt: new Date().toISOString(),
    };
    db.users.push(user);

    const token = makeToken();
    db.tokens[token] = user.id;
    writeDb(db);

    return { accessToken: token, user: publicUser(user) };
}

export function logout(token) {
    const db = readDb();
    if (token && db.tokens[token]) {
        delete db.tokens[token];
        writeDb(db);
    }
    return { ok: true };
}

export function getUserByToken(token) {
    if (!token) return null;
    const db = readDb();
    const userId = db.tokens[token];
    if (!userId) return null;
    const user = db.users.find((u) => u.id === userId);
    return publicUser(user);
}

/* ─────────────────────────────────────────
   Public API — profile
───────────────────────────────────────── */

export function updateUser(token, patch) {
    const db = readDb();
    const userId = db.tokens[token];
    if (!userId) {
        const err = new Error("មិនបានចូលគណនី"); // Not logged in
        err.code = "UNAUTHENTICATED";
        throw err;
    }
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx === -1) {
        const err = new Error("គណនីមិនមានទេ");
        err.code = "USER_NOT_FOUND";
        throw err;
    }
    const allowed = ["name", "email", "phone"];
    const next = { ...db.users[idx] };
    for (const key of allowed) {
        if (patch && Object.prototype.hasOwnProperty.call(patch, key)) {
            next[key] = patch[key];
        }
    }
    db.users[idx] = next;
    writeDb(db);
    return publicUser(next);
}

export function changePassword(token, { currentPassword, newPassword }) {
    const db = readDb();
    const userId = db.tokens[token];
    if (!userId) {
        const err = new Error("មិនបានចូលគណនី");
        err.code = "UNAUTHENTICATED";
        throw err;
    }
    const idx = db.users.findIndex((u) => u.id === userId);
    if (idx === -1) {
        const err = new Error("គណនីមិនមានទេ");
        err.code = "USER_NOT_FOUND";
        throw err;
    }
    if (db.users[idx].password !== currentPassword) {
        const err = new Error("លេខសម្ងាត់បច្ចុប្បន្នមិនត្រឹមត្រូវ");
        err.code = "INVALID_PASSWORD";
        throw err;
    }
    db.users[idx] = { ...db.users[idx], password: newPassword };
    writeDb(db);
    return { ok: true };
}

/* ─────────────────────────────────────────
   Public API — forgot / reset password
───────────────────────────────────────── */

export function requestOtp({ identifier }) {
    const db = readDb();
    const user = findUserByIdentifier(db, identifier);
    if (!user) {
        const err = new Error("គណនីនេះមិនមានទេ");
        err.code = "USER_NOT_FOUND";
        throw err;
    }
    const code = makeOtp();
    db.otps[normalizeIdentifier(identifier)] = {
        code,
        userId: user.id,
        expiresAt: Date.now() + OTP_TTL_MS,
    };
    writeDb(db);

    // Dev-only: surface the OTP so the user can complete the flow without an
    // email/SMS provider. In a real backend this would be sent over email/SMS.
    // eslint-disable-next-line no-console
    console.info(`[koupreng] OTP for ${identifier}: ${code}`);

    return { ok: true, devOtp: code };
}

export function verifyOtp({ identifier, code }) {
    const db = readDb();
    const key = normalizeIdentifier(identifier);
    const entry = db.otps[key];
    if (!entry) {
        const err = new Error("OTP មិនត្រឹមត្រូវ");
        err.code = "OTP_NOT_FOUND";
        throw err;
    }
    if (entry.expiresAt < Date.now()) {
        delete db.otps[key];
        writeDb(db);
        const err = new Error("OTP បានផុតកំណត់");
        err.code = "OTP_EXPIRED";
        throw err;
    }
    if (entry.code !== String(code)) {
        const err = new Error("OTP មិនត្រឹមត្រូវ");
        err.code = "OTP_INVALID";
        throw err;
    }
    // Mint a short-lived reset token tied to this user.
    const resetToken = makeToken();
    db.resets[resetToken] = {
        userId: entry.userId,
        expiresAt: Date.now() + RESET_TTL_MS,
    };
    delete db.otps[key];
    writeDb(db);
    return { resetToken };
}

export function resetPassword({ token, password }) {
    const db = readDb();
    const entry = db.resets[token];
    if (!entry) {
        const err = new Error("តំណកំណត់ឡើងវិញមិនត្រឹមត្រូវ");
        err.code = "RESET_INVALID";
        throw err;
    }
    if (entry.expiresAt < Date.now()) {
        delete db.resets[token];
        writeDb(db);
        const err = new Error("តំណកំណត់ឡើងវិញបានផុតកំណត់");
        err.code = "RESET_EXPIRED";
        throw err;
    }
    const idx = db.users.findIndex((u) => u.id === entry.userId);
    if (idx === -1) {
        const err = new Error("គណនីមិនមានទេ");
        err.code = "USER_NOT_FOUND";
        throw err;
    }
    db.users[idx] = { ...db.users[idx], password };
    delete db.resets[token];
    writeDb(db);
    return { ok: true };
}

/* ─────────────────────────────────────────
   Test utilities
───────────────────────────────────────── */

export function _resetForTests() {
    writeDb(emptyDb());
    seedIfEmpty();
}

/**
 * galleryStorage — IndexedDB-based storage for gallery images/videos.
 * localStorage has a 5MB limit which is too small for base64 images.
 * IndexedDB can store hundreds of MB.
 */

const DB_NAME = "koupreng_gallery";
const DB_VERSION = 1;
const STORE_NAME = "items";

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "draftId" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Save gallery items for a draft.
 * @param {string} draftId
 * @param {Array} gallery - array of { id, name, type, preview }
 */
export async function saveGallery(draftId, gallery) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.put({ draftId, gallery });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

/**
 * Load gallery items for a draft.
 * @param {string} draftId
 * @returns {Promise<Array>} gallery items
 */
export async function loadGallery(draftId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(draftId);
        request.onsuccess = () => resolve(request.result?.gallery || []);
        request.onerror = () => reject(request.error);
    });
}

/**
 * Delete gallery for a draft.
 * @param {string} draftId
 */
export async function deleteGallery(draftId) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.delete(draftId);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

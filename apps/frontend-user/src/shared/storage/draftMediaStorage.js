const DB_NAME = "koupreng_draft_media";
const DB_VERSION = 1;
const STORE_NAME = "files";

function openDatabase() {
  if (typeof indexedDB === "undefined") {
    return Promise.reject(new Error("Draft media storage is unavailable in this browser."));
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME, { keyPath: "key" });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function recordKey(draftId, kind) {
  return `${draftId}:${kind}`;
}

export async function saveDraftMediaFile(draftId, kind, file) {
  if (!draftId || !kind || !(file instanceof Blob)) {
    throw new Error("A valid draft, media kind, and file are required.");
  }
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).put({
      key: recordKey(draftId, kind),
      draftId,
      kind,
      file,
      name: file.name || `${kind}-media`,
      type: file.type || "application/octet-stream",
      size: file.size,
      updatedAt: Date.now(),
    });
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function loadDraftMediaFile(draftId, kind) {
  if (!draftId || !kind) return null;
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readonly");
    const request = transaction.objectStore(STORE_NAME).get(recordKey(draftId, kind));
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function loadDraftMediaFiles(draftId) {
  const entries = await Promise.all(
    ["cover", "openingVideo", "music"].map(async (kind) => [kind, await loadDraftMediaFile(draftId, kind)])
  );
  return Object.fromEntries(entries.filter(([, value]) => Boolean(value)));
}

export async function deleteDraftMediaFile(draftId, kind) {
  if (!draftId || !kind) return;
  const database = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, "readwrite");
    transaction.objectStore(STORE_NAME).delete(recordKey(draftId, kind));
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
}

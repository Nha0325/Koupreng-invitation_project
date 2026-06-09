import { create } from "zustand";

const STORAGE_KEY = "koupreng.lang";
const LEGACY_STORAGE_KEYS = ["koupreng.locale"];

function readStoredLang() {
  try {
    const keys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];

    for (const key of keys) {
      const value = localStorage.getItem(key);

      if (value === "km" || value === "en") {
        return value;
      }
    }

    return "km";
  } catch {
    return "km";
  }
}

function writeStoredLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang);
    LEGACY_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, lang));
  } catch {
    // ignore storage error
  }
}

export const useLanguageStore = create((set, get) => ({
  lang: readStoredLang(),

  setLang: (lang) => {
    if (lang !== "km" && lang !== "en") return;

    writeStoredLang(lang);
    set({ lang });
  },

  toggleLang: () => {
    const currentLang = get().lang;
    const nextLang = currentLang === "km" ? "en" : "km";

    writeStoredLang(nextLang);
    set({ lang: nextLang });
  },
}));

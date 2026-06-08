import { create } from "zustand";

const STORAGE_KEY = "koupreng.lang";
const LEGACY_STORAGE_KEYS = ["koupreng.locale"];

const SUPPORTED = ["km", "en"];

function readStored() {
    try {
        const keys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
        for (const key of keys) {
            const v = localStorage.getItem(key);
            if (SUPPORTED.includes(v)) return v;
        }
        return null;
    } catch {
        return null;
    }
}

export const useLanguageStore = create((set) => ({
    lang: readStored() || "km",

    setLang: (lang) => {
        if (!SUPPORTED.includes(lang)) return;
        try {
            localStorage.setItem(STORAGE_KEY, lang);
            LEGACY_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, lang));
        } catch {
            // ignore
        }
        set({ lang });
    },
}));

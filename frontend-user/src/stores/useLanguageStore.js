import { create } from "zustand";

const STORAGE_KEY = "koupreng.lang";
const LEGACY_STORAGE_KEYS = ["koupreng.locale"];

function readStored() {
    try {
        const keys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
        for (const key of keys) {
            const v = localStorage.getItem(key);
            switch (v) {
                case "km":
                case "en":
                    return v;
                default:
                    break;
            }
        }
        return null;
    } catch {
        return null;
    }
}

export const useLanguageStore = create((set) => ({
    lang: readStored() || "km",

    setLang: (lang) => {
        switch (lang) {
            case "km":
            case "en":
                break;
            default:
                return;
        }
        try {
            localStorage.setItem(STORAGE_KEY, lang);
            LEGACY_STORAGE_KEYS.forEach((key) => localStorage.setItem(key, lang));
        } catch {
            // ignore
        }
        set({ lang });
    },
}));

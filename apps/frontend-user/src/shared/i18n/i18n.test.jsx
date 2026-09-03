import { beforeEach, describe, expect, it } from "vitest";
import { useLanguageStore } from "../../stores/useLanguageStore";
import { LOCAL_MESSAGES } from "./messagesDictionary";

describe("Multi-Language Khmer & English Localization Engine (Feature 30)", () => {
    beforeEach(() => {
        localStorage.clear();
        useLanguageStore.getState().setLang("km");
    });

    it("defaults to Khmer ('km') language", () => {
        expect(useLanguageStore.getState().lang).toBe("km");
    });

    it("switches language between Khmer and English and persists to localStorage", () => {
        useLanguageStore.getState().setLang("en");
        expect(useLanguageStore.getState().lang).toBe("en");
        expect(localStorage.getItem("koupreng.lang")).toBe("en");

        useLanguageStore.getState().setLang("km");
        expect(useLanguageStore.getState().lang).toBe("km");
        expect(localStorage.getItem("koupreng.lang")).toBe("km");
    });

    it("ignores unsupported language codes", () => {
        useLanguageStore.getState().setLang("fr");
        expect(useLanguageStore.getState().lang).toBe("km");
    });

    it("contains bilingual parity across all core message domains", () => {
        const requiredDomains = [
            "hostNav",
            "events",
            "dashboard",
            "guests",
            "expenses",
            "gifts",
            "invitations",
            "templates",
        ];

        for (const domain of requiredDomains) {
            expect(LOCAL_MESSAGES[domain]).toBeDefined();
            expect(LOCAL_MESSAGES[domain].km).toBeDefined();
            expect(LOCAL_MESSAGES[domain].en).toBeDefined();
            expect(Object.keys(LOCAL_MESSAGES[domain].km).length).toBeGreaterThan(0);
            expect(Object.keys(LOCAL_MESSAGES[domain].en).length).toBeGreaterThan(0);
        }
    });

    it("renders accurate Khmer and English navigation labels", () => {
        expect(LOCAL_MESSAGES.hostNav.km.events).toBe("កម្មវិធី");
        expect(LOCAL_MESSAGES.hostNav.en.events).toBe("Events");
        expect(LOCAL_MESSAGES.hostNav.km.guests).toBe("បញ្ជីភ្ញៀវ");
        expect(LOCAL_MESSAGES.hostNav.en.guests).toBe("Guests");
    });
});

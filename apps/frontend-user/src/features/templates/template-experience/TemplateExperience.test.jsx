import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import TemplateExperience from "./TemplateExperience";
import TemplateOpeningGate from "./sections/TemplateOpeningGate";

function setReducedMotion(matches) {
    window.matchMedia = vi.fn().mockImplementation(() => ({
        matches,
        media: "(prefers-reduced-motion: reduce)",
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    }));
}

function content(overrides = {}) {
    return {
        variant: "garden-royal-khmer-wedding",
        amp: "&",
        badge: "",
        enabledSections: {
            countdown: false,
            story: false,
            gallery: false,
            schedule: false,
            map: false,
            party: false,
            dressCode: false,
            gift: false,
            wish: false,
            faq: false,
            rsvp: true,
        },
        monogramText: "ស & ម",
        guestName: "លោកអ្នក និងក្រុមគ្រួសារ",
        groom: "សុវណ្ណ",
        bride: "មាលា",
        dateText: "ថ្ងៃទី ២២ ខែកក្កដា ឆ្នាំ ២០២៦",
        coverImage: "/cover.jpg",
        portraitImage: "/cover.jpg",
        message: "សូមចូលរួមពិធីមង្គលការរបស់យើងខ្ញុំ។",
        families: "រួមជាមួយក្រុមគ្រួសារទាំងសងខាង",
        couple: { groomIntro: "កូនកំលោះ", brideIntro: "កូនក្រមុំ", groomParents: "", brideParents: "" },
        venue: { name: "ភ្នំពេញ", address: "", mapLink: null, mapEmbedUrl: null, image: "/cover.jpg" },
        gallery: [],
        story: [],
        schedule: [],
        party: [],
        gift: [],
        faq: [],
        contact: {},
        design: {
            openingStyle: "khmer-royal",
            openingOverlayOpacity: 0.48,
            frameStyle: "double-gold",
            ornamentStyle: "khmer-corner-01",
        },
        opening: {
            heading: "សិរីមង្គលអាពាហ៍ពិពាហ៍",
            invitationText: "យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ",
            genericGuestText: "លោកអ្នក និងក្រុមគ្រួសារ",
            openButtonText: "បើកសំបុត្រអញ្ជើញ",
        },
        music: "/wedding.mp3",
        openingVideo: null,
        ...overrides,
    };
}

const tpl = { id: "garden-royal-khmer-wedding", name: "Garden Royal" };

function renderExperience(props = {}) {
    return render(
        <MemoryRouter>
            <TemplateExperience tpl={tpl} content={content()} {...props} />
        </MemoryRouter>
    );
}

async function openInvitation() {
    fireEvent.click(screen.getByRole("button", { name: "បើកសំបុត្រអញ្ជើញ" }));
    await waitFor(() => {
        expect(document.querySelector(".tx-experience")).toBeInTheDocument();
    });
}

describe("TemplateExperience opening gate", () => {
    beforeEach(() => {
        setReducedMotion(true);
        vi.stubGlobal("IntersectionObserver", class {
            constructor(callback) {
                this.callback = callback;
            }

            observe(element) {
                this.callback([{ isIntersecting: true, target: element }]);
            }

            unobserve() {}

            disconnect() {}
        });
        vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
            callback();
            return 1;
        });
        vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
        vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
        vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
        vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    });

    afterEach(() => {
        cleanup();
        document.body.style.overflow = "";
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });

    it("starts closed, locks scrolling, and restores the original overflow on cleanup", () => {
        document.body.style.overflow = "clip";
        const view = renderExperience();
        expect(screen.getByRole("button", { name: "បើកសំបុត្រអញ្ជើញ" })).toBeVisible();
        expect(document.body.style.overflow).toBe("hidden");
        view.unmount();
        expect(document.body.style.overflow).toBe("clip");
    });

    it("opens once, starts music from that interaction, and renders RSVP exactly once", async () => {
        const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
        render(
            <MemoryRouter>
                <TemplateExperience tpl={tpl} content={content()}>
                <form data-testid="public-rsvp">RSVP</form>
                </TemplateExperience>
            </MemoryRouter>
        );
        expect(play).not.toHaveBeenCalled();
        await openInvitation();
        expect(play).toHaveBeenCalledTimes(1);
        expect(screen.getAllByTestId("public-rsvp")).toHaveLength(1);
        expect(document.activeElement).toHaveClass("tx-experience");
        await waitFor(() => {
            expect(document.body.style.overflow).toBe("");
        });
    });

    it("handles rejected audio playback without blocking the reveal", async () => {
        vi.spyOn(HTMLMediaElement.prototype, "play").mockRejectedValue(new Error("blocked"));
        renderExperience();
        await openInvitation();
        expect(screen.getByRole("button", { name: "បើកតន្ត្រី" })).toHaveAttribute("data-music-status", "error");
        expect(screen.getByText("សូមគោរពអញ្ជើញ")).toBeVisible();
    });

    it("uses immediate reduced-motion state changes", async () => {
        setReducedMotion(true);
        renderExperience();
        fireEvent.click(screen.getByRole("button", { name: "បើកសំបុត្រអញ្ជើញ" }));
        await waitFor(() => expect(document.querySelector(".tx-experience")).toBeInTheDocument());
        expect(screen.getByText("សូមគោរពអញ្ជើញ")).toBeVisible();
    });

    it("keeps disabled optional sections hidden", async () => {
        renderExperience({ content: content({ faq: [{ id: "q", q: "Question", a: "Answer" }] }) });
        await openInvitation();
        expect(screen.queryByText("Question")).not.toBeInTheDocument();
        expect(document.querySelector(".tx-gallery")).not.toBeInTheDocument();
    });

    it("keeps preview gates inside the phone flow without locking the parent document or starting sound", async () => {
        const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
        renderExperience({ preview: true });
        expect(document.body.style.overflow).toBe("");
        await openInvitation();
        expect(play).not.toHaveBeenCalled();
        expect(screen.getByRole("button", { name: "បើកគម្របម្តងទៀត" })).toBeVisible();
    });
});

describe("TemplateOpeningGate media and greeting fallbacks", () => {
    beforeEach(() => {
        setReducedMotion(true);
        vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
        vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
        vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
    });

    it("falls back to the cover image when the opening video fails", () => {
        const gateContent = content({ openingVideo: { url: "/broken.mp4" } });
        const view = render(<TemplateOpeningGate content={gateContent} lockDocumentScroll={false} onOpen={() => {}} />);
        fireEvent.error(view.container.querySelector("video"));
        expect(view.container.querySelector("video")).not.toBeInTheDocument();
        expect(view.container.querySelector('img[src="/cover.jpg"]')).toBeInTheDocument();
    });

    it("shows a safe visual placeholder when both opening media sources are missing", () => {
        const gateContent = content({ coverImage: "", openingVideo: null });
        const view = render(<TemplateOpeningGate content={gateContent} lockDocumentScroll={false} onOpen={() => {}} />);
        expect(view.container.querySelector("video")).not.toBeInTheDocument();
        expect(view.container.querySelector(".tx-image-fallback.tx-gate__media")).toBeInTheDocument();
    });

    it("shows secure personalized data when supplied and generic copy otherwise", () => {
        const personalized = render(
            <TemplateOpeningGate
                content={content({ guestName: "លោក សុវណ្ណ និងក្រុមគ្រួសារ" })}
                lockDocumentScroll={false}
                onOpen={() => {}}
            />
        );
        expect(screen.getByText("សូមគោរពអញ្ជើញ លោក សុវណ្ណ និងក្រុមគ្រួសារ")).toBeVisible();
        personalized.unmount();
        render(<TemplateOpeningGate content={content({ guestName: "" })} lockDocumentScroll={false} onOpen={() => {}} />);
        expect(screen.getByText("សូមគោរពអញ្ជើញ លោកអ្នក និងក្រុមគ្រួសារ")).toBeVisible();
    });
});

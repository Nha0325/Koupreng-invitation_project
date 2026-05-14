import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import SectionHeading from "./SectionHeading";

describe("SectionHeading", () => {
    it("renders the title as a level-2 heading", () => {
        render(<SectionHeading title="Our Story" />);
        const h = screen.getByRole("heading", { level: 2, name: /our story/i });
        expect(h).toBeInTheDocument();
        // Title uses the display font via inline style.
        expect(h.style.fontFamily).toMatch(/--font-display/);
    });

    it("renders the eyebrow when provided", () => {
        render(<SectionHeading eyebrow="✦ Schedule" title="The Day" />);
        expect(screen.getByText(/schedule/i)).toBeInTheDocument();
    });

    it("renders the subtitle when provided", () => {
        render(
            <SectionHeading
                title="RSVP"
                subtitle="Please respond by April 1"
            />,
        );
        expect(
            screen.getByText(/please respond by april 1/i),
        ).toBeInTheDocument();
    });

    it("aligns left when align='left'", () => {
        render(<SectionHeading title="Left aligned" align="left" />);
        const heading = screen.getByRole("heading", { level: 2 });
        const wrapper = heading.parentElement;
        expect(wrapper?.style.textAlign).toBe("left");
    });
});

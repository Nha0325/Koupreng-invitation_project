import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import GlassCard from "./GlassCard";

describe("GlassCard", () => {
    it("renders children inside a .glass container", () => {
        render(
            <GlassCard>
                <span data-testid="child">hello</span>
            </GlassCard>,
        );
        const child = screen.getByTestId("child");
        expect(child).toBeInTheDocument();
        const card = child.parentElement;
        expect(card).not.toBeNull();
        expect(card?.classList.contains("glass")).toBe(true);
    });

    it("merges additional className alongside .glass", () => {
        render(
            <GlassCard className="pricing-card featured">
                <span data-testid="child" />
            </GlassCard>,
        );
        const card = screen.getByTestId("child").parentElement;
        expect(card?.classList.contains("glass")).toBe(true);
        expect(card?.classList.contains("pricing-card")).toBe(true);
        expect(card?.classList.contains("featured")).toBe(true);
    });
});

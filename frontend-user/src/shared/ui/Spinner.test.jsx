import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner", () => {
    it("renders with role=status and the default aria-label", () => {
        render(<Spinner />);
        const node = screen.getByRole("status", { name: /loading/i });
        expect(node).toBeInTheDocument();
    });

    it("respects a custom aria-label", () => {
        render(<Spinner aria-label="Saving changes" />);
        expect(
            screen.getByRole("status", { name: /saving changes/i }),
        ).toBeInTheDocument();
    });

    it("applies the size prop to the wrapper", () => {
        render(<Spinner size={48} aria-label="Loading large" />);
        const node = screen.getByRole("status", { name: /loading large/i });
        expect(node).toHaveStyle({ width: "48px", height: "48px" });
    });
});

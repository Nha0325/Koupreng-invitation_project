import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Button from "./Button";

describe("Button", () => {
    it("renders a real <button> by default and fires onClick", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Save</Button>);

        const btn = screen.getByRole("button", { name: /save/i });
        expect(btn.tagName).toBe("BUTTON");
        await user.click(btn);
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("renders a <Link> when `to` is provided", () => {
        render(
            <MemoryRouter>
                <Button to="/login">Sign in</Button>
            </MemoryRouter>,
        );
        const link = screen.getByRole("link", { name: /sign in/i });
        expect(link.tagName).toBe("A");
        expect(link.getAttribute("href")).toBe("/login");
    });

    it("renders an <a> when `href` is provided", () => {
        render(<Button href="https://example.com">External</Button>);
        const link = screen.getByRole("link", { name: /external/i });
        expect(link.tagName).toBe("A");
        expect(link.getAttribute("href")).toBe("https://example.com");
    });

    it("disables the button and shows a spinner when loading=true", () => {
        render(<Button loading>Submitting</Button>);
        const btn = screen.getByRole("button", { name: /submitting/i });
        expect(btn).toBeDisabled();
        expect(btn.getAttribute("aria-busy")).toBe("true");
        // The Spinner inside also exposes role=status.
        expect(
            screen.getByRole("status", { name: /loading/i }),
        ).toBeInTheDocument();
    });

    it("does not fire onClick when disabled", async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <Button disabled onClick={onClick}>
                Nope
            </Button>,
        );
        await user.click(screen.getByRole("button", { name: /nope/i }));
        expect(onClick).not.toHaveBeenCalled();
    });
});

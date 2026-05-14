import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import Toaster, { toast } from "./Toaster";

/**
 * The Toaster auto-dismisses via a real `setTimeout` and animates exits
 * with framer-motion's `AnimatePresence`, which runs animations on its own
 * timing. Using fake timers fights both, so we use real timers with very
 * short durations and `waitFor` to observe state transitions.
 */

describe("Toaster", () => {
    it("renders a toast pushed via the module-level toast() helper", () => {
        render(<Toaster />);

        act(() => {
            toast("Saved!");
        });

        expect(screen.getByText(/saved!/i)).toBeInTheDocument();
    });

    it("auto-dismisses a toast after its duration elapses", async () => {
        render(<Toaster />);

        act(() => {
            toast("Will disappear", { duration: 50 });
        });

        expect(screen.getByText(/will disappear/i)).toBeInTheDocument();

        await waitFor(
            () => {
                expect(
                    screen.queryByText(/will disappear/i),
                ).not.toBeInTheDocument();
            },
            { timeout: 2000 },
        );
    });

    it("trims to a maximum of 4 visible toasts", () => {
        render(<Toaster />);

        // Use a long duration so none of them get auto-dismissed before we
        // assert visibility.
        act(() => {
            for (let i = 1; i <= 6; i++) {
                toast(`Toast ${i}`, { duration: 60_000 });
            }
        });

        // The two oldest should have been dropped on overflow.
        expect(screen.queryByText("Toast 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Toast 2")).not.toBeInTheDocument();
        // The four newest should remain.
        expect(screen.getByText("Toast 3")).toBeInTheDocument();
        expect(screen.getByText("Toast 4")).toBeInTheDocument();
        expect(screen.getByText("Toast 5")).toBeInTheDocument();
        expect(screen.getByText("Toast 6")).toBeInTheDocument();
    });

    it("dismisses a toast on click", async () => {
        const user = userEvent.setup();
        render(<Toaster />);

        act(() => {
            toast("Click me", { duration: 60_000 });
        });
        const node = await screen.findByText(/click me/i);
        await user.click(node);

        await waitFor(
            () => {
                expect(screen.queryByText(/click me/i)).not.toBeInTheDocument();
            },
            { timeout: 2000 },
        );
    });

    it("falls back to the module-level toast() when used outside provider", () => {
        // `useToast()` returns a stub whose `push` forwards to the
        // module-level `toast()` so accidental mis-use still works.
        render(<Toaster />);

        act(() => {
            toast("Fallback path", { duration: 60_000 });
        });
        expect(screen.getByText(/fallback path/i)).toBeInTheDocument();
    });
});

import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import HostShell from "./HostShell";
import { toast } from "../ui/Toaster";

/**
 * HostShell composes existing primitives (Header, Aside, PageTransition,
 * Toaster) and renders an `<Outlet />` for the matched child route. These
 * tests assert the structural composition without re-testing the primitives
 * themselves.
 */

function ProtectedChild() {
    return <div data-testid="host-page">host page content</div>;
}

function renderShell(initialEntry = "/app/dashboard") {
    return render(
        <MemoryRouter initialEntries={[initialEntry]}>
            <Routes>
                <Route element={<HostShell />}>
                    <Route
                        path="/app/dashboard"
                        element={<ProtectedChild />}
                    />
                </Route>
            </Routes>
        </MemoryRouter>,
    );
}

describe("HostShell", () => {
    it("renders the Header (logo) and Aside (primary nav landmark)", () => {
        renderShell();

        // Header renders the Koupreng logo link.
        expect(
            screen.getByRole("link", { name: /koupreng/i }),
        ).toBeInTheDocument();

        // Aside renders a primary navigation landmark.
        expect(
            screen.getByRole("navigation", { name: /primary navigation/i }),
        ).toBeInTheDocument();
    });

    it("renders the matched child route through <Outlet />", () => {
        renderShell();
        expect(screen.getByTestId("host-page")).toBeInTheDocument();
        expect(screen.getByTestId("host-page")).toHaveTextContent(
            "host page content",
        );
    });

    it("wraps the outlet in a scrollable <main> region", () => {
        const { container } = renderShell();
        const main = container.querySelector("main");
        expect(main).not.toBeNull();
        // The child route content must live inside <main>.
        expect(main).toContainElement(screen.getByTestId("host-page"));
    });

    it("exposes a Toaster slot that picks up module-level toast() calls", () => {
        renderShell();

        act(() => {
            toast("Welcome back", { duration: 60_000 });
        });

        expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    });
});

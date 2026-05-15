import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import HostShell from "./HostShell";
import { AuthContext } from "../../app/auth/AuthContext";
import { toast } from "../ui/Toaster";



function ProtectedChild() {
    return <div data-testid="host-page">host page content</div>;
}

const fakeAuth = {
    user: { id: "u1", name: "Demo Host" },
    token: "tok",
    status: "authenticated",
    login: () => { },
    logout: () => { },
    refresh: async () => null,
};

function renderShell(initialEntry = "/app/dashboard") {
    return render(
        <AuthContext.Provider value={fakeAuth}>
            <MemoryRouter initialEntries={[initialEntry]}>
                <Routes>
                    <Route element={<HostShell />}>
                        <Route
                            path="/app/dashboard"
                            element={<ProtectedChild />}
                        />
                    </Route>
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>,
    );
}

describe("HostShell", () => {
    it("does not render the marketing Header inside the host shell", () => {
        renderShell();

        // The marketing `<Header />` (Koupreng logo + Log in / Get Started CTAs)
        // must NOT appear once the user is in the authenticated host area.
        expect(
            screen.queryByRole("link", { name: /koupreng/i }),
        ).not.toBeInTheDocument();

        // Aside still renders a primary navigation landmark.
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

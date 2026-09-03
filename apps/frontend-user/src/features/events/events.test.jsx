import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import EventsFeature from "./EventsFeature";
import { eventsApi } from "./api/eventsApi";

describe("Events Feature", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("renders events list with wedding invitations", async () => {
        vi.spyOn(eventsApi, "listMine").mockResolvedValue([
            {
                id: "evt-1",
                title: "Dara & Sophea Wedding",
                status: "PUBLISHED",
                eventDate: "2026-11-20",
                coverImage: "/test-cover.jpg",
                groomName: "Dara",
                brideName: "Sophea",
            },
        ]);

        render(
            <BrowserRouter>
                <EventsFeature />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Dara & Sophea Wedding")).toBeInTheDocument();
            expect(screen.getByText("Dara & Sophea")).toBeInTheDocument();
        });
    });
});

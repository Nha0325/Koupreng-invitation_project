import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import RsvpDashboardPage from "./RsvpDashboardPage";

vi.mock("./api/rsvpApi", () => ({
  default: {
    listByInvitation: vi.fn().mockResolvedValue([
      { id: 101, guestName: "Vireak", status: "ATTENDING", partySize: 2, wish: "Congratulations!" },
    ]),
    summary: vi.fn().mockResolvedValue({ attending: 1, declined: 0, pending: 0 }),
  },
}));

vi.mock("@/features/invitations/api/invitationApi", () => ({
  invitationService: {
    get: vi.fn().mockResolvedValue({ id: 1, title: "Dara & Sophea Wedding" }),
  },
}));

describe("RsvpDashboardPage Module", () => {
  it("renders host RSVP summary and responses table", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/invitations/1/rsvp"]}>
        <Routes>
          <Route path="/dashboard/invitations/:invitationId/rsvp" element={<RsvpDashboardPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Dara & Sophea Wedding")).toBeInTheDocument();
      expect(screen.getByText("Vireak")).toBeInTheDocument();
      expect(screen.getByText("Congratulations!")).toBeInTheDocument();
    });
  });
});

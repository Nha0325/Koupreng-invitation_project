import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import DashboardFeature from "./DashboardFeature";

vi.mock("@/features/invitations/api/invitationApi", () => ({
  invitationService: {
    listMine: vi.fn().mockResolvedValue([
      {
        id: 1,
        title: "Dara & Sophea Wedding",
        status: "PUBLISHED",
        slug: "dara-sophea",
        eventDate: "2026-03-15",
      },
    ]),
  },
}));

vi.mock("@/features/guests/api/guestApi", () => ({
  guestService: {
    listByInvitation: vi.fn().mockResolvedValue([
      { id: 101, guestName: "Vireak", status: "ACCEPTED", count: 2 },
    ]),
    checkInSummary: vi.fn().mockResolvedValue({ totalCheckedIn: 1, totalGuests: 2 }),
  },
}));

vi.mock("@/features/rsvp/api/rsvpApi", () => ({
  rsvpService: {
    listByInvitation: vi.fn().mockResolvedValue([
      { id: 201, guestName: "Vireak", status: "ACCEPTED", count: 2 },
    ]),
    summary: vi.fn().mockResolvedValue({ accepted: 2, declined: 0, pending: 0 }),
  },
}));

vi.mock("../budget/api/budgetApi", () => ({
  budgetService: {
    listItems: vi.fn().mockResolvedValue([
      { id: 301, name: "Venue Deposit", amount: 500, budget: 1000 },
    ]),
  },
}));

vi.mock("@/features/planning/api/planningApi", () => ({
  planningService: {
    listGifts: vi.fn().mockResolvedValue([
      { id: 401, payerName: "Uncle Sok", amount: 100, currency: "USD" },
    ]),
  },
}));

vi.mock("../notifications/notificationService", () => ({
  default: {
    listByInvitation: vi.fn().mockResolvedValue([
      { id: 501, title: "RSVP Confirmed", body: "Vireak accepted" },
    ]),
  },
}));

vi.mock("../seating/seatingService", () => ({
  default: {
    plan: vi.fn().mockResolvedValue(null),
  },
}));

describe("DashboardFeature", () => {
  it("renders host dashboard KPIs and active invitation context", async () => {
    render(
      <BrowserRouter>
        <DashboardFeature />
      </BrowserRouter>
    );

    await waitFor(() => {
      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Dara & Sophea Wedding");
    });
  });
});

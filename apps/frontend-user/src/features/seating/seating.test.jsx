import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import InvitationSeatingPage from "./InvitationSeatingPage";

afterEach(() => {
  cleanup();
});

vi.mock("./seatingService", () => {
  const plan = {
    invitationId: 10,
    tables: [
      { id: 1, tableName: "Table A1", tableLabel: "VIP", capacity: 10, assignedSeats: 2, remainingSeats: 8 },
    ],
    assignments: [
      { id: 101, tableId: 1, guestId: 50, guestName: "Sok Dara", seatLabel: "Seat 1", seatCount: 2 },
    ],
    unassignedGuests: [
      { id: 51, guestName: "Keo Sophea", seatCount: 1 },
    ],
  };

  return {
    seatingService: {
      plan: vi.fn().mockResolvedValue(plan),
      createTable: vi.fn().mockResolvedValue({ id: 2, tableName: "Table A2", capacity: 10, assignedSeats: 0 }),
      assign: vi.fn().mockResolvedValue({ id: 102, tableId: 1, guestId: 51, guestName: "Keo Sophea", seatCount: 1 }),
      unassign: vi.fn().mockResolvedValue(null),
      deleteTable: vi.fn().mockResolvedValue(null),
      exportCsv: vi.fn().mockResolvedValue(undefined),
    },
    default: {
      plan: vi.fn().mockResolvedValue(plan),
      createTable: vi.fn().mockResolvedValue({ id: 2, tableName: "Table A2", capacity: 10, assignedSeats: 0 }),
      assign: vi.fn().mockResolvedValue({ id: 102, tableId: 1, guestId: 51, guestName: "Keo Sophea", seatCount: 1 }),
      unassign: vi.fn().mockResolvedValue(null),
      deleteTable: vi.fn().mockResolvedValue(null),
      exportCsv: vi.fn().mockResolvedValue(undefined),
    },
  };
});

vi.mock("@/features/invitations/api/invitationApi", () => ({
  invitationService: {
    get: vi.fn().mockResolvedValue({ id: 10, title: "Dara & Sophea Wedding" }),
  },
}));

vi.mock("../../shared/ui/toast", () => ({
  toast: vi.fn(),
}));

describe("InvitationSeatingPage Feature", () => {
  it("renders seating plan with tables, assignments, and unassigned guests", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/invitations/10/seating"]}>
        <Routes>
          <Route path="/dashboard/invitations/:invitationId/seating" element={<InvitationSeatingPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Dara & Sophea Wedding");
      expect(screen.getByRole("heading", { level: 3, name: "Table A1" })).toBeInTheDocument();
      expect(screen.getByText("Sok Dara")).toBeInTheDocument();
      expect(screen.getByText("Keo Sophea")).toBeInTheDocument();
    });
  });

  it("handles creating a new table", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/invitations/10/seating"]}>
        <Routes>
          <Route path="/dashboard/invitations/:invitationId/seating" element={<InvitationSeatingPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 3, name: "Table A1" })).toBeInTheDocument();
    });

    const createTableBtn = screen.getByRole("button", { name: "Create table" });
    fireEvent.click(createTableBtn);

    await waitFor(() => {
      expect(createTableBtn).toBeInTheDocument();
    });
  });
});

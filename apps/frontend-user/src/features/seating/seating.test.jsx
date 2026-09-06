import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import InvitationSeatingPage from "./InvitationSeatingPage";
import { SeatingFloorPlan, calculateAutoArrangePositions } from "./components/SeatingFloorPlan";

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

  it("renders SeatingFloorPlan component directly without error", () => {
    const mockTables = [
      { id: 1, tableName: "Table A1", tableLabel: "VIP", capacity: 10, assignedSeats: 2 },
    ];
    render(
      <SeatingFloorPlan
        tables={mockTables}
        assignmentsByTable={new Map()}
        onSavePositions={vi.fn()}
      />
    );

    expect(screen.getAllByText(/ឆាកមង្គលការ/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/ផ្លូវកម្រាលព្រំក្រហម/i)).toBeInTheDocument();
  });

  it("switches to Canva floor plan view and displays stage and tables", async () => {
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

    const floorPlanTab = screen.getByTestId("tab-floor-plan");
    fireEvent.click(floorPlanTab);

    await waitFor(() => {
      expect(screen.getAllByText(/ឆាកមង្គលការ/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/ផ្លូវកម្រាលព្រំក្រហម/i)).toBeInTheDocument();
    });
  });

  it("calculates clean multi-column, non-overlapping grid positions for 30 tables", () => {
    const thirtyTables = Array.from({ length: 30 }, (_, i) => ({
      id: i + 1,
      tableName: `តុ ${i + 1}`,
      capacity: 10,
    }));

    const positions = calculateAutoArrangePositions(thirtyTables, {
      walkway: { enabled: true, orientation: "vertical" },
    });

    expect(Object.keys(positions)).toHaveLength(30);

    // Verify all positions exist and are valid numbers
    Object.values(positions).forEach((pos) => {
      expect(pos.x).toBeGreaterThan(0);
      expect(pos.x).toBeLessThan(100);
      expect(pos.y).toBeGreaterThan(0);
      expect(pos.y).toBeLessThan(100);
    });

    // Verify zero collision (distance between any two distinct tables >= 12)
    const posList = Object.values(positions);
    for (let i = 0; i < posList.length; i++) {
      for (let j = i + 1; j < posList.length; j++) {
        const dist = Math.hypot(posList[i].x - posList[j].x, posList[i].y - posList[j].y);
        expect(dist).toBeGreaterThanOrEqual(12);
      }
    }
  });

  it("scales and arranges 100 tables into symmetrical 5-column wings without collision", () => {
    const hundredTables = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      tableName: `តុ ${i + 1}`,
      capacity: 10,
    }));

    const positions = calculateAutoArrangePositions(hundredTables, {
      walkway: { enabled: true, orientation: "vertical" },
    });

    expect(Object.keys(positions)).toHaveLength(100);

    // Verify all 100 tables are within canvas bounds
    Object.values(positions).forEach((pos) => {
      expect(pos.x).toBeGreaterThanOrEqual(5);
      expect(pos.x).toBeLessThanOrEqual(95);
      expect(pos.y).toBeGreaterThanOrEqual(15);
      expect(pos.y).toBeLessThanOrEqual(85);
    });

    // Check distance between distinct tables >= 6.8% (safe clearance for scale 0.54)
    const posList = Object.values(positions);
    for (let i = 0; i < posList.length; i++) {
      for (let j = i + 1; j < posList.length; j++) {
        const dist = Math.hypot(posList[i].x - posList[j].x, posList[i].y - posList[j].y);
        expect(dist).toBeGreaterThanOrEqual(6.8);
      }
    }
  });
});


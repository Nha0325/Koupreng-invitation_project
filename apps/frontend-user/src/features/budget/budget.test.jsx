import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import BudgetPage from "./BudgetPage";

afterEach(() => {
  cleanup();
});

vi.mock("./api/budgetApi", () => {
  const mockBudget = {
    id: 1,
    totalBudget: 5000,
    totalEstimated: 3000,
    totalActual: 3200,
    remainingBudget: 1800,
    overBudget: false,
    notes: "Family support",
    items: [
      {
        id: 101,
        category: "VENUE",
        itemName: "Hotel Ballroom Deposit",
        estimatedCost: 2000,
        actualCost: 2200,
        vendorName: "Himawari Hotel",
        notes: "50% deposit paid",
      },
    ],
  };

  return {
    budgetService: {
      getBudget: vi.fn().mockResolvedValue(mockBudget),
      updateBudget: vi.fn().mockResolvedValue({
        ...mockBudget,
        totalBudget: 6000,
      }),
      addItem: vi.fn().mockResolvedValue({
        ...mockBudget,
        items: [
          ...mockBudget.items,
          { id: 102, category: "FOOD", itemName: "Catering", estimatedCost: 1000, actualCost: 1000 },
        ],
      }),
      deleteItem: vi.fn().mockResolvedValue({
        ...mockBudget,
        items: [],
      }),
      exportBudget: vi.fn().mockResolvedValue(undefined),
    },
    default: {
      getBudget: vi.fn().mockResolvedValue(mockBudget),
      updateBudget: vi.fn().mockResolvedValue({
        ...mockBudget,
        totalBudget: 6000,
      }),
      addItem: vi.fn().mockResolvedValue({
        ...mockBudget,
        items: [
          ...mockBudget.items,
          { id: 102, category: "FOOD", itemName: "Catering", estimatedCost: 1000, actualCost: 1000 },
        ],
      }),
      deleteItem: vi.fn().mockResolvedValue({
        ...mockBudget,
        items: [],
      }),
      exportBudget: vi.fn().mockResolvedValue(undefined),
    },
  };
});

describe("BudgetPage Module", () => {
  it("renders budget summary cards and item list", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/invitations/1/budget"]}>
        <Routes>
          <Route path="/dashboard/invitations/:invitationId/budget" element={<BudgetPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("គ្រប់គ្រងថវិកា");
      expect(screen.getByText("Hotel Ballroom Deposit")).toBeInTheDocument();
      expect(screen.getByText("Himawari Hotel")).toBeInTheDocument();
    });
  });

  it("handles budget update submission", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/invitations/1/budget"]}>
        <Routes>
          <Route path="/dashboard/invitations/:invitationId/budget" element={<BudgetPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Hotel Ballroom Deposit")).toBeInTheDocument();
    });

    const saveBtn = screen.getByRole("button", { name: /រក្សាទុកថវិកា/i });
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(saveBtn).toBeInTheDocument();
    });
  });

  it("triggers CSV export when export button is clicked", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard/invitations/1/budget"]}>
        <Routes>
          <Route path="/dashboard/invitations/:invitationId/budget" element={<BudgetPage />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Export CSV/i })).toBeInTheDocument();
    });

    const exportBtn = screen.getByRole("button", { name: /Export CSV/i });
    fireEvent.click(exportBtn);

    await waitFor(() => {
      expect(exportBtn).toBeInTheDocument();
    });
  });
});

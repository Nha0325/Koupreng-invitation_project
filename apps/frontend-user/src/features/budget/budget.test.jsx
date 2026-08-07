import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import BudgetPage from "./BudgetPage";

vi.mock("./api/budgetApi", () => ({
  default: {
    getBudget: vi.fn().mockResolvedValue({
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
    }),
    updateBudget: vi.fn().mockResolvedValue({
      id: 1,
      totalBudget: 6000,
      totalActual: 3200,
      remainingBudget: 2800,
      overBudget: false,
    }),
    addItem: vi.fn().mockResolvedValue({
      id: 1,
      totalBudget: 5000,
      totalActual: 3700,
      items: [],
    }),
    deleteItem: vi.fn().mockResolvedValue({}),
    exportBudget: vi.fn().mockResolvedValue({}),
  },
}));

describe("BudgetPage Module", () => {
  it("renders budget summary cards and budget progress", async () => {
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
  });
});

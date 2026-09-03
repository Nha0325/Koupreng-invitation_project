import { render, screen, waitFor, cleanup, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ExpensesFeature from "./ExpensesFeature";
import { expensesApi } from "./api/expensesApi";

describe("Expenses Feature", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    afterEach(() => {
        cleanup();
    });

    it("renders expenses overview with summary totals and expense records", async () => {
        vi.spyOn(expensesApi, "listMineInvitations").mockResolvedValue([
            { id: "inv-1", name: "Wedding", status: "PUBLISHED" },
        ]);

        vi.spyOn(expensesApi, "listExpenses").mockResolvedValue([
            {
                id: 1,
                itemName: "Venue Rental",
                category: "Venue & Transport",
                estimatedCost: 2000,
                actualCost: 2000,
                status: "PAID",
                expenseDate: "2026-11-20",
                vendorName: "Grand Ballroom",
            },
            {
                id: 2,
                itemName: "Wedding Cake",
                category: "Food & Catering",
                estimatedCost: 300,
                actualCost: 350,
                status: "PENDING",
                expenseDate: "2026-11-20",
                vendorName: "Sweet Bakery",
            },
        ]);

        render(
            <BrowserRouter>
                <ExpensesFeature />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Venue Rental")).toBeInTheDocument();
            expect(screen.getByText("Wedding Cake")).toBeInTheDocument();
            expect(screen.getByText("Grand Ballroom")).toBeInTheDocument();
            expect(screen.getByText("$2,300")).toBeInTheDocument();
        });
    });

    it("opens add expense modal on add button click", async () => {
        vi.spyOn(expensesApi, "listMineInvitations").mockResolvedValue([
            { id: "inv-1", name: "Wedding", status: "PUBLISHED" },
        ]);

        vi.spyOn(expensesApi, "listExpenses").mockResolvedValue([]);

        render(
            <BrowserRouter>
                <ExpensesFeature />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /\+ បន្ថែមចំណាយ|\+ Add Expense/i })).toBeInTheDocument();
        });

        const addBtn = screen.getByRole("button", { name: /\+ បន្ថែមចំណាយ|\+ Add Expense/i });
        fireEvent.click(addBtn);

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /បោះបង់|Cancel/i })).toBeInTheDocument();
        });
    });
});

import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import GiftsFeature from "./GiftsFeature";
import { planningService } from "@/features/planning/api/planningApi";

vi.mock("@/features/invitations/api/invitationApi", () => ({
  invitationService: {
    listMine: vi.fn().mockResolvedValue([
      { id: 1, title: "Dara & Sophea Wedding", status: "PUBLISHED" },
    ]),
  },
  default: {
    listMine: vi.fn().mockResolvedValue([
      { id: 1, title: "Dara & Sophea Wedding", status: "PUBLISHED" },
    ]),
  },
}));

vi.mock("@/features/planning/api/planningApi", () => ({
  planningService: {
    listGifts: vi.fn().mockResolvedValue([
      { id: 101, name: "Uncle Sok", amount: 100, method: "Bakong QR", date: "2026-03-15", note: "Best wishes" },
    ]),
    createGift: vi.fn().mockResolvedValue({ id: 102, name: "Aunt Chann", amount: 50, method: "ABA" }),
    updateGift: vi.fn().mockResolvedValue({ id: 101, name: "Uncle Sok", amount: 150 }),
    deleteGift: vi.fn().mockResolvedValue({}),
  },
  default: {
    listGifts: vi.fn().mockResolvedValue([
      { id: 101, name: "Uncle Sok", amount: 100, method: "Bakong QR", date: "2026-03-15", note: "Best wishes" },
    ]),
  },
}));

vi.mock("@/features/guests/api/guestApi", () => ({
  guestService: {
    listByInvitation: vi.fn().mockResolvedValue([
      { id: 201, guestName: "Uncle Sok" },
    ]),
  },
  default: {
    listByInvitation: vi.fn().mockResolvedValue([
      { id: 201, guestName: "Uncle Sok" },
    ]),
  },
}));

describe("GiftsFeature Module", () => {
  it("renders wedding gifts header and gift records", async () => {
    render(
      <BrowserRouter>
        <GiftsFeature />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(planningService.listGifts).toHaveBeenCalledWith(1);
      expect(screen.getByText("sumTotal")).toBeInTheDocument();
    });
  });
});

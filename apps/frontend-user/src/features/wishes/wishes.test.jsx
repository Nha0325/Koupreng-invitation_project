import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useWishes } from "./hooks/useWishes";

vi.mock("./api/wishesApi", () => ({
  wishesApi: {
    listByInvitation: vi.fn().mockResolvedValue([
      { id: "1", guestName: "Sokha", message: "Congratulations!", createdAt: "2026-05-01" },
      { id: "2", guestName: "Bopha", message: "Wishing you best wishes", createdAt: "2026-05-02" },
    ]),
    deleteWish: vi.fn().mockResolvedValue({}),
  },
}));

describe("useWishes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads wishes list on mount", async () => {
    const { result } = renderHook(() => useWishes("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.wishes.length).toBe(2);
    expect(result.current.error).toBe("");
  });

  it("provides deleteWish action", async () => {
    const { result } = renderHook(() => useWishes("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.deleteWish).toBe("function");
  });
});

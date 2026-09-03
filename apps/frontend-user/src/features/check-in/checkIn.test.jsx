import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCheckIn } from "./hooks/useCheckIn";

vi.mock("./api/checkInApi", () => ({
  checkInApi: {
    getSummary: vi.fn().mockResolvedValue({
      totalGuests: 200,
      checkedInCount: 120,
    }),
    getList: vi.fn().mockResolvedValue([
      { id: "1", guestName: "Sokha", checkedInAt: "2026-05-01T18:00:00Z", method: "QR" },
    ]),
    scanQr: vi.fn().mockResolvedValue({
      id: "2",
      guestName: "Dara",
      checkedInAt: "2026-05-01T18:05:00Z",
    }),
    manualCheckIn: vi.fn().mockResolvedValue({}),
    undoCheckIn: vi.fn().mockResolvedValue({}),
  },
}));

describe("useCheckIn", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads check-in summary and list on mount", async () => {
    const { result } = renderHook(() => useCheckIn("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.summary?.totalGuests).toBe(200);
    expect(result.current.checkIns.length).toBe(1);
    expect(result.current.error).toBe("");
  });

  it("provides scanQrCode action", async () => {
    const { result } = renderHook(() => useCheckIn("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.scanQrCode).toBe("function");
  });

  it("provides manualCheckIn and undoCheckIn actions", async () => {
    const { result } = renderHook(() => useCheckIn("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.manualCheckIn).toBe("function");
    expect(typeof result.current.undoCheckIn).toBe("function");
  });
});

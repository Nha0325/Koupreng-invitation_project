import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useDelivery } from "./hooks/useDelivery";

vi.mock("./api/deliveryApi", () => ({
  deliveryApi: {
    list: vi.fn().mockResolvedValue([
      { id: "1", guestName: "Sokha", status: "DELIVERED", channel: "TELEGRAM", sentAt: "2026-05-01" },
    ]),
    summary: vi.fn().mockResolvedValue({
      total: 50,
      delivered: 40,
      pending: 8,
      failed: 2,
    }),
    sendInvitation: vi.fn().mockResolvedValue({}),
    sendBatch: vi.fn().mockResolvedValue({}),
  },
}));

describe("useDelivery", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads deliveries and summary on mount", async () => {
    const { result } = renderHook(() => useDelivery("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.deliveries.length).toBe(1);
    expect(result.current.summary?.delivered).toBe(40);
    expect(result.current.error).toBe("");
  });

  it("provides sendToGuest action", async () => {
    const { result } = renderHook(() => useDelivery("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.sendToGuest).toBe("function");
  });

  it("provides sendBatch action", async () => {
    const { result } = renderHook(() => useDelivery("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.sendBatch).toBe("function");
  });
});

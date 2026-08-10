import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }));
vi.mock("../../shared/api/httpClient", () => ({ api }));

import paymentService from "./paymentService";
import { isTerminalStatus, statusMessage } from "./paymentStatus";

describe("payment frontend contract", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads server-authoritative payment history and receipts", async () => {
    api.get
      .mockResolvedValueOnce({ data: [{ orderCode: "KP-1", status: "PENDING" }] })
      .mockResolvedValueOnce({ data: { orderCode: "KP-1", status: "PAID" } });

    await expect(paymentService.paymentHistory()).resolves.toEqual([
      { orderCode: "KP-1", status: "PENDING" },
    ]);
    await expect(paymentService.paymentReceipt("KP 1")).resolves.toEqual({
      orderCode: "KP-1",
      status: "PAID",
    });

    expect(api.get).toHaveBeenNthCalledWith(1, "/v1/me/payments");
    expect(api.get).toHaveBeenNthCalledWith(2, "/v1/me/payments/KP%201/receipt");
  });

  it("keeps pending and review states pollable while terminal failures stop polling", () => {
    expect(isTerminalStatus("PENDING")).toBe(false);
    expect(isTerminalStatus("PAID_PENDING_REVIEW")).toBe(false);
    expect(isTerminalStatus("CHECKOUT_CREATED")).toBe(false);
    expect(isTerminalStatus("PAID")).toBe(true);
    expect(isTerminalStatus("FAILED")).toBe(true);
    expect(statusMessage("CREATED")).toMatch(/created/i);
    expect(statusMessage("CONFIRMED")).toMatch(/confirmed/i);
  });
});

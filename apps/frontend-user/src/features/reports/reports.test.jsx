import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useReports } from "./hooks/useReports";

vi.mock("./api/reportsApi", () => ({
  reportsApi: {
    getReport: vi.fn().mockResolvedValue({
      summary: { total: 100, successCount: 80, pendingCount: 15, failedCount: 5 },
      columns: [{ key: "name", title: "Name" }],
      rows: [{ id: "1", name: "Guest 1" }],
    }),
    exportCsv: vi.fn().mockResolvedValue({}),
  },
}));

describe("useReports", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads report data on mount with default type", async () => {
    const { result } = renderHook(() => useReports("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.reportType).toBe("GUEST");
    expect(result.current.reportData?.summary?.total).toBe(100);
    expect(result.current.error).toBe("");
  });

  it("provides exportCsv action", async () => {
    const { result } = renderHook(() => useReports("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.exportCsv).toBe("function");
  });
});

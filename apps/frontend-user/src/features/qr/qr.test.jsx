import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useQrCode } from "./hooks/useQrCode";

vi.mock("./api/qrApi", () => ({
  qrApi: {
    getInvitationQr: vi.fn().mockResolvedValue({
      title: "Wedding of Sok & Dara",
      qrImageUrl: "https://cdn.test/qr.png",
      invitationUrl: "https://invitation.test/sok-dara",
    }),
    getGuestQr: vi.fn().mockResolvedValue({
      guestName: "John Doe",
      qrImageUrl: "https://cdn.test/guest-qr.png",
    }),
    downloadQrPng: vi.fn().mockResolvedValue({}),
  },
}));

describe("useQrCode", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads invitation QR data on mount", async () => {
    const { result } = renderHook(() => useQrCode("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.qrData).toEqual(
      expect.objectContaining({ title: "Wedding of Sok & Dara" })
    );
    expect(result.current.error).toBe("");
  });

  it("loads guest QR data when guestId is passed", async () => {
    const { result } = renderHook(() => useQrCode("101", "guest-5"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.qrData).toEqual(
      expect.objectContaining({ guestName: "John Doe" })
    );
  });

  it("provides downloadPng action", async () => {
    const { result } = renderHook(() => useQrCode("101"));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.downloadPng).toBe("function");
  });
});

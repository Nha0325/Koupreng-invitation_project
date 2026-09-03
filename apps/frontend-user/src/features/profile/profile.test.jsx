import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProfile } from "./hooks/useProfile";

vi.mock("./api/profileApi", () => ({
  profileApi: {
    get: vi.fn().mockResolvedValue({ name: "Nha", email: "nha@test.com", phone: "+855123" }),
    update: vi.fn().mockResolvedValue({ name: "Updated", email: "nha@test.com", phone: "+855123" }),
    uploadAvatar: vi.fn().mockResolvedValue({ avatarUrl: "https://cdn.test/avatar.jpg" }),
    removeAvatar: vi.fn().mockResolvedValue({}),
  },
}));

describe("useProfile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads profile on mount", async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.profile).toEqual(
      expect.objectContaining({ name: "Nha", email: "nha@test.com" })
    );
    expect(result.current.error).toBe("");
  });

  it("exposes updateProfile function", async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.updateProfile).toBe("function");
  });

  it("exposes uploadAvatar function", async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.uploadAvatar).toBe("function");
  });

  it("exposes removeAvatar function", async () => {
    const { result } = renderHook(() => useProfile());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(typeof result.current.removeAvatar).toBe("function");
  });
});

import { act, renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useGuests } from "./hooks/useGuests";
import { useGuestMutations } from "./hooks/useGuestMutations";

const invitationService = vi.hoisted(() => ({ listMine: vi.fn() }));
const guestService = vi.hoisted(() => ({
  listByInvitation: vi.fn(),
  importForInvitation: vi.fn(),
}));
const rsvpService = vi.hoisted(() => ({ listByInvitation: vi.fn() }));
const planningStorage = vi.hoisted(() => ({
  getActiveEventId: vi.fn(() => "draft-1"),
  listManualGuests: vi.fn(() => [{ id: "local-1", name: "Local only", count: 1 }]),
  saveManualGuests: vi.fn(),
}));

vi.mock("@/features/invitations/api/invitationApi", () => ({ invitationService }));
vi.mock("@/features/guests/api/guestApi", () => ({ guestService }));
vi.mock("@/features/rsvp/api/rsvpApi", () => ({ rsvpService }));
vi.mock("@/shared/storage/weddingStorage", () => ({
  listDrafts: () => [{ id: "draft-1", backendInvitationId: 42, slug: "our-day" }],
}));
vi.mock("@/shared/storage/hostPlanningStorage", () => ({
  ...planningStorage,
  createHostRecordId: () => "manual-new",
}));

function routeWrapper(path = "/dashboard/invitations/42/guests") {
  return function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/dashboard/invitations/:invitationId/guests" element={children} />
        </Routes>
      </MemoryRouter>
    );
  };
}

describe("guest state authority", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    planningStorage.getActiveEventId.mockReturnValue("draft-1");
    planningStorage.listManualGuests.mockReturnValue([{ id: "local-1", name: "Local only", count: 1 }]);
    invitationService.listMine.mockResolvedValue([{ id: 42, slug: "our-day", status: "PUBLISHED" }]);
    guestService.listByInvitation.mockResolvedValue([{ id: 7, guestName: "Server guest", seatCount: 2 }]);
    rsvpService.listByInvitation.mockResolvedValue([
      { id: 9, guestId: 7, guestName: "Server guest", responseStatus: "ATTENDING", attendeeCount: 2 },
    ]);
  });

  it("uses the route invitation and excludes browser-only guest records", async () => {
    const { result } = renderHook(() => useGuests(), { wrapper: routeWrapper() });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(invitationService.listMine).toHaveBeenCalledTimes(1);
    expect(guestService.listByInvitation).toHaveBeenCalledWith(42);
    expect(result.current.guests).toEqual([
      expect.objectContaining({ id: 7, name: "Server guest", source: "backend", rsvpStatus: "ATTENDING" }),
    ]);
    expect(result.current.guests.some((guest) => guest.id === "local-1")).toBe(false);
  });

  it("does not fall back to another invitation when the route is outside the user's list", async () => {
    const { result } = renderHook(() => useGuests(), {
      wrapper: routeWrapper("/dashboard/invitations/99/guests"),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(guestService.listByInvitation).not.toHaveBeenCalled();
    expect(result.current.guests).toEqual([]);
    expect(result.current.error).toMatch(/not found|permission/i);
  });

  it("does not persist a server-backed import locally when the API fails", async () => {
    guestService.importForInvitation.mockRejectedValueOnce(new Error("Import rejected"));
    const setManualGuests = vi.fn();
    const refreshData = vi.fn();
    const { result } = renderHook(
      () =>
        useGuestMutations({
          eventId: "draft-1",
          backendInvitation: { id: 42 },
          setManualGuests,
          backendGuests: [],
          setBackendGuests: vi.fn(),
          refreshData,
        }),
      { wrapper: routeWrapper() }
    );

    let success;
    await act(async () => {
      success = await result.current.importGuests([{ name: "Not persisted", count: 1 }]);
    });

    expect(success).toBe(false);
    expect(setManualGuests).not.toHaveBeenCalled();
    expect(planningStorage.saveManualGuests).not.toHaveBeenCalled();
    expect(refreshData).not.toHaveBeenCalled();
    expect(result.current.error).toBe("Import rejected");
  });
});

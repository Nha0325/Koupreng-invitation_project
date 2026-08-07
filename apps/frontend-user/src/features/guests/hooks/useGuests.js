import { useCallback, useEffect, useMemo, useState } from "react";
import { guestService } from "@/features/guests/api/guestApi";
import { invitationService } from "@/features/invitations/api/invitationApi";
import { rsvpService } from "@/features/rsvp/api/rsvpApi";
import { listDrafts } from "@/shared/storage/weddingStorage";
import { getActiveEventId, listManualGuests } from "@/shared/storage/hostPlanningStorage";
import {
  normalizeBackendGuest,
  normalizeBackendRsvp,
  normalizeManualGuest,
} from "../model/guestMappers";

function invitationId(invitation) {
  return invitation?.id || invitation?.invitationId;
}

function pickBackendInvitation(invitations, draft) {
  if (!invitations?.length) return null;

  const draftId = draft?.backendInvitationId || draft?.invitationId || draft?.id;
  return (
    invitations.find((invitation) => String(invitationId(invitation)) === String(draftId)) ||
    invitations.find((invitation) => invitation.slug && invitation.slug === draft?.slug) ||
    invitations.find((invitation) => invitation.status === "PUBLISHED") ||
    invitations.find((invitation) => invitationId(invitation)) ||
    null
  );
}

function pickPublicInvitation(invitations, draft) {
  const published = (invitations || []).filter(
    (invitation) => invitation?.status === "PUBLISHED" && invitation?.slug
  );

  if (!published.length) return null;

  const draftId = draft?.backendInvitationId || draft?.invitationId || draft?.id;
  return (
    published.find((invitation) => String(invitationId(invitation)) === String(draftId)) ||
    published.find((invitation) => invitation.slug === draft?.slug) ||
    published[0]
  );
}

export function useGuests() {
  const drafts = useMemo(() => listDrafts(), []);
  const activeEventId = getActiveEventId();
  const currentDraft =
    drafts.find((draft) => draft.id === activeEventId) || drafts[0] || null;
  const eventId = currentDraft?.id || activeEventId || "";
  const backendDraftInvitationId = currentDraft?.backendInvitationId || currentDraft?.id || "";

  const draftMatch = useMemo(
    () => (currentDraft ? { ...currentDraft, id: eventId, backendInvitationId: backendDraftInvitationId } : null),
    [backendDraftInvitationId, currentDraft, eventId]
  );

  const [manualGuests, setManualGuests] = useState(() =>
    listManualGuests(eventId).map(normalizeManualGuest)
  );
  const [backendGuests, setBackendGuests] = useState([]);
  const [rsvpGuests, setRsvpGuests] = useState([]);
  const [publicInvitation, setPublicInvitation] = useState(null);
  const [backendInvitation, setBackendInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const myInvitations = await invitationService.listMy().catch(() => []);
      const matchedBackend = pickBackendInvitation(myInvitations, draftMatch);
      const matchedPublic = pickPublicInvitation(myInvitations, draftMatch);

      setBackendInvitation(matchedBackend);
      setPublicInvitation(matchedPublic);

      let fetchedBackendGuests = [];
      const backendIdToUse = matchedBackend ? invitationId(matchedBackend) : null;

      if (backendIdToUse) {
        try {
          const rawGuests = await guestService.listByInvitation(backendIdToUse);
          fetchedBackendGuests = (rawGuests || []).map(normalizeBackendGuest);
        } catch (err) {
          setError(err?.message || "Could not fetch backend guest records");
        }
      }

      setBackendGuests(fetchedBackendGuests);

      const slugToUse = matchedPublic?.slug || draftMatch?.slug;
      if (slugToUse) {
        try {
          const rawWishes = await rsvpService.listWishes(slugToUse);
          setRsvpGuests((rawWishes || []).map(normalizeBackendRsvp));
        } catch {
          setRsvpGuests([]);
        }
      } else {
        setRsvpGuests([]);
      }
    } catch (err) {
      setError(err?.message || "Failed to load guest data");
    } finally {
      setLoading(false);
    }
  }, [draftMatch]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const allGuests = useMemo(() => {
    const combined = [...backendGuests];
    const backendIds = new Set(backendGuests.map((item) => String(item.id)));
    const backendNames = new Set(
      backendGuests.map((item) => (item.name || "").trim().toLowerCase()).filter(Boolean)
    );

    for (const manual of manualGuests) {
      const manualName = (manual.name || "").trim().toLowerCase();
      if (!backendIds.has(String(manual.id)) && (!manualName || !backendNames.has(manualName))) {
        combined.push(manual);
      }
    }

    const combinedNames = new Set(
      combined.map((item) => (item.name || "").trim().toLowerCase()).filter(Boolean)
    );

    for (const rsvp of rsvpGuests) {
      const rsvpName = (rsvp.name || "").trim().toLowerCase();
      if (rsvpName && !combinedNames.has(rsvpName)) {
        combined.push(rsvp);
      }
    }

    return combined;
  }, [backendGuests, manualGuests, rsvpGuests]);

  return {
    eventId,
    draftMatch,
    backendInvitation,
    publicInvitation,
    guests: allGuests,
    manualGuests,
    setManualGuests,
    backendGuests,
    setBackendGuests,
    loading,
    error,
    refreshData,
  };
}

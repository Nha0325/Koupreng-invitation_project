import { useState } from "react";
import { guestService } from "@/features/guests/api/guestApi";
import { saveManualGuests } from "@/shared/storage/hostPlanningStorage";
import {
  normalizeBackendGuest,
  normalizeManualGuest,
  toBackendGuestPayload,
  toManualGuest,
} from "../model/guestMappers";

function invitationId(invitation) {
  return invitation?.id || invitation?.invitationId;
}

export function useGuestMutations({
  eventId,
  backendInvitation,
  setManualGuests,
  backendGuests,
  setBackendGuests,
  refreshData,
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const saveGuest = async (form, editingId) => {
    setSaving(true);
    setError("");

    try {
      const backendIdToUse = backendInvitation ? invitationId(backendInvitation) : null;
      const targetBackendGuest = editingId
        ? backendGuests.find((item) => String(item.id) === String(editingId))
        : null;

      if (backendIdToUse && (targetBackendGuest || !editingId)) {
        const payload = toBackendGuestPayload(form);
        let savedBackend;

        if (targetBackendGuest) {
          savedBackend = await guestService.updateForInvitation(
            backendIdToUse,
            targetBackendGuest.backendId || targetBackendGuest.id,
            payload
          );
        } else {
          savedBackend = await guestService.createForInvitation(backendIdToUse, payload);
        }

        const normalized = normalizeBackendGuest(savedBackend);

        setBackendGuests((current) => {
          const index = current.findIndex((item) => String(item.id) === String(normalized.id));
          if (index >= 0) {
            const next = [...current];
            next[index] = normalized;
            return next;
          }
          return [...current, normalized];
        });

        if (editingId) {
          setManualGuests((current) => {
            const next = current.filter((item) => String(item.id) !== String(editingId));
            saveManualGuests(eventId, next);
            return next;
          });
        }
      } else {
        const guestToSave = toManualGuest(form, editingId);
        setManualGuests((current) => {
          const next = editingId
            ? current.map((item) => (item.id === editingId ? guestToSave : item))
            : [...current, guestToSave];
          saveManualGuests(eventId, next);
          return next;
        });
      }

      await refreshData();
      return true;
    } catch (err) {
      setError(err?.message || "Could not save guest record");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const deleteGuest = async (guestToDelete) => {
    if (!guestToDelete) return false;
    setSaving(true);
    setError("");

    try {
      const backendIdToUse = backendInvitation ? invitationId(backendInvitation) : null;

      if (
        backendIdToUse &&
        guestToDelete.source === "backend" &&
        (guestToDelete.backendId || guestToDelete.id)
      ) {
        await guestService.removeFromInvitation(
          backendIdToUse,
          guestToDelete.backendId || guestToDelete.id
        );
        setBackendGuests((current) =>
          current.filter((item) => String(item.id) !== String(guestToDelete.id))
        );
      } else {
        setManualGuests((current) => {
          const next = current.filter((item) => String(item.id) !== String(guestToDelete.id));
          saveManualGuests(eventId, next);
          return next;
        });
      }

      await refreshData();
      return true;
    } catch (err) {
      setError(err?.message || "Could not remove guest");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const importGuests = async (importedList) => {
    setSaving(true);
    setError("");

    try {
      const normalizedNew = importedList.map(normalizeManualGuest);
      setManualGuests((current) => {
        const next = [...current, ...normalizedNew];
        saveManualGuests(eventId, next);
        return next;
      });

      const backendIdToUse = backendInvitation ? invitationId(backendInvitation) : null;
      if (backendIdToUse) {
        const payloadList = importedList.map(toBackendGuestPayload);
        await guestService.importForInvitation(backendIdToUse, payloadList).catch(() => {});
      }

      await refreshData();
      return true;
    } catch (err) {
      setError(err?.message || "Could not import guests");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    saving,
    error,
    setError,
    saveGuest,
    deleteGuest,
    importGuests,
  };
}

import { useState, useEffect, useCallback } from "react";
import { listDrafts, deleteDraft } from "../../../shared/storage/weddingStorage";
import { eventsApi } from "../api/eventsApi";
import { toast } from "../../../shared/ui/toast";

export function useEvents(t) {
    const [drafts, setDrafts] = useState(listDrafts());
    const [draftToDelete, setDraftToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadDrafts = useCallback(() => {
        eventsApi.listMine().then((apiInvs) => {
            const localDrafts = listDrafts();
            const merged = [...(apiInvs || [])];
            localDrafts.forEach((ld) => {
                if (!merged.some((m) => String(m.id) === String(ld.id) || String(m.id) === String(ld.backendInvitationId))) {
                    merged.push(ld);
                }
            });
            if (merged.length > 0) {
                setDrafts(merged);
            }
        }).catch(() => {
            // Keep local drafts
        });
    }, []);

    useEffect(() => {
        loadDrafts();
    }, [loadDrafts]);

    const handleDeleteClick = (draft) => {
        setDraftToDelete(draft);
    };

    const cancelDelete = () => {
        setDraftToDelete(null);
    };

    const confirmDelete = async () => {
        if (!draftToDelete) return;
        setIsDeleting(true);

        try {
            const backendId = draftToDelete.backendInvitationId || draftToDelete.id;
            if (backendId) {
                await eventsApi.remove(backendId).catch((err) => {
                    console.warn("Failed to delete from API", err);
                });
            }
        } catch (e) {
            console.warn("Ignored local draft deletion error", e);
        }

        deleteDraft(draftToDelete.id);
        localStorage.removeItem(`koupreng.host.manualGuests.${draftToDelete.id}`);
        localStorage.removeItem(`koupreng.host.guestGroups.${draftToDelete.id}`);
        localStorage.removeItem(`koupreng.host.guestCategories.${draftToDelete.id}`);
        localStorage.removeItem(`koupreng.host.expenses.${draftToDelete.id}`);
        localStorage.removeItem(`koupreng.host.gifts.${draftToDelete.id}`);

        setDrafts(listDrafts());
        setDraftToDelete(null);
        setIsDeleting(false);
        toast(t ? t("deletedSuccess") || "បានលុបកម្មវិធីជោគជ័យ" : "បានលុបកម្មវិធីជោគជ័យ");
    };

    return {
        drafts,
        draftToDelete,
        isDeleting,
        handleDeleteClick,
        cancelDelete,
        confirmDelete,
    };
}

export default useEvents;

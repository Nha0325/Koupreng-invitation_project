import { useCallback, useEffect, useState } from "react";
import { wishesApi } from "../api/wishesApi";

export function useWishes(invitationId) {
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const loadWishes = useCallback(() => {
    if (!invitationId) return;
    setLoading(true);
    setError("");
    wishesApi
      .listByInvitation(invitationId)
      .then((items) => {
        setWishes(items || []);
      })
      .catch((err) => {
        setError(err?.message || "Could not load wishes");
      })
      .finally(() => setLoading(false));
  }, [invitationId]);

  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  const deleteWish = async (wishId) => {
    setDeletingId(wishId);
    try {
      await wishesApi.deleteWish(invitationId, wishId);
      setWishes((prev) => prev.filter((w) => w.id !== wishId));
    } catch (err) {
      setError(err?.message || "Could not delete wish");
    } finally {
      setDeletingId(null);
    }
  };

  return { wishes, loading, error, deletingId, loadWishes, deleteWish };
}

export default useWishes;

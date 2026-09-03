import { useCallback, useEffect, useState } from "react";
import { deliveryApi } from "../api/deliveryApi";

export function useDelivery(invitationId) {
  const [deliveries, setDeliveries] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendingId, setSendingId] = useState(null);
  const [batchSending, setBatchSending] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(() => {
    if (!invitationId) return;
    setLoading(true);
    setError("");

    Promise.all([deliveryApi.list(invitationId), deliveryApi.summary(invitationId)])
      .then(([listData, summaryData]) => {
        setDeliveries(listData || []);
        setSummary(summaryData || null);
      })
      .catch((err) => {
        setError(err?.message || "Could not load delivery data");
      })
      .finally(() => setLoading(false));
  }, [invitationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const sendToGuest = async (guestId, channel = "TELEGRAM") => {
    setSendingId(guestId);
    try {
      await deliveryApi.sendInvitation(invitationId, guestId, channel);
      loadData();
    } catch (err) {
      setError(err?.message || "Failed to send invitation");
    } finally {
      setSendingId(null);
    }
  };

  const sendBatch = async (channel = "TELEGRAM") => {
    setBatchSending(true);
    try {
      await deliveryApi.sendBatch(invitationId, channel);
      loadData();
    } catch (err) {
      setError(err?.message || "Failed to send batch invitations");
    } finally {
      setBatchSending(false);
    }
  };

  return {
    deliveries,
    summary,
    loading,
    sendingId,
    batchSending,
    error,
    loadData,
    sendToGuest,
    sendBatch,
  };
}

export default useDelivery;

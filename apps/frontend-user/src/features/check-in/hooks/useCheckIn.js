import { useCallback, useEffect, useState } from "react";
import { checkInApi } from "../api/checkInApi";

export function useCheckIn(invitationId) {
  const [summary, setSummary] = useState(null);
  const [checkIns, setCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [lastScanned, setLastScanned] = useState(null);

  const loadData = useCallback(() => {
    if (!invitationId) return;
    setLoading(true);
    setError("");

    Promise.all([checkInApi.getSummary(invitationId), checkInApi.getList(invitationId)])
      .then(([summaryData, listData]) => {
        setSummary(summaryData || null);
        setCheckIns(listData || []);
      })
      .catch((err) => {
        setError(err?.message || "Could not load check-in data");
      })
      .finally(() => setLoading(false));
  }, [invitationId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const scanQrCode = async (qrToken) => {
    setScanning(true);
    setError("");
    try {
      const result = await checkInApi.scanQr(invitationId, qrToken);
      setLastScanned(result);
      loadData();
      return result;
    } catch (err) {
      setError(err?.message || "QR scan check-in failed");
      throw err;
    } finally {
      setScanning(false);
    }
  };

  const manualCheckIn = async (guestId) => {
    try {
      const result = await checkInApi.manualCheckIn(invitationId, guestId);
      loadData();
      return result;
    } catch (err) {
      setError(err?.message || "Manual check-in failed");
      throw err;
    }
  };

  const undoCheckIn = async (guestId) => {
    try {
      await checkInApi.undoCheckIn(invitationId, guestId);
      loadData();
    } catch (err) {
      setError(err?.message || "Undo check-in failed");
      throw err;
    }
  };

  return {
    summary,
    checkIns,
    loading,
    scanning,
    error,
    lastScanned,
    loadData,
    scanQrCode,
    manualCheckIn,
    undoCheckIn,
  };
}

export default useCheckIn;

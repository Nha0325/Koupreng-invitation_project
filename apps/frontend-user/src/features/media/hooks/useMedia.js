import { useCallback, useEffect, useState } from "react";
import { mediaApi } from "../api/mediaApi";

export function useMedia(invitationId) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const loadFiles = useCallback(() => {
    if (!invitationId) return;
    setLoading(true);
    setError("");
    mediaApi
      .list(invitationId)
      .then((items) => {
        setFiles(items || []);
      })
      .catch((err) => {
        setError(err?.message || "Could not load media");
      })
      .finally(() => setLoading(false));
  }, [invitationId]);

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const uploadFile = async (file) => {
    setUploading(true);
    setProgress(0);
    try {
      const onProg = (e) => {
        if (e.total) setProgress(Math.round((e.loaded / e.total) * 100));
      };
      const created = await mediaApi.upload(invitationId, file, onProg);
      setFiles((prev) => [...prev, created]);
      return created;
    } catch (err) {
      setError(err?.message || "Upload failed");
      throw err;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const deleteFile = async (mediaId) => {
    try {
      await mediaApi.delete(invitationId, mediaId);
      setFiles((prev) => prev.filter((f) => f.id !== mediaId));
    } catch (err) {
      setError(err?.message || "Delete failed");
    }
  };

  return { files, loading, uploading, progress, error, loadFiles, uploadFile, deleteFile };
}

export default useMedia;

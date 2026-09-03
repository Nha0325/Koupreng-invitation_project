import { useCallback, useEffect, useState } from "react";
import { profileApi } from "../api/profileApi";

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProfile = useCallback(() => {
    setLoading(true);
    setError("");
    profileApi
      .get()
      .then((data) => {
        setProfile(data);
        setError("");
      })
      .catch((err) => {
        setError(err?.message || "Could not load profile");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = async (data) => {
    setSaving(true);
    setError("");
    try {
      const updated = await profileApi.update(data);
      setProfile(updated);
      return updated;
    } catch (err) {
      setError(err?.message || "Could not update profile");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file) => {
    setSaving(true);
    setError("");
    try {
      const updated = await profileApi.uploadAvatar(file);
      setProfile((prev) => ({ ...prev, ...updated }));
      return updated;
    } catch (err) {
      setError(err?.message || "Could not upload avatar");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const removeAvatar = async () => {
    setSaving(true);
    setError("");
    try {
      await profileApi.removeAvatar();
      setProfile((prev) => ({ ...prev, avatarUrl: null }));
    } catch (err) {
      setError(err?.message || "Could not remove avatar");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    loading,
    saving,
    error,
    loadProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  };
}

export default useProfile;

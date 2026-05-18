import { useState } from "react";
import { useAuth } from "../../app/auth/useAuth";
import userService from "../../shared/services/userService";

function apiMessage(error, fallback) {
  return error?.response?.data?.message || error?.message || fallback;
}

const SettingsPage = () => {
  const { user, refresh } = useAuth();
  const [draftFullName, setDraftFullName] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileStatus, setProfileStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [error, setError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const fullName = draftFullName ?? user?.fullName ?? "";

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    if (!fullName.trim()) {
      setError("ឈ្មោះមិនអាចទទេបានទេ");
      return;
    }

    setError("");
    setProfileStatus("");
    setSavingProfile(true);
    try {
      await userService.updateMe({ fullName: fullName.trim() });
      await refresh();
      setDraftFullName(null);
      setProfileStatus("Profile updated.");
    } catch (err) {
      setError(apiMessage(err, "Could not update profile."));
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (newPassword.length < 8) {
      setError("លេខសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ ៨ តួ");
      return;
    }

    setError("");
    setPasswordStatus("");
    setSavingPassword(true);
    try {
      await userService.changePassword({
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setPasswordStatus("Password changed.");
    } catch (err) {
      setError(apiMessage(err, "Could not change password."));
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="dash-main" style={{ display: "grid", gap: "24px" }}>
      <div>
        <h1 className="text-[19px] font-bold text-slate-800">ការកំណត់</h1>
        <p className="text-sm text-[#7a8799]">
          គ្រប់គ្រងគណនី និងចំណូលចិត្តរបស់អ្នក
        </p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section style={{ display: "grid", gap: "12px", maxWidth: "460px" }}>
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            ព័ត៌មានគណនី
          </h2>
          <p className="text-sm text-[#7a8799]">{user?.email}</p>
        </div>

        <form onSubmit={handleProfileSubmit} style={{ display: "grid", gap: "10px" }}>
          <label className="text-sm font-medium text-slate-700">
            ឈ្មោះ
            <input
              type="text"
              value={fullName}
              onChange={(event) => setDraftFullName(event.target.value)}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          {profileStatus && <p className="text-sm text-green-700">{profileStatus}</p>}
          <button
            type="submit"
            disabled={savingProfile}
            className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {savingProfile ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>

      <section style={{ display: "grid", gap: "12px", maxWidth: "460px" }}>
        <div>
          <h2 className="text-base font-semibold text-slate-800">
            ផ្លាស់ប្តូរលេខសម្ងាត់
          </h2>
        </div>

        <form onSubmit={handlePasswordSubmit} style={{ display: "grid", gap: "10px" }}>
          <label className="text-sm font-medium text-slate-700">
            លេខសម្ងាត់បច្ចុប្បន្ន
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          <label className="text-sm font-medium text-slate-700">
            លេខសម្ងាត់ថ្មី
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            />
          </label>
          {passwordStatus && <p className="text-sm text-green-700">{passwordStatus}</p>}
          <button
            type="submit"
            disabled={savingPassword}
            className="w-fit rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {savingPassword ? "Saving..." : "Change password"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default SettingsPage;

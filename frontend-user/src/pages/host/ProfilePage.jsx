import { useEffect, useState } from "react";
import { useAuth } from "../auth/context/useAuth";
import { useAuthStore } from "../../stores/useAuthStore";
import { userService } from "../../services/remote/userService";

/**
 * ProfilePage — edit user profile and change account password.
 * Maps to `users` table: full_name, email, phone, status.
 */
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const login = useAuthStore((s) => s.login);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");

  const hasProfile = Boolean(user?.fullName?.trim() || user?.full_name?.trim());

  useEffect(() => {
    let cancelled = false;
    userService
      .getProfile()
      .then((data) => {
        if (cancelled) return;
        setFullName(data?.fullName || data?.full_name || "");
        setPhone(data?.phone || "");
      })
      .catch(() => {
        if (cancelled) return;
        setFullName(user?.fullName || user?.full_name || user?.name || "");
        setPhone(user?.phone || "");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const profileData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
      };

      const updatedUser = await userService.updateProfile(profileData);
      const nextUser = {
        ...user,
        ...updatedUser,
        fullName: fullName.trim(),
        full_name: fullName.trim(),
        name: fullName.trim(),
        phone: phone.trim(),
        profileComplete: true,
      };

      login({ accessToken, user: nextUser });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "មានបញ្ហាក្នុងការរក្សាទុក។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setPwError("");
    setPwSaved(false);

    if (newPassword !== confirmPassword) {
      setPwError("ពាក្យសម្ងាត់ថ្មីមិនត្រូវគ្នា។ សូមពិនិត្យឡើងវិញ។");
      return;
    }
    if (newPassword.length < 8) {
      setPwError("ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងហោចណាស់ 8 តួអក្សរ។");
      return;
    }

    setPwSaving(true);
    try {
      await userService.changePassword(currentPassword, newPassword);
      setPwSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => logout(), 2000);
    } catch (err) {
      setPwError(err.message || "មានបញ្ហាក្នុងការផ្លាស់ប្តូរពាក្យសម្ងាត់។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setPwSaving(false);
    }
  };

  const displayInitial = fullName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "?";

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px", fontFamily: "'Kantumruy Pro', sans-serif", color: "#888" }}>
        កំពុងផ្ទុក...
      </div>
    );
  }

  return (
    <>
      <style>{`
        .profile-page {
          max-width: 520px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        .profile-page h1 {
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 24px;
          color: #333;
          margin-bottom: 8px;
        }
        .profile-page .subtitle {
          font-family: 'Kantumruy Pro', sans-serif;
          color: #888;
          font-size: 14px;
          margin-bottom: 32px;
        }
        .profile-avatar-section {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 32px;
        }
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #B0926A;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 32px;
          font-weight: bold;
          overflow: hidden;
          border: 3px solid rgba(176, 146, 106, 0.3);
          flex-shrink: 0;
        }
        .profile-info-text {
          font-family: 'Kantumruy Pro', sans-serif;
        }
        .profile-info-text strong {
          display: block;
          font-size: 16px;
          color: #333;
        }
        .profile-info-text span {
          color: #888;
          font-size: 13px;
        }
        .profile-form-group {
          margin-bottom: 20px;
        }
        .profile-form-group label {
          display: block;
          font-family: 'Kantumruy Pro', sans-serif;
          font-weight: 600;
          font-size: 14px;
          color: #555;
          margin-bottom: 8px;
        }
        .profile-form-group input {
          width: 100%;
          padding: 14px 16px;
          border: 1.5px solid rgba(176, 146, 106, 0.3);
          border-radius: 12px;
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 15px;
          background: #fff;
          transition: 0.2s;
          outline: none;
          box-sizing: border-box;
        }
        .profile-form-group input:focus {
          border-color: #B0926A;
          box-shadow: 0 0 0 3px rgba(176, 146, 106, 0.1);
        }
        .profile-form-group input:disabled {
          background: #f5f5f5;
          color: #999;
        }
        .profile-save-btn,
        .profile-pw-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          font-family: 'Kantumruy Pro', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: 0.2s;
        }
        .profile-save-btn {
          background: #B0926A;
          color: white;
          border: none;
          margin-top: 12px;
        }
        .profile-save-btn:hover {
          background: #9a7d5a;
        }
        .profile-pw-btn {
          background: transparent;
          color: #B0926A;
          border: 2px solid #B0926A;
          margin-top: 4px;
        }
        .profile-pw-btn:hover {
          background: #B0926A;
          color: #fff;
        }
        .profile-save-btn:disabled,
        .profile-pw-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .profile-msg {
          text-align: center;
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 14px;
          margin-top: 12px;
          animation: profileFadeIn 0.3s;
        }
        .profile-msg.success { color: #2e7d32; }
        .profile-msg.error { color: #c62828; }
        .profile-section-divider {
          border: none;
          border-top: 1px solid rgba(176, 146, 106, 0.2);
          margin: 36px 0 0;
        }
        .profile-pw-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          padding: 18px 0 0;
          cursor: pointer;
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: #333;
          text-align: left;
        }
        .profile-pw-toggle svg {
          transition: transform 0.25s;
          flex-shrink: 0;
        }
        .profile-pw-toggle.open svg {
          transform: rotate(180deg);
        }
        .profile-pw-section {
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.35s ease, opacity 0.3s ease;
          opacity: 0;
        }
        .profile-pw-section.open {
          max-height: 600px;
          opacity: 1;
        }
        .profile-pw-hint {
          font-family: 'Kantumruy Pro', sans-serif;
          font-size: 13px;
          color: #888;
          margin: 6px 0 20px;
        }
        @keyframes profileFadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="profile-page">
        <h1>{hasProfile ? "កែប្រែប្រវត្តិរូប" : "បង្កើតប្រវត្តិរូប"}</h1>
        <p className="subtitle">
          {hasProfile
            ? "កែប្រែព័ត៌មានផ្ទាល់ខ្លួនរបស់អ្នក"
            : "បំពេញព័ត៌មានផ្ទាល់ខ្លួនដើម្បីចាប់ផ្តើមប្រើប្រាស់"}
        </p>

        <div className="profile-avatar-section">
          <div className="profile-avatar">{displayInitial}</div>
          <div className="profile-info-text">
            <strong>{fullName || "អ្នកប្រើប្រាស់ថ្មី"}</strong>
            <span>{user?.email || ""}</span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="profile-form-group">
            <label>ឈ្មោះពេញ (full_name)</label>
            <input
              type="text"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="បញ្ចូលឈ្មោះពេញរបស់អ្នក"
              required
            />
          </div>

          <div className="profile-form-group">
            <label>អ៊ីមែល (email)</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              title="អ៊ីមែលមិនអាចផ្លាស់ប្តូរបានទេ"
            />
          </div>

          <div className="profile-form-group">
            <label>លេខទូរស័ព្ទ (phone)</label>
            <input
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="012 345 678"
            />
          </div>

          <button type="submit" className="profile-save-btn" disabled={saving || !fullName.trim()}>
            {saving ? "កំពុងរក្សាទុក..." : hasProfile ? "រក្សាទុកការកែប្រែ" : "បង្កើតប្រវត្តិរូប"}
          </button>

          {saved && <p className="profile-msg success">រក្សាទុកដោយជោគជ័យ!</p>}
          {error && <p className="profile-msg error">{error}</p>}
        </form>

        <hr className="profile-section-divider" />

        <button
          type="button"
          className={`profile-pw-toggle${showPasswordSection ? " open" : ""}`}
          onClick={() => setShowPasswordSection((value) => !value)}
          aria-expanded={showPasswordSection}
        >
          <span>ផ្លាស់ប្តូរពាក្យសម្ងាត់</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B0926A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div className={`profile-pw-section${showPasswordSection ? " open" : ""}`}>
          <p className="profile-pw-hint">
            បន្ទាប់ពីផ្លាស់ប្តូរជោគជ័យ អ្នកនឹងត្រូវចូលក្នុងគណនីម្តងទៀត។
          </p>

          <form onSubmit={handleChangePassword}>
            <div className="profile-form-group">
              <label>ពាក្យសម្ងាត់បច្ចុប្បន្ន</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="profile-form-group">
              <label>ពាក្យសម្ងាត់ថ្មី (យ៉ាងហោចណាស់ 8 តួ)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="profile-form-group">
              <label>បញ្ជាក់ពាក្យសម្ងាត់ថ្មី</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="profile-pw-btn"
              disabled={pwSaving || !currentPassword || !newPassword || !confirmPassword}
            >
              {pwSaving ? "កំពុងផ្លាស់ប្តូរ..." : "ផ្លាស់ប្តូរពាក្យសម្ងាត់"}
            </button>

            {pwSaved && <p className="profile-msg success">ផ្លាស់ប្តូរដោយជោគជ័យ! កំពុងចេញពីគណនី...</p>}
            {pwError && <p className="profile-msg error">{pwError}</p>}
          </form>
        </div>
      </div>
    </>
  );
}

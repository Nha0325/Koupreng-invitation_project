import { useState, useEffect } from "react";
import { useAuth } from "../auth/context/useAuth";
import { useAuthStore } from "../../stores/useAuthStore";
import { userService } from "../../services/remote/userService";

/**
 * ProfilePage — create or edit user profile.
 * Maps to `users` table: full_name, email, phone, profile_image, status.
 */
export default function ProfilePage() {
  const { user } = useAuth();
  const login = useAuthStore((s) => s.login);
  const accessToken = useAuthStore((s) => s.accessToken);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const hasProfile = Boolean(user?.fullName?.trim() || user?.full_name?.trim());

  // Load profile from API
  useEffect(() => {
    async function fetchProfile() {
      try {
        const data = await userService.getProfile();
        setFullName(data.fullName || data.full_name || "");
        setPhone(data.phone || "");
        setProfileImage(data.profileImage || data.profile_image || "");
      } catch {
        // If API fails, use local user data
        setFullName(user?.fullName || user?.full_name || user?.name || "");
        setPhone(user?.phone || "");
        setProfileImage(user?.profileImage || user?.profile_image || "");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      // Upload image first if selected
      let imageUrl = profileImage;
      if (imageFile) {
        const uploadRes = await userService.uploadProfileImage(imageFile);
        imageUrl = uploadRes.url || uploadRes.profileImage || uploadRes.profile_image || imageUrl;
      }

      // Update profile
      const profileData = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        profileImage: imageUrl,
      };

      const updatedUser = await userService.updateProfile(profileData);

      // Update local auth store
      login({
        accessToken,
        user: {
          ...user,
          fullName: fullName.trim(),
          full_name: fullName.trim(),
          name: fullName.trim(),
          phone: phone.trim(),
          profileImage: imageUrl,
          profile_image: imageUrl,
          profileComplete: true,
          ...updatedUser,
        },
      });

      setProfileImage(imageUrl);
      setImageFile(null);
      setImagePreview("");
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.message || "មានបញ្ហាក្នុងការរក្សាទុក។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setSaving(false);
    }
  };

  const displayImage = imagePreview || profileImage;
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
          position: relative;
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
          cursor: pointer;
          flex-shrink: 0;
        }
        .profile-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .profile-avatar-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.5);
          color: white;
          font-size: 10px;
          text-align: center;
          padding: 4px 0;
          font-family: 'Kantumruy Pro', sans-serif;
        }
        .profile-avatar input[type="file"] {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
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
        .profile-save-btn {
          width: 100%;
          padding: 16px;
          background: #B0926A;
          color: white;
          border: none;
          border-radius: 12px;
          font-family: 'Kantumruy Pro', sans-serif;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: 0.2s;
          margin-top: 12px;
        }
        .profile-save-btn:hover {
          background: #9a7d5a;
        }
        .profile-save-btn:disabled {
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
          <div className="profile-avatar">
            {displayImage ? (
              <img src={displayImage} alt="Profile" />
            ) : (
              displayInitial
            )}
            <div className="profile-avatar-overlay">ប្តូររូប</div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              title="ជ្រើសរើសរូបភាព"
            />
          </div>
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
              onChange={(e) => setFullName(e.target.value)}
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
              onChange={(e) => setPhone(e.target.value)}
              placeholder="012 345 678"
            />
          </div>

          <button
            type="submit"
            className="profile-save-btn"
            disabled={saving || !fullName.trim()}
          >
            {saving
              ? "កំពុងរក្សាទុក..."
              : hasProfile
                ? "រក្សាទុកការកែប្រែ"
                : "បង្កើតប្រវត្តិរូប"}
          </button>

          {saved && (
            <p className="profile-msg success">✓ រក្សាទុកដោយជោគជ័យ!</p>
          )}
          {error && (
            <p className="profile-msg error">{error}</p>
          )}
        </form>
      </div>
    </>
  );
}

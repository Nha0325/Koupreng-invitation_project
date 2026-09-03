import { useProfile } from "./hooks/useProfile";
import { ProfileForm } from "./components/ProfileForm";
import { AvatarUpload } from "./components/AvatarUpload";
import { ErrorState, SkeletonCard } from "@/shared/ui";
import "./ProfilePage.css";

export default function ProfilePage() {
  const {
    profile,
    loading,
    saving,
    error,
    loadProfile,
    updateProfile,
    uploadAvatar,
    removeAvatar,
  } = useProfile();

  return (
    <main className="dash-main profile-page">
      <header className="dash-page-header profile-header">
        <div>
          <span className="dash-kicker">Profile</span>
          <h1>គណនីរបស់ខ្ញុំ</h1>
          <p>គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងរូបថតប org ង org ផ org ។</p>
        </div>
      </header>

      {error ? (
        <ErrorState message={error} onRetry={loadProfile} />
      ) : loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <SkeletonCard height="200px" />
          <SkeletonCard height="300px" />
        </div>
      ) : (
        <div className="profile-content">
          <section className="profile-card">
            <h2>រូបថតប org ង org ផ org</h2>
            <AvatarUpload
              avatarUrl={profile?.avatarUrl}
              saving={saving}
              onUpload={uploadAvatar}
              onRemove={removeAvatar}
            />
          </section>

          <section className="profile-card">
            <h2>ព org ត org មorg នផorg លorg ខorg ន</h2>
            <ProfileForm
              profile={profile}
              saving={saving}
              onSave={updateProfile}
            />
          </section>
        </div>
      )}
    </main>
  );
}

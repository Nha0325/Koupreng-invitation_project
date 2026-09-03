import { useState } from "react";
import { LoadingButton } from "@/shared/ui";

export function ProfileForm({ profile, saving, onSave }) {
  const [form, setForm] = useState({
    name: profile?.name || "",
    email: profile?.email || "",
    phone: profile?.phone || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave?.(form);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-field">
        <label htmlFor="profile-name">ឈ្មោះ</label>
        <input
          id="profile-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Your full name"
        />
      </div>

      <div className="profile-field">
        <label htmlFor="profile-email">អ៊ីមែល</label>
        <input
          id="profile-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="email@example.com"
          disabled
        />
      </div>

      <div className="profile-field">
        <label htmlFor="profile-phone">ទូរសព org (ជំរើស)</label>
        <input
          id="profile-phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+855 ..."
        />
      </div>

      <LoadingButton
        type="submit"
        className="dash-btn dash-btn-primary"
        isLoading={saving}
      >
        រក org សាទុក
      </LoadingButton>
    </form>
  );
}

export default ProfileForm;

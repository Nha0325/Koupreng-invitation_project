import { useRef } from "react";

export function AvatarUpload({ avatarUrl, saving, onUpload, onRemove }) {
  const inputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload?.(file);
  };

  return (
    <div className="avatar-section">
      <div className="avatar-preview">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile avatar" className="avatar-img" />
        ) : (
          <span className="avatar-placeholder">👤</span>
        )}
      </div>

      <div className="avatar-actions">
        <button
          type="button"
          className="dash-btn dash-btn-outline"
          disabled={saving}
          onClick={() => inputRef.current?.click()}
        >
          ផ្ទុករូបភាព
        </button>

        {avatarUrl && (
          <button
            type="button"
            className="dash-btn dash-btn-danger"
            disabled={saving}
            onClick={onRemove}
          >
            លុប
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}

export default AvatarUpload;

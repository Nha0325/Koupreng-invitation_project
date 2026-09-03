import { useRef } from "react";
import { LoadingButton } from "@/shared/ui";

export function MediaUploader({ uploading, progress, onUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
      e.target.value = "";
    }
  };

  return (
    <div className="media-uploader-box">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        style={{ display: "none" }}
      />
      <div className="media-uploader-content">
        <p className="media-uploader-title">ផ្ទុករូបភាព ឬ វីដេអូសម្រាប់លិខិតអញ្ជើញ</p>
        <p className="media-uploader-hint">គាំទ្រ PNG, JPG, MP4 (ទំហំអតិបរមា 25MB)</p>
        <LoadingButton
          type="button"
          className="dash-btn dash-btn-primary"
          isLoading={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? `កំពុងផ្ទុកឡើង ${progress}%...` : "ជ្រើសរើសឯកសារ"}
        </LoadingButton>
      </div>
    </div>
  );
}

export default MediaUploader;

export function MediaGallery({ files, onDelete }) {
  if (!files?.length) {
    return (
      <div className="media-empty">
        <p>មិនទាន់មានរូបភាព ឬវីដេអូត្រូវបានផ្ទុកឡើងនៅឡើយទេ។</p>
      </div>
    );
  }

  return (
    <div className="media-grid">
      {files.map((file) => (
        <div key={file.id} className="media-card">
          {file.mediaType === "VIDEO" ? (
            <video src={file.url} controls className="media-thumb" />
          ) : (
            <img src={file.url} alt={file.name || "Media"} className="media-thumb" />
          )}
          <div className="media-card-info">
            <span className="media-name" title={file.name}>{file.name || "File"}</span>
            {onDelete && (
              <button
                type="button"
                className="media-delete-btn"
                onClick={() => onDelete(file.id)}
                title="លុបឯកសារ"
              >
                លុប
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MediaGallery;

import { useParams } from "react-router-dom";
import { useMedia } from "./hooks/useMedia";
import { MediaGallery } from "./components/MediaGallery";
import { MediaUploader } from "./components/MediaUploader";
import { ErrorState, SkeletonCard } from "@/shared/ui";
import "./MediaPage.css";

export default function MediaPage({ invitationId: propInvitationId }) {
  const params = useParams();
  const invitationId = propInvitationId || params.invitationId || params.id;
  const { files, loading, uploading, progress, error, loadFiles, uploadFile, deleteFile } =
    useMedia(invitationId);

  return (
    <main className="dash-main media-page">
      <header className="dash-page-header media-header">
        <div>
          <span className="dash-kicker">Media Gallery</span>
          <h1>វិចិត្រសាលរូបភាព និងវីដេអូ</h1>
          <p>គ្រប់គ្រងរូបភាព វីដេអូ និងឯកសារមេឌៀទាំងអស់សម្រាប់លិខិតអញ្ជើញរបស់អ្នក។</p>
        </div>
      </header>

      <div className="media-page-layout">
        <MediaUploader
          uploading={uploading}
          progress={progress}
          onUpload={uploadFile}
        />

        {error ? (
          <ErrorState message={error} onRetry={loadFiles} />
        ) : loading ? (
          <div className="media-skeleton-grid">
            <SkeletonCard height="160px" />
            <SkeletonCard height="160px" />
            <SkeletonCard height="160px" />
          </div>
        ) : (
          <MediaGallery files={files} onDelete={deleteFile} />
        )}
      </div>
    </main>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mediaService } from "../../shared/services/mediaService";
import { toast } from "../../shared/ui/toast";
import "./InvitationPages.css";

const ACCEPT = {
    image: "image/jpeg,image/png,image/webp",
    video: "video/mp4,video/webm",
    audio: "audio/mpeg,audio/mp3,audio/wav,audio/ogg",
};

function MediaFileInput({ accept, multiple = false, disabled, onFiles, label }) {
    const inputRef = useRef(null);

    const handleChange = (event) => {
        const files = Array.from(event.target.files || []);
        if (files.length) {
            onFiles(multiple ? files : files[0]);
        }
        event.target.value = "";
    };

    return (
        <>
            <button type="button" className="inv-secondary-btn" disabled={disabled} onClick={() => inputRef.current?.click()}>
                {label}
            </button>
            <input
                ref={inputRef}
                className="media-hidden-input"
                type="file"
                accept={accept}
                multiple={multiple}
                onChange={handleChange}
            />
        </>
    );
}

function MediaPreview({ media, type, onReplace, onRemove, busy }) {
    if (!media) {
        return <div className="media-empty-slot">No file uploaded</div>;
    }

    return (
        <div className="media-preview-card">
            {type === "image" && <img src={media.fileUrl} alt={media.originalFilename || "Invitation media"} />}
            {type === "video" && <video src={media.fileUrl} controls />}
            {type === "audio" && <audio src={media.fileUrl} controls />}
            <div className="media-preview-meta">
                <strong>{media.originalFilename || "Uploaded media"}</strong>
                {media.mimeType && <span>{media.mimeType}</span>}
            </div>
            <div className="inv-card-actions">
                <MediaFileInput
                    accept={type === "video" ? ACCEPT.video : type === "audio" ? ACCEPT.audio : ACCEPT.image}
                    disabled={busy}
                    label="Replace"
                    onFiles={(file) => onReplace(media, file)}
                />
                <button type="button" className="danger" disabled={busy} onClick={() => onRemove(media)}>
                    Remove
                </button>
            </div>
        </div>
    );
}

export default function InvitationMediaManager() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [media, setMedia] = useState(null);
    const [loadedId, setLoadedId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        mediaService.list(id)
            .then((data) => {
                if (active) {
                    setMedia(data);
                    setError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setError(err.message || "Could not load media");
                }
            })
            .finally(() => {
                if (active) {
                    setLoadedId(id);
                    setLoading(false);
                }
            });
        return () => {
            active = false;
        };
    }, [id]);

    const refreshWith = (updater) => {
        setMedia((current) => updater(current || { galleryImages: [], all: [] }));
    };

    const upload = async (action, successMessage) => {
        setBusy(true);
        try {
            const response = await action();
            toast(successMessage);
            return response;
        } catch (err) {
            setError(err.message || "Media action failed");
            return null;
        } finally {
            setBusy(false);
        }
    };

    const uploadCover = async (file) => {
        const response = await upload(() => mediaService.uploadCover(id, file), "Cover image uploaded");
        if (response) {
            refreshWith((current) => ({ ...current, coverImage: response }));
        }
    };

    const uploadGallery = async (files) => {
        const response = await upload(() => mediaService.uploadGallery(id, files), "Gallery images uploaded");
        if (response) {
            refreshWith((current) => ({
                ...current,
                galleryImages: [...(current.galleryImages || []), ...response],
            }));
        }
    };

    const uploadVideo = async (file) => {
        const response = await upload(() => mediaService.uploadVideo(id, file), "Video uploaded");
        if (response) {
            refreshWith((current) => ({ ...current, video: response }));
        }
    };

    const uploadMusic = async (file) => {
        const response = await upload(() => mediaService.uploadMusic(id, file), "Background music uploaded");
        if (response) {
            refreshWith((current) => ({ ...current, backgroundMusic: response }));
        }
    };

    const replaceMedia = async (item, file) => {
        const response = await upload(() => mediaService.replace(id, item.id, file), "Media replaced");
        if (!response) return;
        refreshWith((current) => ({
            ...current,
            coverImage: current.coverImage?.id === response.id ? response : current.coverImage,
            video: current.video?.id === response.id ? response : current.video,
            backgroundMusic: current.backgroundMusic?.id === response.id ? response : current.backgroundMusic,
            galleryImages: (current.galleryImages || []).map((galleryItem) => (
                galleryItem.id === response.id ? response : galleryItem
            )),
        }));
    };

    const removeMedia = async (item) => {
        if (!window.confirm("Remove this media file?")) return;
        const response = await upload(() => mediaService.remove(id, item.id), "Media removed");
        if (response === null) return;
        refreshWith((current) => ({
            ...current,
            coverImage: current.coverImage?.id === item.id ? null : current.coverImage,
            video: current.video?.id === item.id ? null : current.video,
            backgroundMusic: current.backgroundMusic?.id === item.id ? null : current.backgroundMusic,
            galleryImages: (current.galleryImages || []).filter((galleryItem) => galleryItem.id !== item.id),
        }));
    };

    return (
        <div className="inv-page">
            <header className="inv-page-header">
                <div>
                    <span className="inv-eyebrow">Media management</span>
                    <h1>Invitation Media</h1>
                    <p>Manage the images, video, and music that appear on this invitation.</p>
                </div>
                <div className="inv-form-actions">
                    <button type="button" className="inv-secondary-btn" onClick={() => navigate(`/dashboard/invitations/${id}/preview`)}>
                        Preview
                    </button>
                    <button type="button" className="inv-secondary-btn" onClick={() => navigate("/dashboard/invitations")}>
                        My Invitations
                    </button>
                </div>
            </header>

            {error && <div className="inv-error">{error}</div>}
            {(loading || loadedId !== id) && <div className="inv-loading">Loading media...</div>}

            {!loading && loadedId === id && (
                <div className="media-manager">
                    <section className="inv-form-section">
                        <div className="media-section-header">
                            <h2>Cover image</h2>
                            <MediaFileInput accept={ACCEPT.image} disabled={busy} label="Upload cover" onFiles={uploadCover} />
                        </div>
                        <MediaPreview media={media?.coverImage} type="image" busy={busy} onReplace={replaceMedia} onRemove={removeMedia} />
                    </section>

                    <section className="inv-form-section">
                        <div className="media-section-header">
                            <h2>Gallery images</h2>
                            <MediaFileInput
                                accept={ACCEPT.image}
                                multiple
                                disabled={busy}
                                label="Upload images"
                                onFiles={uploadGallery}
                            />
                        </div>
                        {media?.galleryImages?.length ? (
                            <div className="media-gallery-grid">
                                {media.galleryImages.map((item) => (
                                    <MediaPreview
                                        key={item.id}
                                        media={item}
                                        type="image"
                                        busy={busy}
                                        onReplace={replaceMedia}
                                        onRemove={removeMedia}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="media-empty-slot">No gallery images uploaded</div>
                        )}
                    </section>

                    <section className="inv-form-section">
                        <div className="media-section-header">
                            <h2>Video</h2>
                            <MediaFileInput accept={ACCEPT.video} disabled={busy} label="Upload video" onFiles={uploadVideo} />
                        </div>
                        <MediaPreview media={media?.video} type="video" busy={busy} onReplace={replaceMedia} onRemove={removeMedia} />
                    </section>

                    <section className="inv-form-section">
                        <div className="media-section-header">
                            <h2>Background music</h2>
                            <MediaFileInput accept={ACCEPT.audio} disabled={busy} label="Upload music" onFiles={uploadMusic} />
                        </div>
                        <MediaPreview
                            media={media?.backgroundMusic}
                            type="audio"
                            busy={busy}
                            onReplace={replaceMedia}
                            onRemove={removeMedia}
                        />
                    </section>
                </div>
            )}
        </div>
    );
}

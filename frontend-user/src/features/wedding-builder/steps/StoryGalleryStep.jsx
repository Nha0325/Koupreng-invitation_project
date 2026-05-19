import { useRef, useEffect, useState } from "react";
import { saveGallery, loadGallery } from "../../../services/galleryStorage";

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export default function StoryGalleryStep({ draft, update }) {
    const fileInputRef = useRef(null);
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load gallery from IndexedDB on mount
    useEffect(() => {
        if (!draft.id) {
            setLoading(false);
            return;
        }
        let mounted = true;
        loadGallery(draft.id)
            .then((items) => {
                if (mounted) {
                    setGallery(items || []);
                    setLoading(false);
                }
            })
            .catch((err) => {
                console.error("Failed to load gallery:", err);
                if (mounted) setLoading(false);
            });
        return () => { mounted = false; };
    }, [draft.id]);

    const persistGallery = async (newGallery) => {
        setGallery(newGallery);
        if (draft.id) {
            try {
                await saveGallery(draft.id, newGallery);
                console.log("Gallery saved:", newGallery.length, "items");
                // Notify other components (e.g., PhonePreview) to reload immediately.
                // Use a small delay to ensure IndexedDB write is fully visible to readers.
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent("gallery-updated", {
                        detail: { draftId: draft.id }
                    }));
                }, 50);
                // Bump timestamp so PhonePreview / other consumers reload
                update({ galleryUpdatedAt: Date.now() });
            } catch (err) {
                console.error("Failed to save gallery:", err);
                alert("មិនអាចរក្សាទុករូបភាពបានទេ៖ " + err.message);
            }
        }
    };

    const handleFiles = async (files) => {
        const validFiles = Array.from(files).filter((file) => {
            if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
                return false;
            }
            if (file.size > MAX_FILE_SIZE) {
                alert(`ឯកសារ "${file.name}" ធំជាង 50MB។`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        const newItems = await Promise.all(
            validFiles.map(async (file) => ({
                id: crypto.randomUUID(),
                name: file.name,
                type: file.type.startsWith("video/") ? "video" : "image",
                preview: await fileToDataURL(file),
            }))
        );

        await persistGallery([...gallery, ...newItems]);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.currentTarget.classList.remove("wb-drop-active");
        handleFiles(e.dataTransfer.files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.currentTarget.classList.add("wb-drop-active");
    };

    const handleDragLeave = (e) => {
        e.currentTarget.classList.remove("wb-drop-active");
    };

    const removeItem = async (id) => {
        await persistGallery(gallery.filter((item) => item.id !== id));
    };

    return (
        <div>
            <h2>4. រឿង និងរូបភាព</h2>
            <p className="wb-help">សរសេររឿងខ្លី និង upload រូបភាព/វីដេអូ។</p>

            <div className="wb-field">
                <label htmlFor="story">រឿងរបស់យើង</label>
                <textarea
                    id="story"
                    rows={5}
                    value={draft.story}
                    onChange={(e) => update({ story: e.target.value })}
                    placeholder="ដំណើររឿងខ្លីរបស់គូរ..."
                />
            </div>

            <div className="wb-field">
                <label>រូបភាព / វីដេអូ</label>
                <div
                    className="wb-dropzone"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
                    }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept={ACCEPTED_TYPES}
                        multiple
                        hidden
                        onChange={(e) => {
                            handleFiles(e.target.files);
                            e.target.value = "";
                        }}
                    />
                    <div className="wb-dropzone-content">
                        <span className="wb-dropzone-icon">📁</span>
                        <p>ចុច ឬ ទម្លាក់ឯកសារនៅទីនេះ</p>
                        <small>រូបភាព (JPG, PNG, WebP) ឬ វីដេអូ (MP4, WebM) — អតិបរមា 50MB</small>
                    </div>
                </div>

                {loading && <p style={{ color: "#7d6443", fontSize: 13, marginTop: 12 }}>កំពុងផ្ទុក...</p>}

                {!loading && gallery.length === 0 && (
                    <p style={{ color: "#999", fontSize: 13, marginTop: 12 }}>មិនទាន់មានឯកសារ</p>
                )}

                {gallery.length > 0 && (
                    <>
                        <p style={{ color: "#7d6443", fontSize: 13, marginTop: 12, marginBottom: 8 }}>
                            បានឧបឡូត {gallery.length} ឯកសារ
                        </p>
                        <div className="wb-gallery-grid">
                            {gallery.map((item) => (
                                <div key={item.id} className="wb-gallery-item">
                                    {item.type === "video" ? (
                                        <video src={item.preview} className="wb-gallery-thumb" muted />
                                    ) : (
                                        <img src={item.preview} alt={item.name} className="wb-gallery-thumb" />
                                    )}
                                    <div className="wb-gallery-item-info">
                                        <span className="wb-gallery-item-name">{item.name}</span>
                                        <span className="wb-gallery-item-badge">
                                            {item.type === "video" ? "🎬 វីដេអូ" : "🖼️ រូបភាព"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        className="wb-gallery-remove"
                                        onClick={() => removeItem(item.id)}
                                        aria-label={`លុប ${item.name}`}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

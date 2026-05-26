import { useRef } from "react";

/**
 * StoryGalleryStep — Step 4: រឿង / រូបភាព
 * Story text + image gallery upload
 */
export default function StoryGalleryStep({ draft, update }) {
    const fileInputRef = useRef(null);
    const gallery = draft?.gallery || [];

    const handleFiles = (e) => {
        const files = Array.from(e.target.files || []);
        const urls = files.map((f) => URL.createObjectURL(f));
        update({ gallery: [...gallery, ...urls] });
    };

    const removeImage = (index) => {
        const next = gallery.filter((_, i) => i !== index);
        update({ gallery: next });
    };

    return (
        <div>
            <h2>4. រឿង / រូបភាព</h2>
            <p className="wb-help">បន្ថែមរឿងរ៉ាវ និងរូបភាពពិធី។</p>

            <div className="wb-field">
                <label>រឿងរ៉ាវរបស់យើង</label>
                <textarea
                    rows={5}
                    value={draft?.story || ""}
                    onChange={(e) => update({ story: e.target.value })}
                    placeholder="រឿងរ៉ាវស្នេហារបស់យើង..."
                />
            </div>

            <div className="wb-field">
                <label>រូបភាព</label>
                <div
                    className="wb-dropzone"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="wb-dropzone-content">
                        <div className="wb-dropzone-icon">📷</div>
                        <p>ចុចដើម្បីបញ្ចូលរូបភាព</p>
                        <small>JPG, PNG — អតិបរមា 5MB ក្នុងមួយរូប</small>
                    </div>
                </div>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleFiles}
                />
            </div>

            {gallery.length > 0 && (
                <div className="wb-gallery-grid">
                    {gallery.map((url, i) => (
                        <div key={i} className="wb-gallery-item">
                            <img src={url} alt={`Gallery ${i + 1}`} className="wb-gallery-thumb" />
                            <button
                                type="button"
                                className="wb-gallery-remove"
                                onClick={() => removeImage(i)}
                                aria-label="Remove image"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { useRef } from "react";
import { DressCodePicker } from "../../../shared/ui/DressCodePicker";
import { MusicPicker } from "../../../shared/ui/MusicPicker";
import { DRESS_CODE_COMBOS } from "../../../shared/data/dressCodeColors";
import { MUSIC_TRACKS } from "../../../shared/data/musicTracks";
import RepeatableList from "../components/RepeatableList";

export default function EnhancementsStep({ draft, update }) {
    const fileInputRef = useRef(null);
    const gallery = draft?.gallery || [];
    const dressCode = draft?.dressCode || DRESS_CODE_COMBOS[0];
    const music = draft?.music || MUSIC_TRACKS[0];

    const storyChapters = draft?.storyChapters || [];
    const party = draft?.party || [];
    const gift = draft?.gift || [];
    const faq = draft?.faq || [];

    const handleFiles = (event) => {
        const files = Array.from(event.target.files || []);
        const urls = files.map((file) => URL.createObjectURL(file));
        update({ gallery: [...gallery, ...urls] });
    };

    const removeImage = (index) => {
        update({ gallery: gallery.filter((_, itemIndex) => itemIndex !== index) });
    };

    return (
        <div>
            <h2>Notes &amp; media</h2>
            <p className="wb-help">ព័ត៌មានខាងក្រោមជាជម្រើសបន្ថែម។ អ្នកអាចបោះផ្សាយសន្លឹកការដោយមិនបំពេញទាំងអស់។</p>

            {/* Short story blurb + gallery */}
            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Story</span>
                    <h3>រឿងរ៉ាវ និងរូបភាព</h3>
                </div>

                <div className="wb-field">
                    <label>រឿងរ៉ាវរបស់យើង (សង្ខេប)</label>
                    <textarea
                        rows={4}
                        value={draft?.story || ""}
                        onChange={(e) => update({ story: e.target.value })}
                        placeholder="សរសេរខ្លីៗពីរឿងរ៉ាវរបស់អ្នក..."
                    />
                </div>

                <div className="wb-field">
                    <label>រូបភាព</label>
                    <div
                        className="wb-dropzone"
                        onClick={() => fileInputRef.current?.click()}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" || event.key === " ") {
                                fileInputRef.current?.click();
                            }
                        }}
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
                        {gallery.map((url, index) => (
                            <div key={`${url}-${index}`} className="wb-gallery-item">
                                <img src={url} alt={`Gallery ${index + 1}`} className="wb-gallery-thumb" />
                                <button
                                    type="button"
                                    className="wb-gallery-remove"
                                    onClick={() => removeImage(index)}
                                    aria-label="Remove image"
                                >
                                    x
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <details className="wb-advanced">
                <summary>Dress code និងតន្ត្រី</summary>
                <div className="wb-advanced-body">
                    <div className="wb-field">
                        <label>ពណ៌ Dress Code</label>
                        <DressCodePicker
                            value={dressCode}
                            onChange={(combo) => update({ dressCode: combo })}
                        />
                    </div>

                    <div className="wb-field">
                        <label>តន្ត្រី Background</label>
                        <MusicPicker
                            value={music}
                            onChange={(track) => update({ music: track })}
                        />
                    </div>
                </div>
            </details>
        </div>
    );
}

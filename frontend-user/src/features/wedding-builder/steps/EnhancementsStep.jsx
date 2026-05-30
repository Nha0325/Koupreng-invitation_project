import { useRef } from "react";
import { DressCodePicker } from "../../../shared/ui/DressCodePicker";
import { MusicPicker } from "../../../shared/ui/MusicPicker";
import { OpeningVideoPicker } from "../../../shared/ui/OpeningVideoPicker";
import { DRESS_CODE_COMBOS } from "../../../shared/data/dressCodeColors";
import { MUSIC_TRACKS } from "../../../shared/data/musicTracks";

export default function EnhancementsStep({ draft, update, updateField }) {
    const fileInputRef = useRef(null);
    const gallery = draft?.gallery || [];
    const extras = draft?.extras || {};
    const dressCode = draft?.dressCode || DRESS_CODE_COMBOS[0];
    const music = draft?.music || MUSIC_TRACKS[0];
    const openingVideo = draft?.openingVideoEnabled ? draft?.openingVideo : null;

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

            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Story</span>
                    <h3>រឿងរ៉ាវ និងរូបភាព</h3>
                </div>

                <div className="wb-field">
                    <label>រឿងរ៉ាវរបស់យើង</label>
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

            {/* <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Opening</span>
                    <h3>ជ្រើសរើសវីដេអូបើកសន្លឹកការ</h3>
                </div>
                <div className="wb-field">
                    <label>វីដេអូ 1-4</label>
                    <OpeningVideoPicker
                        value={openingVideo}
                        onChange={(video) => update({ openingVideo: video, openingVideoEnabled: Boolean(video) })}
                    />
                </div>
            </section> */}

            {/* <details className="wb-advanced">
                <summary>ព័ត៌មានបន្ថែមសម្រាប់ភ្ញៀវ</summary>
                <div className="wb-advanced-body">
                    <div className="wb-row">
                        <div className="wb-field">
                            <label>Playlist link</label>
                            <input
                                type="url"
                                value={extras.playlistLink || ""}
                                onChange={(e) => updateField("extras", { playlistLink: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>

                        <div className="wb-field">
                            <label>Video link</label>
                            <input
                                type="url"
                                value={extras.videoLink || ""}
                                onChange={(e) => updateField("extras", { videoLink: e.target.value })}
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    <div className="wb-field">
                        <label>Gift / cash gift details</label>
                        <textarea
                            rows={3}
                            value={extras.giftInfo || ""}
                            onChange={(e) => updateField("extras", { giftInfo: e.target.value })}
                            placeholder="ព័ត៌មានចងដៃ ឬ ABA/ធនាគារ..."
                        />
                    </div>

                    <div className="wb-row">
                        <div className="wb-field">
                            <label>Accommodation info</label>
                            <textarea
                                rows={3}
                                value={extras.accommodationInfo || ""}
                                onChange={(e) => updateField("extras", { accommodationInfo: e.target.value })}
                                placeholder="សណ្ឋាគារ ឬកន្លែងស្នាក់នៅ..."
                            />
                        </div>

                        <div className="wb-field">
                            <label>Transportation note</label>
                            <textarea
                                rows={3}
                                value={extras.transportationNote || ""}
                                onChange={(e) => updateField("extras", { transportationNote: e.target.value })}
                                placeholder="ចំណាំអំពីការធ្វើដំណើរ..."
                            />
                        </div>
                    </div>

                    <div className="wb-field">
                        <label>Extra guest note</label>
                        <textarea
                            rows={3}
                            value={extras.guestNote || ""}
                            onChange={(e) => updateField("extras", { guestNote: e.target.value })}
                            placeholder="សំណូមពរពិសេសសម្រាប់ភ្ញៀវ..."
                        />
                    </div>

                    <div className="wb-field">
                        <label>Multilingual content note</label>
                        <textarea
                            rows={3}
                            value={extras.languageNote || ""}
                            onChange={(e) => updateField("extras", { languageNote: e.target.value })}
                            placeholder="ចំណាំសម្រាប់ Khmer / English / ភាសាផ្សេង..."
                        />
                    </div>
                </div>
            </details> */}

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

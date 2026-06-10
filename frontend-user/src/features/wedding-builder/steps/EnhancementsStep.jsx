import { useRef } from "react";
import { MusicPicker } from "../../../shared/ui/MusicPicker";
import { MUSIC_TRACKS } from "../../../shared/data/musicTracks";
import { saveGallery } from "../../../services/galleryStorage";
import RepeatableList from "../components/RepeatableList";

export default function EnhancementsStep({ draft, update }) {
    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const gallery = draft?.gallery || [];
    const music = draft?.music || MUSIC_TRACKS[0];
    const design = draft?.design || {};
    const enabledSections = draft?.enabledSections || {};
    const extras = draft?.extras || {};
    const gift = draft?.gift || [];

    const storyChapters = draft?.storyChapters || [];

    const fileToDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

    const syncGallery = async (items) => {
        update({ gallery: items, galleryUpdatedAt: Date.now() });
        if (draft?.id) {
            await saveGallery(draft.id, items);
            window.dispatchEvent(new CustomEvent("gallery-updated", { detail: { draftId: draft.id } }));
        }
    };

    const handleCoverFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const preview = await fileToDataUrl(file);
        update({ coverImage: preview });
    };

    const handleFiles = async (event) => {
        const files = Array.from(event.target.files || []);
        const items = await Promise.all(files.map(async (file) => ({
            id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            type: file.type?.startsWith("video/") ? "video" : "image",
            preview: await fileToDataUrl(file),
        })));
        syncGallery([...gallery, ...items]);
    };

    const removeImage = (index) => {
        syncGallery(gallery.filter((_, itemIndex) => itemIndex !== index));
    };

    const updateDesign = (patch) => {
        update({ design: { ...design, ...patch } });
    };

    const updateExtras = (patch) => {
        update({ extras: { ...extras, ...patch } });
    };

    const toggleSection = (key, checked) => {
        update({ enabledSections: { ...enabledSections, [key]: checked } });
    };

    return (
        <div>
            <h2>Notes &amp; media</h2>
            <p className="wb-help">ព័ត៌មានខាងក្រោមជាជម្រើសបន្ថែម។ បំពេញ ឬចុច «បន្ថែម» ដើម្បីបង្ហាញផ្នែកនីមួយៗ។ បើទុកទទេ វានឹងប្រើគំរូជំនួស។</p>

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

                <div className="wb-row">
                    <div className="wb-field">
                        <label>Language mode</label>
                        <select
                            value={extras.languageMode || "both"}
                            onChange={(e) => updateExtras({ languageMode: e.target.value })}
                        >
                            <option value="km">Khmer</option>
                            <option value="en">English</option>
                            <option value="both">Khmer + English</option>
                        </select>
                    </div>
                </div>

                <div className="wb-field">
                    <label>Our Story (English)</label>
                    <textarea
                        rows={4}
                        value={extras.storyTextEn || ""}
                        onChange={(e) => updateExtras({ storyTextEn: e.target.value })}
                        placeholder="Write the English version of your story..."
                    />
                </div>

                <div className="wb-row">
                    <div className="wb-field">
                        <label>Monogram text</label>
                        <input
                            type="text"
                            value={design.monogramText || ""}
                            onChange={(e) => updateDesign({ monogramText: e.target.value })}
                            placeholder="ឧ. V & P"
                        />
                    </div>

                    <div className="wb-field">
                        <label>Cover image</label>
                        <button type="button" className="wb-btn wb-btn-secondary" onClick={() => coverInputRef.current?.click()}>
                            ជ្រើសរូប Cover
                        </button>
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleCoverFile}
                        />
                    </div>
                </div>

                {draft?.coverImage && (
                    <div className="wb-gallery-grid">
                        <div className="wb-gallery-item">
                            <img src={draft.coverImage} alt="Cover preview" className="wb-gallery-thumb" />
                        </div>
                    </div>
                )}

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
                        {gallery.map((item, index) => {
                            const preview = typeof item === "string" ? item : item.preview;
                            return (
                                <div key={`${preview}-${index}`} className="wb-gallery-item">
                                    <img src={preview} alt={`Gallery ${index + 1}`} className="wb-gallery-thumb" />
                                    <button
                                        type="button"
                                        className="wb-gallery-remove"
                                        onClick={() => removeImage(index)}
                                        aria-label="Remove image"
                                    >
                                        x
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            {/* Love story chapters (timeline) */}
            <RepeatableList
                kicker="Love story"
                title="ជំពូករឿងរ៉ាវស្នេហា (ស្រេចចិត្ត)"
                help="បន្ថែមជំពូកនីមួយៗ ឧ. ថ្ងៃជួបគ្នា ការណាត់ជួប ថ្ងៃសុំដៃ។ រូបភាពនឹងភ្ជាប់ដោយស្វ័យប្រវត្តិពីគំរូ។"
                items={storyChapters}
                onChange={(next) => update({ storyChapters: next })}
                addLabel="+ បន្ថែមជំពូក"
                itemLabel="ជំពូក"
                makeEmpty={() => ({ kicker: "", title: "", date: "", text: "" })}
                fields={[
                    { key: "kicker", label: "ស្លាកជំពូក (ស្រេចចិត្ត)", placeholder: "ឧ. ជំពូកទី ១" },
                    { key: "title", label: "ចំណងជើង", placeholder: "ឧ. ថ្ងៃដែលយើងជួបគ្នា" },
                    { key: "date", label: "ពេលវេលា (ស្រេចចិត្ត)", placeholder: "ឧ. មករា ២០២១" },
                    { key: "text", label: "ការពិពណ៌នា", type: "textarea", rows: 3, wide: true, placeholder: "ឧ. ក្នុងពិធីបុណ្យមួយ ភ្នែកទាំងពីរបានជួបគ្នាដំបូង..." },
                ]}
            />

            <RepeatableList
                kicker="Gift"
                title="គណនីចងដៃ (ស្រេចចិត្ត)"
                help="បន្ថែមព័ត៌មាន ABA ឬធនាគារផ្សេងៗសម្រាប់ផ្នែក Gift។ ទុកទទេបើមិនចង់បង្ហាញ។"
                items={gift}
                onChange={(next) => update({ gift: next })}
                addLabel="+ បន្ថែមគណនី"
                itemLabel="គណនី"
                makeEmpty={() => ({ bank: "", account: "", number: "", note: "" })}
                fields={[
                    { key: "bank", label: "ធនាគារ", placeholder: "ឧ. ABA Bank" },
                    { key: "account", label: "ឈ្មោះគណនី", placeholder: "ឧ. VANN PISEY" },
                    { key: "number", label: "លេខគណនី", placeholder: "ឧ. 000 000 000" },
                    { key: "note", label: "សម្គាល់", placeholder: "ឧ. ABA PAY" },
                ]}
            />

            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Sections</span>
                    <h3>បើក/បិទផ្នែកសន្លឹកការ</h3>
                </div>
                {[
                    ["countdown", "Countdown"],
                    ["story", "Our Story"],
                    ["gallery", "Gallery"],
                    ["schedule", "Timeline"],
                    ["map", "Venue and map"],
                    ["gift", "Gift"],
                    ["faq", "FAQ"],
                    ["rsvp", "RSVP"],
                ].map(([key, label]) => (
                    <label className="wb-toggle-row" key={key}>
                        <input
                            type="checkbox"
                            checked={enabledSections[key] !== false}
                            onChange={(e) => toggleSection(key, e.target.checked)}
                        />
                        <span>
                            <strong>{label}</strong>
                            <small>បង្ហាញផ្នែកនេះនៅលើ Preview និង Public link។</small>
                        </span>
                    </label>
                ))}
            </section>

            <details className="wb-advanced">
                <summary>តន្ត្រី</summary>
                <div className="wb-advanced-body">
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

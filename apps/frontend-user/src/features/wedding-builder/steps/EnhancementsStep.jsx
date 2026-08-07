import { useEffect, useRef, useState } from "react";
import { IoCameraOutline, IoColorPaletteOutline, IoImagesOutline, IoMusicalNotesOutline, IoVideocamOutline } from "react-icons/io5";
import { MusicPicker } from "../../../shared/ui/MusicPicker";
import { OpeningVideoPicker } from "../../../shared/ui/OpeningVideoPicker";
import { MUSIC_TRACKS } from "../../../shared/data/musicTracks";
import { loadGallery, saveGallery } from "../../../shared/storage/galleryStorage";
import {
    deleteDraftMediaFile,
    loadDraftMediaFiles,
    saveDraftMediaFile,
} from "../../../shared/storage/draftMediaStorage";
import RepeatableList from "../components/RepeatableList";
import { pendingMediaMetadata, validateMediaFile } from "../utils/mediaValidation";

export default function EnhancementsStep({ draft, update }) {
    const fileInputRef = useRef(null);
    const coverInputRef = useRef(null);
    const musicInputRef = useRef(null);
    const openingVideoInputRef = useRef(null);
    const [gallery, setGallery] = useState([]);
    const [pendingPreviews, setPendingPreviews] = useState({});
    const [mediaError, setMediaError] = useState("");
    const [mediaStatus, setMediaStatus] = useState("");
    const previewUrlsRef = useRef({});
    const music = draft?.music || MUSIC_TRACKS[0];
    const openingVideo = draft?.openingVideo || null;
    const design = draft?.design || {};
    const opening = draft?.opening || {};
    const enabledSections = draft?.enabledSections || {};
    const extras = draft?.extras || {};
    const gift = draft?.gift || [];
    const faq = draft?.faq || [];

    const storyChapters = draft?.storyChapters || [];

    useEffect(() => {
        let active = true;
        const releasePreviews = () => {
            Object.values(previewUrlsRef.current).forEach((url) => URL.revokeObjectURL(url));
            previewUrlsRef.current = {};
        };
        releasePreviews();

        Promise.all([
            draft?.id ? loadGallery(draft.id).catch(() => []) : Promise.resolve([]),
            draft?.id ? loadDraftMediaFiles(draft.id).catch(() => ({})) : Promise.resolve({}),
        ]).then(([storedGallery, storedMedia]) => {
            if (!active) return;
            setGallery(storedGallery.length ? storedGallery : (draft?.gallery || []));
            const previews = {};
            Object.entries(storedMedia).forEach(([kind, record]) => {
                if (!record?.file) return;
                const url = URL.createObjectURL(record.file);
                previewUrlsRef.current[kind] = url;
                previews[kind] = url;
            });
            setPendingPreviews(previews);
        });

        return () => {
            active = false;
            releasePreviews();
        };
    }, [draft?.gallery, draft?.id]);

    const fileToDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });

    const syncGallery = async (items, removedMediaIds = draft?.removedGalleryMediaIds || []) => {
        setGallery(items);
        update({
            gallery: items.map(({ id, name, type, preview }) => ({
                id,
                name,
                type,
                ...(typeof preview === "string" && !preview.startsWith("data:") ? { preview } : {}),
                pending: typeof preview === "string" && preview.startsWith("data:"),
            })),
            removedGalleryMediaIds: removedMediaIds,
            galleryUpdatedAt: Date.now(),
        });
        if (draft?.id) {
            await saveGallery(draft.id, items);
            window.dispatchEvent(new CustomEvent("gallery-updated", { detail: { draftId: draft.id } }));
        }
    };

    const setPendingPreview = (kind, file) => {
        if (previewUrlsRef.current[kind]) URL.revokeObjectURL(previewUrlsRef.current[kind]);
        const url = URL.createObjectURL(file);
        previewUrlsRef.current[kind] = url;
        setPendingPreviews((current) => ({ ...current, [kind]: url }));
    };

    const savePendingFile = async (kind, file) => {
        const error = validateMediaFile(file, kind);
        if (error) {
            setMediaError(error);
            setMediaStatus("");
            return false;
        }
        setMediaError("");
        setMediaStatus("កំពុងរៀបចំឯកសារ...");
        await saveDraftMediaFile(draft.id, kind, file);
        setPendingPreview(kind, file);
        update({
            pendingMedia: {
                ...(draft.pendingMedia || {}),
                [kind]: pendingMediaMetadata(file),
            },
            removedMedia: {
                ...(draft.removedMedia || {}),
                [kind]: false,
            },
        });
        window.dispatchEvent(new CustomEvent("draft-media-updated", { detail: { draftId: draft.id } }));
        setMediaStatus(`${file.name} រួចរាល់សម្រាប់ upload នៅពេលបោះផ្សាយ។`);
        return true;
    };

    const removePendingFile = async (kind, patch = {}) => {
        await deleteDraftMediaFile(draft.id, kind).catch(() => undefined);
        if (previewUrlsRef.current[kind]) URL.revokeObjectURL(previewUrlsRef.current[kind]);
        delete previewUrlsRef.current[kind];
        setPendingPreviews((current) => {
            const next = { ...current };
            delete next[kind];
            return next;
        });
        const nextPending = { ...(draft.pendingMedia || {}) };
        delete nextPending[kind];
        update({
            pendingMedia: nextPending,
            removedMedia: {
                ...(draft.removedMedia || {}),
                [kind]: true,
            },
            ...patch,
        });
        window.dispatchEvent(new CustomEvent("draft-media-updated", { detail: { draftId: draft.id } }));
    };

    const handleCoverFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await savePendingFile("cover", file);
        event.target.value = "";
    };

    const handleFiles = async (event) => {
        const files = Array.from(event.target.files || []);
        const invalid = files.map((file) => validateMediaFile(file, "gallery")).find(Boolean);
        if (invalid) {
            setMediaError(invalid);
            event.target.value = "";
            return;
        }
        const items = await Promise.all(files.map(async (file) => ({
            id: `${Date.now()}-${file.name}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            type: file.type?.startsWith("video/") ? "video" : "image",
            preview: await fileToDataUrl(file),
        })));
        await syncGallery([...gallery, ...items]);
        setMediaError("");
        event.target.value = "";
    };

    const handleOpeningVideoFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (await savePendingFile("openingVideo", file)) update({ openingVideoEnabled: true });
        event.target.value = "";
    };

    const handleMusicFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        await savePendingFile("music", file);
        event.target.value = "";
    };

    const handleOpeningVideoChoice = async (video) => {
        await removePendingFile("openingVideo", {
            openingVideo: video,
            openingVideoEnabled: Boolean(video),
        });
    };

    const handleMusicChoice = async (track) => {
        await removePendingFile("music", { music: track });
    };

    const removeImage = (index) => {
        const removed = gallery[index];
        const removedIds = Number.isFinite(Number(removed?.id))
            ? [...new Set([...(draft?.removedGalleryMediaIds || []), Number(removed.id)])]
            : (draft?.removedGalleryMediaIds || []);
        syncGallery(gallery.filter((_, itemIndex) => itemIndex !== index), removedIds);
    };

    const updateDesign = (patch) => {
        update({ design: { ...design, ...patch } });
    };

    const updateExtras = (patch) => {
        update({ extras: { ...extras, ...patch } });
    };

    const updateOpening = (patch) => {
        update({ opening: { ...opening, ...patch } });
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
                            <div className="wb-dropzone-icon"><IoImagesOutline aria-hidden="true" /></div>
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

            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Design</span>
                    <h3>រចនាបថ Garden Royal Khmer</h3>
                </div>

                <div className="wb-field">
                    <label>Opening style</label>
                    <div className="wb-choice-grid wb-choice-grid--three">
                        {[
                            ["khmer-royal", "Khmer Royal", "គម្របពិធីការខ្មែរ និងស៊ុមមាស"],
                            ["paper", "Royal Paper", "ក្រដាសក្រែម និងស៊ុមមាស"],
                            ["monogram", "Monogram", "ផ្តោតលើនិមិត្តសញ្ញាគូស្នេហ៍"],
                        ].map(([value, label, description]) => (
                            <button
                                type="button"
                                key={value}
                                className={`wb-choice${(design.openingStyle || "khmer-royal") === value ? " is-active" : ""}`}
                                onClick={() => updateDesign({ openingStyle: value })}
                            >
                                <IoVideocamOutline aria-hidden="true" />
                                <strong>{label}</strong>
                                <small>{description}</small>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="wb-field">
                    <label>Icon &amp; ornament theme</label>
                    <div className="wb-choice-grid">
                        {[
                            ["royal-floral", "Royal Floral", "ផ្កា ស្លឹក និងស៊ុមមាស"],
                            ["khmer-line", "Khmer Line", "លំនាំខ្មែរបែបសាមញ្ញ"],
                            ["minimal-gold", "Minimal Gold", "ស្អាត ស្រាល និងទំនើប"],
                        ].map(([value, label, description]) => (
                            <button
                                type="button"
                                key={value}
                                className={`wb-choice${(design.ornamentTheme || "royal-floral") === value ? " is-active" : ""}`}
                                onClick={() => updateDesign({ ornamentTheme: value })}
                            >
                                <IoColorPaletteOutline aria-hidden="true" />
                                <strong>{label}</strong>
                                <small>{description}</small>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="wb-font-preview" aria-label="Font preview">
                    <span>សិរីមង្គលអាពាហ៍ពិពាហ៍</span>
                    <strong>កម្មវិធីមង្គលការ</strong>
                    <p>ដោយក្តីសោមនស្សរីករាយ យើងខ្ញុំសូមគោរពអញ្ជើញ</p>
                    <small>Garden Royal Wedding Invitation</small>
                </div>
            </section>

            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Opening cover</span>
                    <h3>គម្របសន្លឹកការបែបពិធីការខ្មែរ</h3>
                </div>

                <div className="wb-row">
                    <div className="wb-field">
                        <label htmlFor="opening-monogram">អក្សរកាត់គូស្វាមីភរិយា</label>
                        <input
                            id="opening-monogram"
                            type="text"
                            maxLength={24}
                            value={design.monogramText || ""}
                            onChange={(event) => updateDesign({ monogramText: event.target.value })}
                            placeholder="ឧ. វ & ព"
                        />
                    </div>
                    <div className="wb-field">
                        <label htmlFor="opening-heading">ចំណងជើងពិធី</label>
                        <input
                            id="opening-heading"
                            type="text"
                            maxLength={90}
                            value={opening.heading || ""}
                            onChange={(event) => updateOpening({ heading: event.target.value })}
                            placeholder="សិរីមង្គលអាពាហ៍ពិពាហ៍"
                        />
                    </div>
                </div>

                <div className="wb-field">
                    <label htmlFor="opening-invitation-text">សារអញ្ជើញ</label>
                    <textarea
                        id="opening-invitation-text"
                        rows={2}
                        maxLength={180}
                        value={opening.invitationText || ""}
                        onChange={(event) => updateOpening({ invitationText: event.target.value })}
                        placeholder="យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ"
                    />
                </div>

                <div className="wb-row">
                    <div className="wb-field">
                        <label htmlFor="opening-generic-guest">ពាក្យអញ្ជើញភ្ញៀវទូទៅ</label>
                        <input
                            id="opening-generic-guest"
                            type="text"
                            maxLength={120}
                            value={opening.genericGuestText || ""}
                            onChange={(event) => updateOpening({ genericGuestText: event.target.value })}
                            placeholder="លោកអ្នក និងក្រុមគ្រួសារ"
                        />
                    </div>
                    <div className="wb-field">
                        <label htmlFor="opening-button-label">ស្លាកប៊ូតុងបើក</label>
                        <input
                            id="opening-button-label"
                            type="text"
                            maxLength={72}
                            value={opening.openButtonText || ""}
                            onChange={(event) => updateOpening({ openButtonText: event.target.value })}
                            placeholder="បើកសំបុត្រអញ្ជើញ"
                        />
                    </div>
                </div>

                <div className="wb-row">
                    <div className="wb-field">
                        <label>រូបគម្រប</label>
                        <div className="wb-media-actions">
                            <button type="button" className="wb-btn wb-btn-secondary" onClick={() => coverInputRef.current?.click()}>
                                <IoCameraOutline aria-hidden="true" />
                                {pendingPreviews.cover || draft?.coverImage ? "ប្តូររូបគម្រប" : "ជ្រើសរូបគម្រប"}
                            </button>
                            {(pendingPreviews.cover || draft?.coverImage) && (
                                <button type="button" className="wb-btn" onClick={() => removePendingFile("cover", { coverImage: "" })}>
                                    ដករូបគម្រប
                                </button>
                            )}
                        </div>
                        <input
                            ref={coverInputRef}
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                            hidden
                            onChange={handleCoverFile}
                        />
                    </div>
                    <div className="wb-field">
                        <label htmlFor="opening-overlay">កម្រិតស្រមោលលើរូប ({Math.round((design.openingOverlayOpacity ?? 0.48) * 100)}%)</label>
                        <input
                            id="opening-overlay"
                            type="range"
                            min="0.2"
                            max="0.8"
                            step="0.02"
                            value={design.openingOverlayOpacity ?? 0.48}
                            onChange={(event) => updateDesign({ openingOverlayOpacity: Number(event.target.value) })}
                        />
                    </div>
                </div>

                {(pendingPreviews.cover || draft?.coverImage) && (
                    <div className="wb-opening-media-preview">
                        <img src={pendingPreviews.cover || draft.coverImage} alt="ការបង្ហាញរូបគម្រប" />
                    </div>
                )}

                <div className="wb-field">
                    <label>រចនាបថស៊ុម</label>
                    <div className="wb-choice-grid wb-choice-grid--three">
                        {[
                            ["double-gold", "មាសពីរជាន់"],
                            ["single-gold", "មាសមួយជាន់"],
                            ["minimal-gold", "មាសសាមញ្ញ"],
                        ].map(([value, label]) => (
                            <button
                                type="button"
                                key={value}
                                className={`wb-choice${(design.frameStyle || "double-gold") === value ? " is-active" : ""}`}
                                onClick={() => updateDesign({ frameStyle: value })}
                            >
                                <strong>{label}</strong>
                            </button>
                        ))}
                    </div>
                </div>

                <label className="wb-toggle-row">
                    <input
                        type="checkbox"
                        checked={draft?.openingVideoEnabled === true}
                        onChange={(e) => update({ openingVideoEnabled: e.target.checked })}
                    />
                    <span>
                        <strong>ប្រើវីដេអូបើកសន្លឹកការ</strong>
                        <small>បង្ហាញវីដេអូនៅលើអេក្រង់ “ចុចដើម្បីបើក” ប្រសិនបើបានជ្រើស។</small>
                    </span>
                </label>

                <div className="wb-field">
                    <label>ជ្រើសវីដេអូបើក</label>
                    <OpeningVideoPicker
                        value={openingVideo}
                        onChange={handleOpeningVideoChoice}
                    />
                </div>

                <div className="wb-field">
                    <label>Upload opening video</label>
                    <div className="wb-media-actions">
                        <button type="button" className="wb-btn wb-btn-secondary" onClick={() => openingVideoInputRef.current?.click()}>
                            <IoVideocamOutline aria-hidden="true" />
                            {pendingPreviews.openingVideo ? "ប្តូរវីដេអូ" : "ជ្រើសវីដេអូផ្ទាល់ខ្លួន"}
                        </button>
                        {(pendingPreviews.openingVideo || openingVideo) && (
                            <button type="button" className="wb-btn" onClick={() => removePendingFile("openingVideo", { openingVideo: null, openingVideoEnabled: false })}>
                                ដកវីដេអូ
                            </button>
                        )}
                    </div>
                    <input
                        ref={openingVideoInputRef}
                        type="file"
                        accept=".mp4,.webm,video/mp4,video/webm"
                        hidden
                        onChange={handleOpeningVideoFile}
                    />
                </div>

                {pendingPreviews.openingVideo && (
                    <div className="wb-opening-media-preview">
                        <video src={pendingPreviews.openingVideo} muted controls playsInline preload="metadata" />
                    </div>
                )}

                <div className="wb-field">
                    <label>តន្ត្រី Background</label>
                    <MusicPicker
                        value={music}
                        onChange={handleMusicChoice}
                    />
                </div>

                <div className="wb-field">
                    <label>Upload your own song</label>
                    <div className="wb-media-actions">
                        <button type="button" className="wb-btn wb-btn-secondary" onClick={() => musicInputRef.current?.click()}>
                            <IoMusicalNotesOutline aria-hidden="true" />
                            {pendingPreviews.music ? "ប្តូរបទចម្រៀង" : "ជ្រើសបទចម្រៀងពីឧបករណ៍"}
                        </button>
                        {pendingPreviews.music && (
                            <button type="button" className="wb-btn" onClick={() => removePendingFile("music", { music: MUSIC_TRACKS[0] })}>
                                ដកបទផ្ទាល់ខ្លួន
                            </button>
                        )}
                    </div>
                    {draft.pendingMedia?.music?.name && <p className="wb-help">បានជ្រើស: {draft.pendingMedia.music.name}</p>}
                    <input
                        ref={musicInputRef}
                        type="file"
                        accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
                        hidden
                        onChange={handleMusicFile}
                    />
                </div>

                {(mediaError || mediaStatus) && (
                    <p className={`wb-media-status${mediaError ? " is-error" : ""}`} role={mediaError ? "alert" : "status"}>
                        {mediaError || mediaStatus}
                    </p>
                )}
            </section>

            <RepeatableList
                kicker="Gift"
                title="គណនីចងដៃ (ស្រេចចិត្ត)"
                help="បន្ថែមព័ត៌មាន ABA ឬធនាគារផ្សេងៗសម្រាប់ផ្នែក Gift។ ទុកទទេបើមិនចង់បង្ហាញ។"
                items={gift}
                onChange={(next) => update({ gift: next })}
                addLabel="+ បន្ថែមគណនី"
                itemLabel="គណនី"
                makeEmpty={() => ({ bank: "", account: "", number: "", note: "", qrImage: "" })}
                fields={[
                    { key: "bank", label: "ធនាគារ", placeholder: "ឧ. ABA Bank" },
                    { key: "account", label: "ឈ្មោះគណនី", placeholder: "ឧ. VANN PISEY" },
                    { key: "number", label: "លេខគណនី", placeholder: "ឧ. 000 000 000" },
                    { key: "note", label: "សម្គាល់", placeholder: "ឧ. ABA PAY" },
                    { key: "qrImage", label: "តំណរូប QR (ស្រេចចិត្ត)", type: "url", wide: true, placeholder: "https://.../aba-qr.png" },
                ]}
            />

            <section className="wb-section">
                <div className="wb-section-head">
                    <span className="wb-section-kicker">Wish</span>
                    <h3>សារជូនពរភ្ញៀវ</h3>
                </div>
                <p className="wb-help">សារនេះបង្ហាញក្នុងផ្នែក «ជូនពរ» មុនសេចក្ដីអរគុណនៅចុងសន្លឹកការ។</p>
                <div className="wb-field">
                    <label htmlFor="wish-message">សារអញ្ជើញឱ្យភ្ញៀវជូនពរ</label>
                    <textarea
                        id="wish-message"
                        rows={4}
                        value={extras.guestNote || ""}
                        onChange={(e) => updateExtras({ guestNote: e.target.value })}
                        placeholder="សរសេរសារខ្លីៗសម្រាប់ភ្ញៀវ..."
                    />
                </div>
            </section>

            <RepeatableList
                kicker="FAQ"
                title="សំណួរញឹកញាប់ (ស្រេចចិត្ត)"
                help="បន្ថែមចម្លើយសម្រាប់ទីតាំង ការចតរថយន្ត សម្លៀកបំពាក់ ឬការនាំភ្ញៀវបន្ថែម។"
                items={faq}
                onChange={(next) => update({ faq: next })}
                addLabel="+ បន្ថែមសំណួរ"
                itemLabel="សំណួរ"
                makeEmpty={() => ({ q: "", a: "" })}
                fields={[
                    { key: "q", label: "សំណួរ", placeholder: "ឧ. តើមានកន្លែងចតរថយន្តទេ?" },
                    { key: "a", label: "ចម្លើយ", type: "textarea", rows: 3, wide: true, placeholder: "ឧ. មាន កន្លែងចតរថយន្តនៅខាងមុខសាល។" },
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
                    ["party", "Wedding party"],
                    ["dressCode", "Dress code"],
                    ["gift", "Gift"],
                    ["wish", "Wish / Guest blessing"],
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
        </div>
    );
}

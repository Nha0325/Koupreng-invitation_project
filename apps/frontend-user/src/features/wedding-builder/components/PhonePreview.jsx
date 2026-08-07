import { useEffect, useState } from "react";

import TemplateExperience from "../../templates/template-experience/TemplateExperience";
import { draftToTemplate } from "../utils/draftToTemplate";
import { loadGallery } from "../../../shared/storage/galleryStorage";
import { loadDraftMediaFiles } from "../../../shared/storage/draftMediaStorage";
import "../../templates/template-experience/template-experience.css";

/**
 * PhonePreview — live phone-shape preview for the wedding builder.
 *
 * Renders the SAME shared TemplateExperience engine that powers the public
 * /templates/:id pages, so what the host sees while editing matches the
 * published invitation exactly. The host's draft (names, date, venue, story,
 * dress code, music, uploaded gallery) is layered on top of the chosen
 * template via a merged `tpl` object; TemplateExperience's content builder
 * reads those real values and falls back to tasteful demo content for the
 * rest. Rendered in `preview` mode so the marketing chrome (breadcrumb, CTA
 * row, sticky bar, floating music) is hidden and it fits the phone frame.
 */
export default function PhonePreview({ draft }) {
    const [gallery, setGallery] = useState(null);
    const [draftMedia, setDraftMedia] = useState(null);

    useEffect(() => {
        if (!draft?.id) {
            return undefined;
        }

        let cancelled = false;
        const loadAndSet = () => {
            loadGallery(draft.id)
                .then((items) => {
                    if (!cancelled) setGallery(items);
                })
                .catch(() => {
                    if (!cancelled) setGallery([]);
                });
        };

        loadAndSet();

        // Reload when StoryGalleryStep uploads/removes images.
        const handler = (e) => {
            if (e.detail?.draftId === draft.id) loadAndSet();
        };
        window.addEventListener("gallery-updated", handler);
        return () => {
            cancelled = true;
            window.removeEventListener("gallery-updated", handler);
        };
    }, [draft?.id, draft?.galleryUpdatedAt]);

    useEffect(() => {
        if (!draft?.id) return undefined;
        let cancelled = false;
        let objectUrls = [];

        const loadMedia = () => {
            objectUrls.forEach((url) => URL.revokeObjectURL(url));
            objectUrls = [];
            loadDraftMediaFiles(draft.id)
                .then((records) => {
                    if (cancelled) return;
                    const previews = {};
                    Object.entries(records).forEach(([kind, record]) => {
                        if (!record?.file) return;
                        const url = URL.createObjectURL(record.file);
                        objectUrls.push(url);
                        previews[kind] = { ...record, url };
                    });
                    setDraftMedia(previews);
                })
                .catch(() => {
                    if (!cancelled) setDraftMedia({});
                });
        };

        loadMedia();
        const handler = (event) => {
            if (event.detail?.draftId === draft.id) loadMedia();
        };
        window.addEventListener("draft-media-updated", handler);
        return () => {
            cancelled = true;
            window.removeEventListener("draft-media-updated", handler);
            objectUrls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [draft?.id]);

    if (!draft?.id || gallery === null || draftMedia === null) {
        return (
            <div className="wb-phone-preview">
                <div className="wb-phone-frame">
                    <div className="wb-phone-scroll">
                        <div style={{ padding: 24, textAlign: "center", color: "#7d6443", fontSize: 12 }}>
                            កំពុងផ្ទុក...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const previewDraft = {
        ...draft,
        coverImage: draftMedia.cover?.url || draft.coverImage,
        openingVideo: draftMedia.openingVideo
            ? { id: "pending-opening-video", name: draftMedia.openingVideo.name, url: draftMedia.openingVideo.url }
            : draft.openingVideo,
        music: draftMedia.music
            ? { id: "pending-music", name: draftMedia.music.name, url: draftMedia.music.url }
            : draft.music,
    };
    const merged = draftToTemplate(previewDraft, gallery);

    if (!merged) {
        return (
            <div className="wb-phone-preview">
                <div className="wb-phone-frame">
                    <div className="wb-phone-scroll">
                        <div style={{ padding: 24, textAlign: "center", color: "#7d6443", fontSize: 12 }}>
                            មិនអាចបង្ហាញគំរូ
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wb-phone-preview">
            <div className="wb-phone-frame">
                <div className="wb-phone-scroll">
                    <TemplateExperience
                        tpl={merged.tpl}
                        variant={merged.variant}
                        useTemplateLink={`/create/wedding/${draft.id}`}
                        preview
                    />
                </div>
            </div>
        </div>
    );
}

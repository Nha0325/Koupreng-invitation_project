import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDraft } from "../services/weddingStorage";
import { loadGallery } from "../services/galleryStorage";
import { getTemplateById } from "../features/templates/data/templatesData";
import WeddingSite from "../features/wedding-site/WeddingSite";

/**
 * WeddingPreviewPage — renders the user's wedding draft as a full
 * invitation page using the chosen template's visual.
 * Mounted on /preview/:draftId.
 */
export default function WeddingPreviewPage() {
    const { draftId } = useParams();
    const draft = getDraft(draftId);
    const [gallery, setGallery] = useState(null); // null = loading, [] = loaded but empty

    useEffect(() => {
        if (draftId) {
            console.log("WeddingPreviewPage: loading gallery for draft", draftId);
            loadGallery(draftId)
                .then((items) => {
                    console.log("WeddingPreviewPage: loaded", items.length, "items");
                    setGallery(items);
                })
                .catch((err) => {
                    console.error("WeddingPreviewPage: failed to load gallery", err);
                    setGallery([]);
                });
        } else {
            setGallery([]);
        }
    }, [draftId]);

    if (!draft) {
        return (
            <div style={{ padding: 80, textAlign: "center" }}>
                <h2>មិនរកឃើញ Draft</h2>
                <p style={{ color: "#777", marginTop: 12 }}>
                    Draft ID: {draftId}
                </p>
                <Link
                    to="/create/wedding"
                    className="wb-btn wb-btn-primary"
                    style={{ marginTop: 16, display: "inline-block" }}
                >
                    ចាប់ផ្ដើមថ្មី
                </Link>
            </div>
        );
    }

    // Wait for gallery to load before rendering
    if (gallery === null) {
        return (
            <div style={{ padding: 80, textAlign: "center", color: "#7d6443" }}>
                កំពុងផ្ទុក...
            </div>
        );
    }

    const baseTpl = getTemplateById(draft.templateId);
    const tpl = mergeDraftIntoTemplate(baseTpl, draft, gallery);

    return <WeddingSite tpl={tpl} showBack={false} />;
}

/**
 * Merge user-entered draft data on top of the chosen template's
 * defaults so the preview shows real values where provided.
 */
function mergeDraftIntoTemplate(tpl, draft, gallery) {
    const dateText = draft.event.date || tpl.dateText;
    const targetDate = draft.event.date
        ? new Date(`${draft.event.date}T${draft.event.ceremonyTime || "17:00"}:00`)
        : tpl.targetDate;

    const classNames = ["tpl-gallery-a", "tpl-gallery-b", "tpl-gallery-c", "tpl-gallery-d"];
    const storyImages = gallery.length > 0
        ? gallery.map((item, i) => ({
            id: item.id,
            src: item.preview,
            alt: item.name,
            type: item.type,
            className: classNames[i % classNames.length],
        }))
        : tpl.storyImages;

    return {
        ...tpl,
        groom: draft.couple.groom || tpl.groom,
        bride: draft.couple.bride || tpl.bride,
        dateText,
        targetDate,
        ceremonyTime: draft.event.ceremonyTime || tpl.ceremonyTime,
        receptionTime: draft.event.receptionTime || tpl.receptionTime,
        venueName: draft.event.venueName || tpl.venueName,
        venueAddress: draft.event.venueAddress || tpl.venueAddress,
        story: draft.story || tpl.story,
        storyImages,
        dressCode: draft.dressCode,
        music: draft.music,
    };
}

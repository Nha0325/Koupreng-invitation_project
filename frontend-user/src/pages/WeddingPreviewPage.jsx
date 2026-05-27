/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import WeddingSite from "../features/wedding-site/WeddingSite";
import { useWeddingStore } from "../stores/useWeddingStore";
import { loadGallery } from "../services/galleryStorage";
import { getTemplateById } from "../features/templates/data/templatesData";

/**
 * WeddingPreviewPage — renders the user's wedding draft as a full
 * invitation page using the chosen template's visual.
 * Mounted on /preview/:draftId.
 */
export default function WeddingPreviewPage() {
    const { draftId } = useParams();
    const location = useLocation();

    const draft = useWeddingStore((state) => state.draft);
    const loadDraft = useWeddingStore((state) => state.loadDraft);
    const error = useWeddingStore((state) => state.error);

    const [gallery, setGallery] = useState(null); // null = loading, [] = loaded but empty
    const activeDraft = draft?.id === draftId ? draft : null;

    useEffect(() => {
        if (!draftId) {
            setGallery([]);
            return;
        }

        setGallery(null);

        const loadedDraft = loadDraft(draftId);

        if (!loadedDraft) {
            setGallery([]);
            return;
        }

        loadGallery(draftId)
            .then(setGallery)
            .catch((err) => {
                console.error("Failed to load gallery", err);
                setGallery([]);
            });
    }, [draftId, loadDraft]);

    const tpl = useMemo(() => {
        if (!activeDraft || gallery === null) return null;

        const baseTpl = getTemplateById(activeDraft.templateId);
        if (!baseTpl) return null;

        return mergeDraftIntoTemplate(baseTpl, activeDraft, gallery);
     }, [activeDraft, gallery]);

    if (gallery === null) {
        return (
            <div style={{ padding: 80, textAlign: "center", color: "#7d6443" }}>
                កំពុងផ្ទុក...
            </div>
        );
    }

    if (error || !activeDraft?.id || !tpl) {
        return (
            <div style={{ padding: 80, textAlign: "center" }}>
                <h2>មិនរកឃើញ Draft</h2>

                <p style={{color: "#777", marginTop: 12 }}>
                    Draft ID: {draftId}
                </p>

                <Link 
                    to="/create/wedding" 
                    className="wb-btn" 
                    style={{ marginTop: 16, display: "inline-block" }}>
                        ចាប់ផ្ដើមថ្មី
                </Link>
            </div>    
        );
    }

    const shouldBackToDashboard = location.state?.backTo === "/dashboard";

    return (
        <WeddingSite
            tpl={tpl}
            showBack={shouldBackToDashboard}
            skipIntro
            backTo="/dashboard"
            backLabel="← ផ្ទាំងគ្រប់គ្រង"
        />
    );
}

/**
 * Merge user-entered draft data on top of the chosen template's
 * defaults so the preview shows real values where provided.
 */
function mergeDraftIntoTemplate(tpl, draft, gallery) {
    const event = draft.event || {};
    const couple = draft.couple || {};

    const dateText = event.date || tpl.dateText;

    const targetDate = event.date
        ? new Date(`${event.date}T${event.ceremonyTime || "17:00"}:00`)
        : tpl.targetDate;

    const classNames = [
        "tpl-gallery-a", 
        "tpl-gallery-b", 
        "tpl-gallery-c", 
        "tpl-gallery-d"
    ];

    const storyImages = 
    gallery.length > 0 
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
        groom: couple.groom || tpl.groom,
        bride: couple.bride || tpl.bride,
        dateText,
        targetDate,
        ceremonyTime: event.ceremonyTime || tpl.ceremonyTime,
        receptionTime: event.receptionTime || tpl.receptionTime,
        venueName: event.venueName || tpl.venueName,
        venueAddress: event.venueAddress || tpl.venueAddress,
        story: draft.story || tpl.story,
        storyImages,
        dressCode: draft.dressCode || tpl.dressCode,
        music: draft.music || tpl.music,
        openingVideo: draft.openingVideoEnabled ? draft.openingVideo : tpl.openingVideo,
    };
}

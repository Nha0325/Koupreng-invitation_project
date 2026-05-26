/* eslint-disable react-hooks/set-state-in-effect */
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import WeddingSite from "../features/wedding-site/WeddingSite";
import { getTemplateById } from "../features/templates/data/templatesData";
import { useWeddingStore } from "../stores/useWeddingStore";
import { loadGallery } from "../services/galleryStorage";


/**
 * PublicInvitationPage — public wedding invitation viewer.
 * Mounted on /w/:slug.
 *
 * Looks up a draft by its slug from localStorage. If none is found
 * it falls back to the slug as a templateId for demo purposes.
 */
export default function PublicInvitationPage() {
    const { slug } = useParams();
    const location = useLocation();

    const draft = useWeddingStore((state) => state.draft);
    const loadDraftBySlug = useWeddingStore((state) => state.loadDraftBySlug);
    const loading = useWeddingStore((state) => state.loading);
    const [gallery, setGallery] = useState(null);
    const activeDraft = draft?.slug === slug ? draft : null;
    const shouldBackToDashboard = location.state?.backTo === "/dashboard";
    const backProps = shouldBackToDashboard
        ? { showBack: true, backTo: "/dashboard", backLabel: "← ផ្ទាំងគ្រប់គ្រង" }
        : { showBack: false };

    useEffect(() => {
        if (!slug) {
            setGallery([]);
            return;
        }

        setGallery(null);
        const loadedDraft = loadDraftBySlug(slug);

        if (!loadedDraft?.id) {
            setGallery([]);
            return;
        }

        loadGallery(loadedDraft.id)
            .then(setGallery)
            .catch(() => setGallery([]));
    }, [slug, loadDraftBySlug]);

    const tpl = useMemo(() => {
        if (!activeDraft?.id || gallery === null) return null;

        const baseTpl = getTemplateById(activeDraft.templateId);
        const event = activeDraft.event || {};
        const couple = activeDraft.couple || {};
        const classNames = ["tpl-gallery-a", "tpl-gallery-b", "tpl-gallery-c", "tpl-gallery-d"];
        const storyImages = gallery.length > 0
            ? gallery.map((item, i) => ({
                id: item.id,
                src: item.preview,
                alt: item.name,
                type: item.type,
                className: classNames[i % classNames.length],
            }))
            : baseTpl.storyImages;

        return {
            ...baseTpl,
            groom: couple.groom || baseTpl.groom,
            bride: couple.bride || baseTpl.bride,
            dateText: event.date || baseTpl.dateText,
            ceremonyTime: event.ceremonyTime || baseTpl.ceremonyTime,
            receptionTime: event.receptionTime || baseTpl.receptionTime,
            venueName: event.venueName || baseTpl.venueName,
            venueAddress: event.venueAddress || baseTpl.venueAddress,
            story: activeDraft.story || baseTpl.story,
            storyImages,
            dressCode: activeDraft.dressCode || baseTpl.dressCode,
            music: activeDraft.music || baseTpl.music,
            openingVideo: activeDraft.openingVideo || baseTpl.openingVideo,
        };
    }, [activeDraft, gallery]);

    if (loading || (activeDraft?.id && gallery === null)) {
        return (
            <div style={{ padding: 80, textAlign: "center", color: "#7d6443" }}>
                កំពុងផ្ទុក...
            </div>
         );
    }

    if (!activeDraft?.id) {
        const fallbackTpl = getTemplateById(slug);
        return <WeddingSite tpl={fallbackTpl} {...backProps} />;
    }

    return <WeddingSite tpl={tpl} {...backProps} />;
}

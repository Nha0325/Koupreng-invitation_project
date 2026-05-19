import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDraftBySlug } from "../services/weddingStorage";
import { loadGallery } from "../services/galleryStorage";
import { getTemplateById } from "../features/templates/data/templatesData";
import WeddingSite from "../features/wedding-site/WeddingSite";

/**
 * PublicInvitationPage — public wedding invitation viewer.
 * Mounted on /w/:slug.
 *
 * Looks up a draft by its slug from localStorage. If none is found
 * it falls back to the slug as a templateId for demo purposes.
 */
export default function PublicInvitationPage() {
    const { slug } = useParams();
    const draft = getDraftBySlug(slug);
    const [gallery, setGallery] = useState(null);

    useEffect(() => {
        if (draft?.id) {
            loadGallery(draft.id)
                .then(setGallery)
                .catch(() => setGallery([]));
        } else {
            setGallery([]);
        }
    }, [draft?.id]);

    if (draft && gallery === null) {
        return (
            <div style={{ padding: 80, textAlign: "center", color: "#7d6443" }}>
                កំពុងផ្ទុក...
            </div>
        );
    }

    if (draft) {
        const baseTpl = getTemplateById(draft.templateId);
        const classNames = ["tpl-gallery-a", "tpl-gallery-b", "tpl-gallery-c", "tpl-gallery-d"];
        const storyImages = (gallery && gallery.length > 0)
            ? gallery.map((item, i) => ({
                id: item.id,
                src: item.preview,
                alt: item.name,
                type: item.type,
                className: classNames[i % classNames.length],
            }))
            : baseTpl.storyImages;

        const tpl = {
            ...baseTpl,
            groom: draft.couple.groom || baseTpl.groom,
            bride: draft.couple.bride || baseTpl.bride,
            dateText: draft.event.date || baseTpl.dateText,
            ceremonyTime: draft.event.ceremonyTime || baseTpl.ceremonyTime,
            receptionTime: draft.event.receptionTime || baseTpl.receptionTime,
            venueName: draft.event.venueName || baseTpl.venueName,
            venueAddress: draft.event.venueAddress || baseTpl.venueAddress,
            story: draft.story || baseTpl.story,
            storyImages,
            dressCode: draft.dressCode,
            music: draft.music,
        };
        return <WeddingSite tpl={tpl} showBack={false} />;
    }

    // Fallback: treat slug as a template id for demo.
    const tpl = getTemplateById(slug);
    return <WeddingSite tpl={tpl} showBack={false} />;
}

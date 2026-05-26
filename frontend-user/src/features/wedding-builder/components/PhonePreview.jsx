import { useEffect, useState } from "react";
import RoyalInvitation from "../../wedding-site/RoyalInvitation";
import { getTemplateById } from "../../templates/data/templatesData";
import useCountdown from "../../wedding-site/hooks/useCountdown";
import { loadGallery } from "../../../services/galleryStorage";

/**
 * Live phone-shape preview that renders the full RoyalInvitation
 * with the user's current draft (names, location, images, videos).
 * Same content as the published page, sized for a phone frame.
 */
export default function PhonePreview({ draft }) {
    const [gallery, setGallery] = useState(null);

    useEffect(() => {
        if (!draft?.id) {
            return;
        }

        let cancelled = false;
        const loadAndSet = () => {
            loadGallery(draft.id)
                .then((items) => {
                    if (cancelled) return;
                    console.log("PhonePreview: loaded", items.length, "gallery items for", draft.id);
                    setGallery(items);
                })
                .catch(() => {
                    if (!cancelled) setGallery([]);
                });
        };

        loadAndSet();

        // Listen for gallery updates from StoryGalleryStep
        const handler = (e) => {
            if (e.detail?.draftId === draft.id) {
                console.log("PhonePreview: gallery-updated event received, reloading");
                loadAndSet();
            }
        };
        window.addEventListener("gallery-updated", handler);
        return () => {
            cancelled = true;
            window.removeEventListener("gallery-updated", handler);
        };
    }, [draft?.id, draft?.galleryUpdatedAt]);

    const baseTpl = getTemplateById(draft?.templateId) || {};
    const targetDate = draft?.event?.date
        ? new Date(`${draft.event.date}T${draft.event.ceremonyTime || "17:00"}:00`)
        : baseTpl.targetDate;
    const countdown = useCountdown(targetDate);

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
        groom: draft?.couple?.groom || baseTpl.groom,
        bride: draft?.couple?.bride || baseTpl.bride,
        dateText: draft?.event?.date || baseTpl.dateText,
        targetDate,
        ceremonyTime: draft?.event?.ceremonyTime || baseTpl.ceremonyTime,
        receptionTime: draft?.event?.receptionTime || baseTpl.receptionTime,
        venueName: draft?.event?.venueName || baseTpl.venueName,
        venueAddress: draft?.event?.venueAddress || baseTpl.venueAddress,
        story: draft?.story || baseTpl.story,
        storyImages,
        dressCode: draft?.dressCode,
        music: draft?.music,
        openingVideo: draft?.openingVideo || baseTpl.openingVideo,
    };

    if (!draft?.id) {
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

    return (
        <div className="wb-phone-preview">
            <div className="wb-phone-frame">
                <div className="wb-phone-scroll">
                    {gallery === null ? (
                        <div style={{ padding: 24, textAlign: "center", color: "#7d6443", fontSize: 12 }}>
                            កំពុងផ្ទុក...
                        </div>
                    ) : (
                        <RoyalInvitation tpl={tpl} countdown={countdown} mode="phone" />
                    )}
                </div>
            </div>
        </div>
    );
}

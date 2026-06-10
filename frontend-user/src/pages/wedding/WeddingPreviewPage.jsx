/* eslint-disable react-hooks/set-state-in-effect */
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import TemplateExperience from "../../features/templates/template-experience/TemplateExperience";
import { draftToTemplate } from "../../features/wedding-builder/utils/draftToTemplate";
import { useWeddingStore } from "../../stores/useWeddingStore";
import { loadGallery } from "../../services/galleryStorage";
import "../../features/templates/template-experience/template-experience.css";

/**
 * WeddingPreviewPage — renders the user's wedding draft as a full invitation
 * page using the SAME shared TemplateExperience engine that powers the public
 * /templates/:id pages and the builder's live phone preview. This keeps the
 * dashboard "មើលជាមុន" preview visually identical to the templates UI.
 *
 * Mounted on /preview/:draftId and /event/:draftId.
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

    const merged = useMemo(() => {
        if (!activeDraft || gallery === null) return null;
        return draftToTemplate(activeDraft, gallery);
    }, [activeDraft, gallery]);

    if (gallery === null) {
        return (
            <div style={{ padding: 80, textAlign: "center", color: "#7d6443" }}>
                កំពុងផ្ទុក...
            </div>
        );
    }

    if (error || !activeDraft?.id || !merged) {
        return (
            <div style={{ padding: 80, textAlign: "center" }}>
                <h2>មិនរកឃើញ Draft</h2>

                <p style={{ color: "#777", marginTop: 12 }}>
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

    const backTo = location.state?.backTo || "/dashboard";
    const backLabel = backTo === "/events" ? "ត្រឡប់ទៅកម្មវិធី" : "ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង";
    const startCrumb =
        backTo === "/events"
            ? { label: "កម្មវិធី", to: "/events" }
            : { label: "ផ្ទាំងគ្រប់គ្រង", to: "/dashboard" };

    return (
        <TemplateExperience
            tpl={merged.tpl}
            variant={merged.variant}
            useTemplateLink={`/create/wedding/${activeDraft.id}`}
            primaryCtaLabel="កែសម្រួលសន្លឹកការ"
            breadcrumbItems={[
                startCrumb,
                { label: "មើលជាមុន" },
            ]}
            backLink={backTo}
            backLabel={backLabel}
        />
    );
}

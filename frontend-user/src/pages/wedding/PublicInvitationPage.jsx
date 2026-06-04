/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams, useSearchParams } from "react-router-dom";

import InvitationDisplay from "../../features/invitations/InvitationDisplay";
import PublicRsvpForm from "../../features/invitations/PublicRsvpForm";
import "../../features/invitations/InvitationPages.css";
import TemplateExperience from "../../features/templates/template-experience/TemplateExperience";
import WeddingSite from "../../features/wedding-site/WeddingSite";
import { getTemplateById } from "../../features/templates/data/templatesData";
import { draftToTemplate } from "../../features/wedding-builder/utils/draftToTemplate";
import { useWeddingStore } from "../../stores/useWeddingStore";
import { loadGallery } from "../../services/galleryStorage";
import { invitationService } from "../../shared/services/invitationService";
import { mediaService } from "../../shared/services/mediaService";

export default function PublicInvitationPage() {
    const { slug } = useParams();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const inviteToken = searchParams.get("token") || searchParams.get("i");
    const [invitation, setInvitation] = useState(null);
    const [media, setMedia] = useState(null);
    const [remoteLoading, setRemoteLoading] = useState(true);
    const [remoteError, setRemoteError] = useState("");
    const draft = useWeddingStore((state) => state.draft);
    const loadDraft = useWeddingStore((state) => state.loadDraft);
    const loadDraftBySlug = useWeddingStore((state) => state.loadDraftBySlug);
    const localLoading = useWeddingStore((state) => state.loading);
    const [gallery, setGallery] = useState(null);
    const activeDraft = draft?.slug === slug || draft?.id === slug ? draft : null;
    const shouldBackToDashboard = location.state?.backTo === "/dashboard";
    const backProps = shouldBackToDashboard
        ? { showBack: true, backTo: "/dashboard", backLabel: "← ផ្ទាំងគ្រប់គ្រង" }
        : { showBack: false };

    useEffect(() => {
        if (!slug) {
            setInvitation(null);
            setMedia(null);
            setRemoteError("Invitation not available.");
            setRemoteLoading(false);
            return;
        }

        let active = true;
        setRemoteLoading(true);
        setRemoteError("");
        setInvitation(null);
        setMedia(null);

        Promise.all([
            invitationService.publicBySlug(slug),
            mediaService.publicBySlug(slug).catch(() => null),
        ])
            .then(([invitationData, mediaData]) => {
                if (active) {
                    setInvitation(invitationData);
                    setMedia(mediaData);
                    setRemoteError("");
                }
            })
            .catch((err) => {
                if (active) {
                    setRemoteError(err?.status === 403 ? "This invitation requires a password." : "Invitation not available.");
                }
            })
            .finally(() => {
                if (active) {
                    setRemoteLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [slug]);

    useEffect(() => {
        if (!slug) {
            setGallery([]);
            return;
        }

        setGallery(null);
        let loadedDraft = loadDraftBySlug(slug);
        if (!loadedDraft?.id) {
            loadedDraft = loadDraft(slug);
        }

        if (!loadedDraft?.id) {
            setGallery([]);
            return;
        }

        loadGallery(loadedDraft.id)
            .then(setGallery)
            .catch(() => setGallery([]));
    }, [slug, loadDraft, loadDraftBySlug]);

    const merged = useMemo(() => {
        if (!activeDraft?.id || gallery === null) return null;

        const templateId = activeDraft.templateId || getTemplateById(activeDraft.templateId).id;
        return draftToTemplate({ ...activeDraft, templateId }, gallery);
    }, [activeDraft, gallery]);

    if (remoteLoading) {
        return <div className="public-state">Loading invitation...</div>;
    }

    if (invitation) {
        return (
            <InvitationDisplay invitation={invitation} media={media}>
                <PublicRsvpForm slug={slug} inviteToken={inviteToken} />
            </InvitationDisplay>
        );
    }

    if (remoteError === "This invitation requires a password.") {
        return (
            <main className="public-state">
                <h1>Invitation not available</h1>
                <p>{remoteError}</p>
            </main>
        );
    }

    if (localLoading || (activeDraft?.id && gallery === null)) {
        return (
            <div style={{ padding: 80, textAlign: "center", color: "#7d6443" }}>
                កំពុងផ្ទុក...
            </div>
        );
    }

    if (activeDraft?.id && merged) {
        return (
            <TemplateExperience
                tpl={merged.tpl}
                variant={merged.variant}
                useTemplateLink={shouldBackToDashboard ? `/create/wedding/${activeDraft.id}` : ""}
                primaryCtaLabel="កែសម្រួលសន្លឹកការ"
                breadcrumbItems={[
                    { label: "ផ្ទាំងគ្រប់គ្រង", to: "/dashboard" },
                    { label: "ចម្លងតំណភ្ជាប់" },
                ]}
                backLink="/dashboard"
                backLabel="ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង"
                showBreadcrumb={shouldBackToDashboard}
                showActions={shouldBackToDashboard}
                showStickyCta={shouldBackToDashboard}
            />
        );
    }

    const fallbackTpl = getTemplateById(slug);

    if (fallbackTpl.id === slug) {
        return <WeddingSite tpl={fallbackTpl} {...backProps} />;
    }

    return (
        <main className="public-state">
            <h1>Invitation not available</h1>
            <p>{remoteError || "This invitation may be unpublished or unavailable."}</p>
        </main>
    );
}

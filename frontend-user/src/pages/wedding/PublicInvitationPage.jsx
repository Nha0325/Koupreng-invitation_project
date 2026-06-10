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

const GARDEN_TEMPLATE_ID = "garden-royal-khmer-wedding";

function isGardenRoyalTemplate(invitation) {
    return invitation?.templateName === "Garden Royal Khmer Wedding";
}

function timeValue(value) {
    return value ? String(value).slice(0, 5) : "";
}

function safeJson(value, fallback = {}) {
    if (!value) return fallback;
    if (typeof value === "object") return value;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function publicInvitationToTemplate(invitation, media) {
    const baseTpl = getTemplateById(GARDEN_TEMPLATE_ID);
    const content = safeJson(invitation.contentJson);
    const enabled = safeJson(invitation.enabledSections);
    const contentCouple = content.couple || {};
    const contentEvent = content.event || {};
    const storyChapters = Array.isArray(content.storyChapters) ? content.storyChapters : [];
    const schedule = Array.isArray(content.schedule) ? content.schedule : [];
    const gift = Array.isArray(content.gift) ? content.gift : [];
    const faq = Array.isArray(content.faq) ? content.faq : [];
    const party = Array.isArray(content.party) ? content.party : [];
    const storyText = content.story || invitation.storyText || "";
    const gallery = (media?.galleryImages || [])
        .filter((item) => item?.fileUrl)
        .map((item) => ({
            id: item.id,
            name: item.originalFilename,
            type: item.mimeType?.startsWith("video/") ? "video" : "image",
            preview: item.fileUrl,
        }));
    const eventTime = timeValue(invitation.eventTime);
    const draft = {
        id: invitation.slug,
        slug: invitation.slug,
        templateId: baseTpl.id,
        coverImage: media?.coverImage?.fileUrl || "",
        couple: {
            ...contentCouple,
            groom: contentCouple.groom || invitation.groomName || invitation.hostName || "",
            bride: contentCouple.bride || invitation.brideName || invitation.partnerName || "",
        },
        event: {
            ...contentEvent,
            title: contentEvent.title || invitation.title || "",
            date: contentEvent.date || invitation.eventDate || "",
            ceremonyTime: contentEvent.ceremonyTime || eventTime,
            receptionTime: contentEvent.receptionTime || eventTime,
            venueName: contentEvent.venueName || invitation.venueName || "",
            venueAddress: contentEvent.venueAddress || invitation.venueAddress || "",
            mapLink: contentEvent.mapLink || invitation.googleMapUrl || "",
        },
        contact: content.contact || {},
        message: content.message || invitation.title || "",
        story: storyText,
        storyChapters,
        schedule,
        party,
        gift,
        faq,
        gallery: gallery.length ? gallery : content.gallery || [],
        music: media?.backgroundMusic?.fileUrl ? { url: media.backgroundMusic.fileUrl } : baseTpl.music,
        rsvp: { ...(content.rsvp || {}), enabled: enabled.rsvp !== false, deadline: content.rsvp?.deadline || invitation.rsvpDeadline || "" },
        extras: content.extras || {},
        enabledSections: {
            ...enabled,
            story: enabled.story !== false && Boolean(storyText || storyChapters.length),
            gallery: enabled.gallery !== false && Boolean(gallery.length || content.gallery?.length),
            schedule: enabled.schedule !== false && schedule.length > 0,
            party: enabled.party !== false && party.length > 0,
            gift: enabled.gift !== false && gift.length > 0,
            faq: enabled.faq !== false && faq.length > 0,
            rsvp: enabled.rsvp !== false,
        },
    };

    return draftToTemplate(draft, gallery);
}

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
            invitationService.publicBySlug(slug, inviteToken),
            mediaService.publicBySlug(slug, inviteToken).catch(() => null),
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
    }, [slug, inviteToken]);

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

    if (invitation && isGardenRoyalTemplate(invitation)) {
        const mergedPublic = publicInvitationToTemplate(invitation, media);

        if (mergedPublic) {
            return (
                <TemplateExperience
                    tpl={mergedPublic.tpl}
                    variant={GARDEN_TEMPLATE_ID}
                    showActions={false}
                    showBreadcrumb={false}
                    showStickyCta={false}
                >
                    <PublicRsvpForm slug={slug} inviteToken={inviteToken} />
                </TemplateExperience>
            );
        }
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
            >
                {activeDraft.rsvp?.enabled !== false && activeDraft.enabledSections?.rsvp !== false && (
                    <PublicRsvpForm slug={slug} inviteToken={inviteToken} />
                )}
            </TemplateExperience>
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

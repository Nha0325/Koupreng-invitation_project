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
    const [protectedMode, setProtectedMode] = useState(false);
    const [verifiedAccessToken, setVerifiedAccessToken] = useState("");
    const [verifyingAccess, setVerifyingAccess] = useState(false);
    const draft = useWeddingStore((state) => state.draft);
    const loadDraft = useWeddingStore((state) => state.loadDraft);
    const loadDraftBySlug = useWeddingStore((state) => state.loadDraftBySlug);
    const localLoading = useWeddingStore((state) => state.loading);
    const [gallery, setGallery] = useState(null);
    const activeDraft = draft?.slug === slug || draft?.id === slug ? draft : null;
    const shouldBackToDashboard = location.state?.backTo === "/dashboard";
    const queryAccessToken = searchParams.get("accessToken") || "";
    const accessStorageKey = slug ? `koupreng_invitation_access_${slug}` : "";
    const effectiveAccessToken = queryAccessToken || verifiedAccessToken;
    const backProps = shouldBackToDashboard
        ? { showBack: true, backTo: "/dashboard", backLabel: "← ផ្ទាំងគ្រប់គ្រង" }
        : { showBack: false };

    useEffect(() => {
        setVerifiedAccessToken(slug ? sessionStorage.getItem(`koupreng_invitation_access_${slug}`) || "" : "");
        setProtectedMode(false);
    }, [slug]);

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
        setProtectedMode(false);
        setInvitation(null);
        setMedia(null);
        const publicParams = {
            accessToken: effectiveAccessToken,
            token: inviteToken,
        };

        Promise.all([
            invitationService.publicBySlug(slug, publicParams),
            mediaService.publicBySlug(slug, publicParams).catch(() => null),
        ])
            .then(([invitationData, mediaData]) => {
                if (active) {
                    setInvitation(invitationData);
                    setMedia(mediaData);
                    setRemoteError("");
                    setProtectedMode(false);
                }
            })
            .catch((err) => {
                if (active) {
                    const protectedError = err?.status === 403;
                    setProtectedMode(protectedError);
                    setRemoteError(protectedError ? (err?.message || "This invitation requires access.") : "Invitation not available.");
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
    }, [slug, inviteToken, effectiveAccessToken]);

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

    const verifyAccess = async (password) => {
        setVerifyingAccess(true);
        setRemoteError("");
        try {
            const response = await invitationService.verifyPublicAccess(slug, {
                password,
                inviteToken,
                accessToken: effectiveAccessToken,
            });
            if (response?.accessToken) {
                sessionStorage.setItem(accessStorageKey, response.accessToken);
                setVerifiedAccessToken(response.accessToken);
            }
            setProtectedMode(false);
        } catch (err) {
            setRemoteError(err?.message || "Could not verify invitation access.");
        } finally {
            setVerifyingAccess(false);
        }
    };

    if (invitation) {
        let templateSlug = null;
        if (invitation.designJson) {
            try {
                const design = JSON.parse(invitation.designJson);
                templateSlug = design.templateId;
            } catch (e) {
                // Ignore
            }
        }
        if (!templateSlug && invitation.contentJson) {
            try {
                const content = JSON.parse(invitation.contentJson);
                templateSlug = content.templateId;
            } catch (e) {
                // Ignore
            }
        }

        if (templateSlug) {
            let content = {};
            try {
                content = invitation.contentJson ? JSON.parse(invitation.contentJson) : {};
            } catch (e) {
                // Ignore
            }

            const reconstructedDraft = {
                id: invitation.id,
                templateId: templateSlug,
                couple: content.couple || {
                    groom: invitation.groomName,
                    bride: invitation.brideName,
                },
                event: content.event || {
                    title: invitation.title,
                    date: invitation.eventDate,
                    ceremonyTime: invitation.eventTime,
                    receptionTime: invitation.eventTime,
                    venueName: invitation.venueName,
                    venueAddress: invitation.venueAddress,
                    mapLink: invitation.googleMapUrl,
                },
                contact: content.contact || {},
                message: content.message || invitation.storyText || "",
                story: content.story || invitation.storyText || "",
                storyChapters: content.storyChapters || [],
                schedule: content.schedule || [],
                party: content.party || [],
                gift: content.gift || [],
                faq: content.faq || [],
                extras: content.extras || {},
                rsvp: content.rsvp || {
                    deadline: invitation.rsvpDeadline,
                },
            };

            const galleryFromMedia = (media?.galleryImages || [])
                .filter((item) => item?.fileUrl)
                .map((item) => ({
                    preview: item.fileUrl,
                    type: "image",
                }));

            const mergedForPublished = draftToTemplate(reconstructedDraft, galleryFromMedia);
            if (mergedForPublished) {
                if (media?.coverImage?.fileUrl) {
                    mergedForPublished.tpl.customMainImage = media.coverImage.fileUrl;
                }
                if (media?.backgroundMusic?.fileUrl) {
                    mergedForPublished.tpl.music = { url: media.backgroundMusic.fileUrl };
                }

                return (
                    <TemplateExperience
                        tpl={mergedForPublished.tpl}
                        variant={mergedForPublished.variant}
                        showBreadcrumb={false}
                        showActions={false}
                        showStickyCta={true}
                    >
                        <PublicRsvpForm
                            slug={slug}
                            inviteToken={inviteToken}
                            accessToken={effectiveAccessToken}
                            languageMode={invitation.languageMode}
                        />
                    </TemplateExperience>
                );
            }
        }

        return (
            <InvitationDisplay invitation={invitation} media={media}>
                <PublicRsvpForm
                    slug={slug}
                    inviteToken={inviteToken}
                    accessToken={effectiveAccessToken}
                    languageMode={invitation.languageMode}
                />
            </InvitationDisplay>
        );
    }

    if (protectedMode) {
        return (
            <ProtectedInvitationGate
                error={remoteError}
                loading={verifyingAccess}
                onSubmit={verifyAccess}
            />
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

function ProtectedInvitationGate({ error, loading, onSubmit }) {
    const [password, setPassword] = useState("");

    return (
        <main className="public-state protected-gate">
            <form
                className="protected-gate-card"
                onSubmit={(event) => {
                    event.preventDefault();
                    onSubmit(password);
                }}
            >
                <p className="pub-kicker">Private invitation</p>
                <h1>Enter invitation password</h1>
                <p>This invitation is protected. Use the password or open a guest-specific invitation link.</p>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </label>
                {error && <div className="inv-error">{error}</div>}
                <button className="inv-primary-btn" type="submit" disabled={loading}>
                    {loading ? "Checking..." : "Open invitation"}
                </button>
            </form>
        </main>
    );
}

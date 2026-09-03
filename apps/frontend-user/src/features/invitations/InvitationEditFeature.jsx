import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import InvitationForm from "./InvitationForm";
import { invitationService } from "@/features/invitations/api/invitationApi";
import { getDraft, listDrafts } from "@/shared/storage/weddingStorage";
import { getTemplateById } from "../templates/data/templatesData";
import { useBackendMessages } from "@/shared/i18n/useBackendMessages";
import "@/features/events/EventsFeature.css";

export default function InvitationEditPage() {
    const { id } = useParams();
    const { text: t } = useBackendMessages("invitations");
    const [invitation, setInvitation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        const loadData = async () => {
            const targetId = id || listDrafts()[0]?.id;
            const localDraft = targetId ? getDraft(targetId) : null;

            // 1. Check local wedding draft storage first
            if (localDraft) {
                const chosenTemplateId = localDraft.templateId || "garden-royal-khmer-wedding";
                const tpl = getTemplateById(chosenTemplateId);
                const cover = localDraft.coverImage || tpl?.phoneCoverImage || tpl?.mainImage || "/facebook/all/03-card/cover-card.jpg";

                const designPayload = {
                    coverImage: cover,
                    frontColor: localDraft.frontColor || "#f9af59",
                    bottomColor: localDraft.bottomColor || "#B08E4F",
                    templateId: chosenTemplateId,
                    musicUrl: localDraft.musicUrl || (typeof tpl?.music === "string" ? tpl.music : tpl?.music?.url || ""),
                    photos: localDraft.photos?.length ? localDraft.photos : (tpl?.storyImages?.map((img, i) => ({ id: `p${i+1}`, url: typeof img === "string" ? img : img.src })) || []),
                    khqrDollar: localDraft.khqrDollar || null,
                    khqrRiel: localDraft.khqrRiel || null,
                };

                const contentPayload = {
                    title: localDraft.event?.title || localDraft.title || tpl?.name || "សួនរាជហង្សខ្មែរ",
                    subtitle: "សូមគោរពអញ្ជើញ",
                    groomName: localDraft.couple?.groom || localDraft.groomName || tpl?.groom || "វណ្ណដា",
                    brideName: localDraft.couple?.bride || localDraft.brideName || tpl?.bride || "ស្រីពេជ្រ",
                    eventDateText: localDraft.event?.date || localDraft.eventDate || tpl?.dateText || "ថ្ងៃពុធ ២៨ មករា ២០២៦",
                    schedule: localDraft.schedule?.length ? localDraft.schedule : (tpl?.schedule || []),
                    agendaDays: localDraft.agendaDays || [],
                    venueName: localDraft.event?.venueName || localDraft.venueName || tpl?.venueName || "The Premier Center Sen Sok",
                    messageText: localDraft.message || tpl?.message || "",
                    thankYouText: localDraft.thankYouText || "",
                };

                const mappedInvitation = {
                    id: localDraft.backendInvitationId || localDraft.id,
                    templateId: chosenTemplateId,
                    title: localDraft.event?.title || localDraft.title || tpl?.name || "សួនរាជហង្សខ្មែរ",
                    groomName: localDraft.couple?.groom || localDraft.groomName || tpl?.groom || "វណ្ណដា",
                    brideName: localDraft.couple?.bride || localDraft.brideName || tpl?.bride || "ស្រីពេជ្រ",
                    eventDate: localDraft.event?.date || localDraft.eventDate || (tpl?.targetDate ? tpl.targetDate.split("T")[0] : "2026-01-28"),
                    eventTime: localDraft.event?.receptionTime || localDraft.eventTime || tpl?.receptionTime || "17:00",
                    venueName: localDraft.event?.venueName || localDraft.venueName || tpl?.venueName || "The Premier Center Sen Sok",
                    venueAddress: localDraft.event?.venueAddress || localDraft.venueAddress || tpl?.venueAddress || "អគារ A, សែនសុខ, ភ្នំពេញ",
                    storyText: localDraft.message || tpl?.message || "",
                    designJson: JSON.stringify(designPayload),
                    contentJson: JSON.stringify(contentPayload),
                };

                if (active) {
                    setInvitation(mappedInvitation);
                    setLoading(false);
                    return;
                }
            }

            // 2. If not found locally and ID is numeric, query backend API
            const isNumericId = id && !isNaN(Number(id)) && Number(id) > 0;
            if (isNumericId) {
                try {
                    const data = await invitationService.get(id);
                    if (active && data) {
                        setInvitation(data);
                        setLoading(false);
                        return;
                    }
                } catch {
                    // Not found in backend
                }

            }

            // 3. No event created yet -> set null to show empty state with Go to Create Events
            if (active) {
                setInvitation(null);
                setLoading(false);
            }
        };

        loadData();

        return () => {
            active = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div style={{ padding: "48px 24px", textAlign: "center", color: "#64748b" }}>
                <div>{t("loading") || "កំពុងទាញយក..."}</div>
            </div>
        );
    }

    // When no events exist, show Empty State matching EventsPage with "+ បង្កើតកម្មវិធី (Go to Create Events)"
    if (!invitation) {
        return (
            <main className="events-page">
                <header className="events-page-header">
                    <div>
                        <span>{t("brand") || "គូព្រេង INVITATIONS"}</span>
                        <h1>{t("title") || "គម្រូធៀប"}</h1>
                        <p>{t("subtitle") || "គ្រប់គ្រង និងកែសម្រួលគំរូធៀបអាពាហ៍ពិពាហ៍"}</p>
                    </div>
                    <Link to="/create/wedding" className="events-create-btn">
                        {t("createBtn") || "+ បង្កើតកម្មវិធី"}
                    </Link>
                </header>

                <section className="events-empty">
                    <div className="events-empty-icon">{t("emptyIcon") || "គម្រោង"}</div>
                    <h2>{t("emptyTitle") || "មិនទាន់មានកម្មវិធី"}</h2>
                    <p>{t("emptyText") || "សូមចាប់ផ្តើមបង្កើតកម្មវិធីជាមុនសិន ដើម្បីកែសម្រួលគំរូធៀបឌីជីថល។"}</p>
                    <Link to="/create/wedding" className="events-create-btn">
                        {t("emptyActionBtn") || "+ បង្កើតកម្មវិធី (Go to Create Events)"}
                    </Link>
                </section>
            </main>
        );
    }

    return <InvitationForm invitation={invitation} />;
}


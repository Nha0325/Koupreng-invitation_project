import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import "./builder.css";

import PhonePreview from "./components/PhonePreview";
import StepNavigation from "./components/StepNavigation";
import { Breadcrumb } from "../../shared/ui/Breadcrumb";

import { BUILDER_STEPS } from "./config/builderSteps";
import { useWeddingStore } from "../../stores/useWeddingStore";
import {
    publishWeddingDraftToBackend,
    saveWeddingDraftToBackend,
    syncKeyForDraft,
} from "./services/weddingBackendSync";
import { getAccessToken } from "../../shared/services/authStorage";

export default function CreateWedding() {
    const { draftId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialTemplateId = searchParams.get("template") || "royal";
    const initialBackendTemplateId = searchParams.get("templateId") || "";
    const initialized = useRef(false);
    const syncTimer = useRef(null);
    const lastSyncedKey = useRef("");
    const [publishedDraft, setPublishedDraft] = useState(null);
    const [syncError, setSyncError] = useState("");
    const [stepMenuOpen, setStepMenuOpen] = useState(false);

    const draft = useWeddingStore((state) => state.draft);
    const step = useWeddingStore((state) => state.step);
    const setStep = useWeddingStore((state) => state.setStep);
    const next = useWeddingStore((state) => state.next);
    const prev = useWeddingStore((state) => state.prev);
    const startDraft = useWeddingStore((state) => state.startDraft);
    const loadDraft = useWeddingStore((state) => state.loadDraft);
    const update = useWeddingStore((state) => state.update);
    const updateField = useWeddingStore((state) => state.updateField);
    const publishDraft = useWeddingStore((state) => state.publishDraft);

    useEffect(() => {
        if (initialized.current) return;
        initialized.current = true;

        if (draftId) {
            loadDraft(draftId);
        } else {
            const newDraft = startDraft({
                templateId: initialTemplateId,
                templateBackendId: initialBackendTemplateId || undefined,
            });
            navigate(`/create/wedding/${newDraft.id}`, { replace: true });
        }
    }, [draftId, initialBackendTemplateId, initialTemplateId, loadDraft, navigate, startDraft]);

    useEffect(() => {
        if (!draft || !getAccessToken()) {
            return undefined;
        }

        const key = syncKeyForDraft(draft);
        if (key === lastSyncedKey.current) {
            return undefined;
        }

        if (syncTimer.current) {
            clearTimeout(syncTimer.current);
        }

        syncTimer.current = setTimeout(() => {
            saveWeddingDraftToBackend(draft)
                .then((invitation) => {
                    lastSyncedKey.current = syncKeyForDraft({
                        ...draft,
                        backendInvitationId: invitation.id,
                    });
                    setSyncError("");
                    if (!draft.backendInvitationId || draft.slug !== invitation.slug) {
                        update({
                            backendInvitationId: invitation.id,
                            backendStatus: invitation.status,
                            slug: invitation.slug || draft.slug,
                        });
                    }
                })
                .catch((err) => {
                    setSyncError(err.message || "Could not save draft to backend");
                });
        }, 1200);

        return () => {
            if (syncTimer.current) {
                clearTimeout(syncTimer.current);
            }
        };
    }, [draft, update]);

    const CurrentStep = BUILDER_STEPS[step]?.Component;
    const progress = Math.round(((step + 1) / BUILDER_STEPS.length) * 100);
    const backTo = location.state?.backTo;
    const shouldBackToDashboard = backTo === "/dashboard";
    const shouldBackToEvents = backTo === "/events";

    let breadcrumbStart;
    let breadcrumbCurrent;

    if (shouldBackToEvents) {
        breadcrumbStart = { label: "កម្មវិធី", to: "/events" };
        breadcrumbCurrent = { label: "កែប្រែកម្មវិធី" };
    } else if (shouldBackToDashboard) {
        breadcrumbStart = { label: "ផ្ទាំងគ្រប់គ្រង", to: "/dashboard" };
        breadcrumbCurrent = { label: "បង្កើតសន្លឹកការ" };
    } else {
        breadcrumbStart = { label: "កម្មវិធីសន្លឹកការ", to: "/events" };
        breadcrumbCurrent = { label: "បង្កើតសន្លឹកការ" };
    }

    const activeStep = BUILDER_STEPS[step];

    const handleStepSelect = useCallback((index) => {
        setStep(index);
        setStepMenuOpen(false);
    }, [setStep]);

    const handlePublish = useCallback(async () => {
        if (!draft) {
            return null;
        }

        if (!getAccessToken()) {
            const saved = publishDraft();
            setPublishedDraft(saved);
            return saved;
        }

        const published = await publishWeddingDraftToBackend(draft);
        const saved = update({
            backendInvitationId: published.id,
            backendStatus: published.status,
            slug: published.slug || draft.slug,
            publishedAt: published.publishedAt ? Date.parse(published.publishedAt) : Date.now(),
        });
        lastSyncedKey.current = syncKeyForDraft(saved);
        setSyncError("");
        setPublishedDraft(saved);
        return saved;
    }, [draft, publishDraft, update]);

    const stepEl = useMemo(() => {
        if (!CurrentStep || !draft) return null;

        return (
            <CurrentStep
                draft={draft}
                update={update}
                updateField={updateField}
                onNext={next}
                onPublish={handlePublish}
                publishedDraft={publishedDraft}
                syncError={syncError}
                goToStep={setStep}
            />
        );
    }, [CurrentStep, draft, handlePublish, next, publishedDraft, setStep, syncError, update, updateField]);

    if (!draft) {
        return (
            <div className="wb-root">
                <div style={{ padding: 40, textAlign: "center", color: "#7d6443" }}>
                    កំពុងផ្ទុក...
                </div>
            </div>
        );
    }

    return (
        <div className="wb-root">
            {/* Header with breadcrumb + step nav */}
            <div className="wb-top-header">
                <div className="wb-top-header-inner">
                    {/* Breadcrumb */}
                    <div className="wb-header-brand">
                        <Breadcrumb
                            items={[
                                breadcrumbStart,
                                breadcrumbCurrent,
                            ]}
                        />
                    </div>

                    {/* Step nav links — Flower-style numbered stepper */}
                    <nav className="wb-step-nav" aria-label="ជំហានបង្កើតសន្លឹកការ">
                        {BUILDER_STEPS.map((s, index) => {
                            const isActive = index === step;
                            const isDone = index < step;
                            return (
                                <button
                                    key={s.id}
                                    type="button"
                                    className={`wb-step-link${isActive ? " active" : ""}${isDone ? " done" : ""}`}
                                    aria-current={isActive ? "step" : undefined}
                                    onClick={() => handleStepSelect(index)}
                                >
                                    <span className="wb-step-link-num">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="wb-step-link-label">{s.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="wb-step-menu">
                        <button
                            type="button"
                            className="wb-step-menu-trigger"
                            aria-expanded={stepMenuOpen}
                            aria-controls="wb-step-menu-list"
                            onClick={() => setStepMenuOpen((current) => !current)}
                        >
                            <span className="wb-step-link-num">{step + 1}</span>
                            <span>{activeStep?.label}</span>
                            <span className="wb-step-menu-chevron" aria-hidden="true">⌄</span>
                        </button>

                        {stepMenuOpen && (
                            <div className="wb-step-menu-list" id="wb-step-menu-list">
                                {BUILDER_STEPS.map((s, index) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        className={`wb-step-menu-item${index === step ? " active" : ""}`}
                                        onClick={() => handleStepSelect(index)}
                                    >
                                        <span className="wb-step-link-num">{index + 1}</span>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Progress */}
                    <div className="wb-header-progress" aria-label={`Progress ${progress}%`}>
                        <div className="wb-header-progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                </div>
            </div>

            {/* Content area */}
            <div className="wb-content">
                {/* Main Form */}
                <main className="wb-main">
                    {/* Flower-style step banner */}
                    <div className="wb-phase-banner">
                        <span className="wb-phase-banner-step">
                            {String(step + 1).padStart(2, "0")} / {String(BUILDER_STEPS.length).padStart(2, "0")} · {activeStep?.labelEn}
                        </span>
                        <div className="wb-phase-dots" aria-hidden="true">
                            {BUILDER_STEPS.map((s, index) => (
                                <span
                                    key={s.id}
                                    className={`wb-phase-dot${index <= step ? " is-active" : ""}`}
                                />
                            ))}
                        </div>
                    </div>

                    {stepEl}

                    <StepNavigation
                        onPrev={prev}
                        onNext={next}
                        isFirst={step === 0}
                        isLast={step === BUILDER_STEPS.length - 1}
                    />
                </main>

                {/* Phone Preview */}
                <aside className="wb-preview">
                    <h3>ការបង្ហាញ</h3>
                    <PhonePreview draft={draft} />
                </aside>
            </div>
        </div>
    );
}

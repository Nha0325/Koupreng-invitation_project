import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";

import "./builder.css";

import PhonePreview from "./components/PhonePreview";
import StepNavigation from "./components/StepNavigation";
import { Breadcrumb } from "../../shared/ui/Breadcrumb";

import { BUILDER_STEPS } from "./config/builderSteps";
import { useWeddingStore } from "../../stores/useWeddingStore";

export default function CreateWedding() {
    const { draftId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialTemplateId = searchParams.get("template") || "royal";
    const initialized = useRef(false);
    const [publishedDraft, setPublishedDraft] = useState(null);

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
            const newDraft = startDraft({ templateId: initialTemplateId });
            navigate(`/create/wedding/${newDraft.id}`, { replace: true });
        }
    }, [draftId, initialTemplateId, loadDraft, navigate, startDraft]);

    const CurrentStep = BUILDER_STEPS[step]?.Component;
    const progress = Math.round(((step + 1) / BUILDER_STEPS.length) * 100);
    const shouldBackToDashboard = location.state?.backTo === "/dashboard";
    const breadcrumbStart = shouldBackToDashboard
        ? { label: "ផ្ទាំងគ្រប់គ្រង", to: "/dashboard" }
        : { label: "គំរូសន្លឹកការ", to: "/templates" };

    const handlePublish = useCallback(() => {
        const saved = publishDraft();
        setPublishedDraft(saved);
        return saved;
    }, [publishDraft]);

    const stepEl = useMemo(() => {
        if (!CurrentStep || !draft) return null;

        return (
            <CurrentStep
                draft={draft}
                update={update}
                updateField={updateField}
                onPublish={handlePublish}
                publishedDraft={publishedDraft}
            />
        );
    }, [CurrentStep, draft, handlePublish, publishedDraft, update, updateField]);

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
                                { label: "បង្កើតសន្លឹកការ" },
                            ]}
                        />
                    </div>

                    {/* Step nav links */}
                    <nav className="wb-step-nav">
                        {BUILDER_STEPS.map((s, index) => (
                            <button
                                key={s.id}
                                type="button"
                                className={`wb-step-link${index === step ? " active" : ""}`}
                                onClick={() => setStep(index)}
                            >
                                <span className="wb-step-link-num">{index + 1}</span>
                                {s.label}
                            </button>
                        ))}
                    </nav>

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

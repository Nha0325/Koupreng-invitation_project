import { useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import "./builder.css";
import BuilderSidebar from "./components/BuilderSidebar";
import PhonePreview from "./components/PhonePreview";
import PublishBox from "./components/PublishBox";
import StepNavigation from "./components/StepNavigation";
import useWeddingBuilder from "./hooks/useWeddingBuilder";

import SelectTemplateStep from "./steps/SelectTemplateStep";
import CoupleInfoStep from "./steps/CoupleInfoStep";
import EventInfoStep from "./steps/EventInfoStep";
import StoryGalleryStep from "./steps/StoryGalleryStep";
import RsvpSettingsStep from "./steps/RsvpSettingsStep";
import ReviewPublishStep from "./steps/ReviewPublishStep";

const STEP_LABELS = [
    "ជ្រើសរើសគំរូ",
    "ព័ត៌មានគូរ",
    "ព័ត៌មានពិធី",
    "រឿង / រូបភាព",
    "ការកំណត់ RSVP",
    "ត្រួតពិនិត្យ និងបោះផ្សាយ",
];

/**
 * CreateWedding — top-level wedding builder screen.
 * Mounted on /create/wedding and /create/wedding/:draftId.
 *
 * Loads (or creates) a draft from localStorage and walks the user
 * through 6 steps. The draft is auto-saved on every change.
 */
export default function CreateWedding() {
    const { draftId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const initialTemplateId = searchParams.get("template") || undefined;

    const builder = useWeddingBuilder(draftId, { initialTemplateId });
    const { draft, step, update, updateField, next, prev, goTo } = builder;

    // Make the URL reflect the draft id so refresh keeps the same draft.
    useEffect(() => {
        if (draft?.id && !draftId) {
            navigate(`/create/wedding/${draft.id}`, { replace: true });
        }
    }, [draft?.id, draftId, navigate]);

    const stepEl = useMemo(() => {
        const props = { draft, update, updateField };
        switch (step) {
            case 0: return <SelectTemplateStep {...props} />;
            case 1: return <CoupleInfoStep {...props} />;
            case 2: return <EventInfoStep {...props} />;
            case 3: return <StoryGalleryStep {...props} />;
            case 4: return <RsvpSettingsStep {...props} />;
            case 5: return <ReviewPublishStep {...props} />;
            default: return null;
        }
    }, [step, draft, update, updateField]);

    return (
        <div className="wb-root">
            <BuilderSidebar
                steps={STEP_LABELS}
                currentStep={step}
                onSelect={goTo}
            />

            <main className="wb-main">
                {stepEl}
                <StepNavigation
                    onPrev={prev}
                    onNext={next}
                    isFirst={step === 0}
                    isLast={step === STEP_LABELS.length - 1}
                />
            </main>

            <div>
                <div className="wb-preview">
                    <h3>ការបង្ហាញ</h3>
                    <PhonePreview draft={draft} />
                    <PublishBox draft={draft} />
                </div>
            </div>
        </div>
    );
}

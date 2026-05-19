import { useCallback, useEffect, useMemo, useState } from "react";
import {
    createDraft,
    getDraft,
    saveDraft,
} from "../../../services/weddingStorage";
import { defaultWeddingData } from "../data/defaultWeddingData";

/**
 * useWeddingBuilder — load / persist a wedding draft from localStorage.
 * Auto-saves on every change. Returns the draft, helpers to update it,
 * and the current step.
 */
export default function useWeddingBuilder(draftId, options = {}) {
    const { initialTemplateId } = options;

    const [draft, setDraft] = useState(() => {
        if (draftId) {
            const existing = getDraft(draftId);
            if (existing) return existing;
        }
        return createDraft({
            ...defaultWeddingData,
            templateId: initialTemplateId || defaultWeddingData.templateId,
        });
    });
    const [step, setStep] = useState(0);

    // Persist on every change.
    useEffect(() => {
        saveDraft(draft);
    }, [draft]);

    const update = useCallback((patch) => {
        setDraft((prev) => ({ ...prev, ...patch }));
    }, []);

    const updateField = useCallback((section, patch) => {
        setDraft((prev) => ({
            ...prev,
            [section]: { ...prev[section], ...patch },
        }));
    }, []);

    const next = useCallback(() => setStep((s) => s + 1), []);
    const prev = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
    const goTo = useCallback((index) => setStep(index), []);

    return useMemo(
        () => ({ draft, step, update, updateField, next, prev, goTo, setDraft }),
        [draft, step, update, updateField, next, prev, goTo],
    );
}

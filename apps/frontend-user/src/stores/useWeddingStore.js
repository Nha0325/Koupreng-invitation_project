import { create } from "zustand";
import {
  createDraft,
  getDraft,
  getDraftBySlug,
  saveDraft,
} from "../shared/storage/weddingStorage";
import { slugify } from "../shared/utils/slugify";

export const useWeddingStore = create((set, get) => ({
  draft: null,
  step: 0,
  loading: false,
  error: null,

  setStep: (step) => set({ step }),

  next: () => {
    const step = get().step;
    set({ step: step + 1 });
  },

  prev: () => {
    const step = get().step;
    set({ step: Math.max(0, step - 1) });
  },

  goTo: (step) => set({ step }),

  startDraft: (initial = {}) => {
    const draft = createDraft(initial);
    set({ draft, step: 0, loading: false, error: null });
    return draft;
  },

  loadDraft: (draftId) => {
    set({ loading: true, error: null });

    const draft = getDraft(draftId);

    if (!draft) {
      set({ draft: null, loading: false, error: "Draft not found" });
      return null;
    }

    set({ draft, loading: false, error: null });
    return draft;
  },

  loadDraftBySlug: (slug) => {
    set({ loading: true, error: null });

    const draft = getDraftBySlug(slug);

    if (!draft) {
      set({ draft: null, loading: false, error: "Invitation not found" });
      return null;
    }

    set({ draft, loading: false, error: null });
    return draft;
  },

  update: (patch) => {
    const current = get().draft || {};
    const saved = saveDraft({
      ...current,
      ...patch,
    });
    set({ draft: saved });
    return saved;
  },

  updateField: (section, patch) => {
    const current = get().draft || {};
    const saved = saveDraft({
      ...current,
      [section]: {
        ...current?.[section],
        ...patch,
      },
    });
    set({ draft: saved });
    return saved;
  },

  publishDraft: () => {
    const current = get().draft;

    if (!current) return null;

    const groom = current?.couple?.groom || "groom";
    const bride = current?.couple?.bride || "bride";
    const slug = current.slug || slugify(`${groom}-${bride}-${current.id}`);

    const saved = saveDraft({
      ...current,
      slug,
      publishedAt: Date.now(),
    });

    set({ draft: saved });
    return saved;
  },
}));

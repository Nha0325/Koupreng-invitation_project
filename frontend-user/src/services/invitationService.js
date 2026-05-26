import { getDraft, getDraftBySlug, saveDraft } from "./weddingStorage";

export function getInvitationPreview(draftId) {
  return getDraft(draftId);
}

export function getPublicInvitation(slug) {
  return getDraftBySlug(slug);
}

export function publishInvitation(draft) {
  return saveDraft({
    ...draft,
    publishedAt: Date.now(),
  });
}
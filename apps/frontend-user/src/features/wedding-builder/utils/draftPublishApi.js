import { invitationService } from "../../invitations/api/invitationApi";
import { mediaService } from "../../invitations/api/mediaApi";
import templateService from "../../templates/templateService";
import {
  draftMediaSignature,
  draftToInvitationPayload,
  isDataUrl,
} from "./invitationDraftAdapter";

function dataUrlToFile(dataUrl, fallbackName) {
  const [meta, payload] = String(dataUrl).split(",");
  const mime = meta.match(/data:([^;]+)/)?.[1] || "application/octet-stream";
  const binary = atob(payload || "");
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new File([bytes], fallbackName, { type: mime });
}

function extensionForDataUrl(dataUrl, fallback = "bin") {
  const mime = String(dataUrl).match(/data:([^;]+)/)?.[1] || "";
  if (mime.includes("jpeg")) return "jpg";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  if (mime.includes("gif")) return "gif";
  if (mime.includes("mp4")) return "mp4";
  if (mime.includes("mpeg")) return "mp3";
  if (mime.includes("mp3")) return "mp3";
  if (mime.includes("m4a")) return "m4a";
  return fallback;
}

function localGalleryFiles(gallery = []) {
  return gallery
    .map((item, index) => {
      const preview = typeof item === "string" ? item : item?.preview;
      if (!isDataUrl(preview)) return null;
      const name = item?.name || `gallery-${index + 1}.${extensionForDataUrl(preview, "jpg")}`;
      return dataUrlToFile(preview, name);
    })
    .filter(Boolean);
}

async function resolveBackendTemplateId(templateCode) {
  try {
    const template = await templateService.getPublicBySlug(templateCode || "garden-royal-khmer-wedding");
    return template?.id || null;
  } catch {
    return null;
  }
}

async function uploadDraftMedia(invitationId, draft, nextSignature) {
  if (!invitationId || draft.remoteMediaSignature === nextSignature) {
    return false;
  }

  if (isDataUrl(draft.coverImage)) {
    await mediaService.uploadCover(
      invitationId,
      dataUrlToFile(draft.coverImage, `cover.${extensionForDataUrl(draft.coverImage, "jpg")}`)
    );
  }

  const galleryFiles = localGalleryFiles(draft.gallery || []);
  if (galleryFiles.length) {
    await mediaService.uploadGallery(invitationId, galleryFiles);
  }

  if (draft.openingVideoEnabled !== false && isDataUrl(draft.openingVideo?.url)) {
    await mediaService.uploadVideo(
      invitationId,
      dataUrlToFile(
        draft.openingVideo.url,
        draft.openingVideo.name || `opening-video.${extensionForDataUrl(draft.openingVideo.url, "mp4")}`
      )
    );
  }

  if (isDataUrl(draft.music?.url)) {
    await mediaService.uploadMusic(
      invitationId,
      dataUrlToFile(
        draft.music.url,
        draft.music.name || `background-music.${extensionForDataUrl(draft.music.url, "mp3")}`
      )
    );
  }

  return true;
}

function responsePatch(response, signature, mediaSynced) {
  return {
    backendInvitationId: response.id,
    backendTemplateId: response.templateId || null,
    backendStatus: response.status || "DRAFT",
    slug: response.slug || "",
    publishedAt: response.publishedAt ? Date.parse(response.publishedAt) : undefined,
    remoteMediaSignature: signature,
    remoteMediaSyncedAt: mediaSynced ? Date.now() : undefined,
  };
}

export function isBackendUnavailable(error) {
  return !error?.status && /network|timeout|failed to fetch|request failed/i.test(error?.message || "");
}

export async function persistWeddingDraft(draft, { publish = false } = {}) {
  const templateId = await resolveBackendTemplateId(draft.templateId);
  const payload = draftToInvitationPayload(draft, templateId);
  const saved = draft.backendInvitationId
    ? await invitationService.update(draft.backendInvitationId, payload)
    : await invitationService.create(payload);
  const signature = draftMediaSignature(draft);
  const mediaSynced = await uploadDraftMedia(saved.id, draft, signature);

  if (!publish) {
    const drafted = await invitationService.saveDraft(saved.id);
    return {
      response: drafted,
      patch: {
        ...responsePatch(drafted, signature, mediaSynced),
        publishedAt: null,
      },
    };
  }

  const published = await invitationService.publish(saved.id);
  return {
    response: published,
    patch: responsePatch(published, signature, mediaSynced),
  };
}

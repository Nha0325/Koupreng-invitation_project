const MB = 1024 * 1024;

const RULES = {
  cover: {
    label: "Cover image",
    maxSize: 5 * MB,
    mimeTypes: new Set(["image/jpeg", "image/png", "image/webp"]),
    extensions: new Set(["jpg", "jpeg", "png", "webp"]),
  },
  gallery: {
    label: "Gallery image",
    maxSize: 5 * MB,
    mimeTypes: new Set(["image/jpeg", "image/png", "image/webp"]),
    extensions: new Set(["jpg", "jpeg", "png", "webp"]),
  },
  openingVideo: {
    label: "Opening video",
    maxSize: 50 * MB,
    mimeTypes: new Set(["video/mp4", "video/webm"]),
    extensions: new Set(["mp4", "webm"]),
  },
  music: {
    label: "Background music",
    maxSize: 15 * MB,
    mimeTypes: new Set(["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"]),
    extensions: new Set(["mp3", "wav", "ogg"]),
  },
};

function extension(filename = "") {
  const value = String(filename).trim().toLowerCase();
  const index = value.lastIndexOf(".");
  return index >= 0 ? value.slice(index + 1) : "";
}

export function validateMediaFile(file, kind) {
  const rules = RULES[kind];
  if (!rules) return "Unsupported media category.";
  if (!file || file.size <= 0) return `${rules.label} is empty.`;
  if (file.size > rules.maxSize) {
    return `${rules.label} must be ${Math.round(rules.maxSize / MB)}MB or smaller.`;
  }
  if (!rules.mimeTypes.has(String(file.type || "").toLowerCase())) {
    return `${rules.label} has an unsupported file type.`;
  }
  if (!rules.extensions.has(extension(file.name))) {
    return `${rules.label} has an unsupported file extension.`;
  }
  return "";
}

export function pendingMediaMetadata(file) {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    updatedAt: Date.now(),
  };
}

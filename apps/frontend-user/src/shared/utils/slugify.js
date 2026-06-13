export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\u1780-\u17ff-]/g, "")
    .replace(/-+/g, "-");
}
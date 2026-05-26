export function toast(text) {
    window.dispatchEvent(new CustomEvent("toast", { detail: text }));
}

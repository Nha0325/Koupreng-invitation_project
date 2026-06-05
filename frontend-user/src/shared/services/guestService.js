import { api } from "../api/client";
import { ApiError } from "../api/errors";
import { getAccessToken, isCookieAuthStorage } from "./authStorage";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function unwrap(response) {
    return response?.data ?? response;
}

async function downloadCsv(path, filename) {
    const token = getAccessToken();
    const useCookieAuth = isCookieAuthStorage();
    const response = await fetch(`${API_BASE_URL}${path}`, {
        headers: {
            ...(!useCookieAuth && token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: useCookieAuth ? "include" : undefined,
    });

    if (!response.ok) {
        throw new ApiError(response.statusText || "Export failed", response.status);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}

function fileForm(file) {
    const formData = new FormData();
    formData.append("file", file);
    return formData;
}

export const guestService = {
    list: () => api.get("/guests"),
    create: (guest) => api.post("/guests", guest),
    update: (id, guest) => api.put(`/guests/${id}`, guest),
    remove: (id) => api.delete(`/guests/${id}`),
    listByInvitation: (invitationId) => api.get(`/v1/invitations/${invitationId}/guests`).then(unwrap),
    getByInvitation: (invitationId, guestId) => api.get(`/v1/invitations/${invitationId}/guests/${guestId}`).then(unwrap),
    createForInvitation: (invitationId, guest) => api.post(`/v1/invitations/${invitationId}/guests`, guest).then(unwrap),
    updateForInvitation: (invitationId, guestId, guest) => api.put(`/v1/invitations/${invitationId}/guests/${guestId}`, guest).then(unwrap),
    removeFromInvitation: (invitationId, guestId) => api.delete(`/v1/invitations/${invitationId}/guests/${guestId}`).then(unwrap),
    searchByInvitation: (invitationId, keyword) => api
        .get(`/v1/invitations/${invitationId}/guests/search?keyword=${encodeURIComponent(keyword || "")}`)
        .then(unwrap),
    importForInvitation: (invitationId, guests) => api
        .post(`/v1/invitations/${invitationId}/guests/import`, { guests })
        .then(unwrap),
    importFileForInvitation: (invitationId, file) => api
        .post(`/v1/invitations/${invitationId}/guests/import-file`, fileForm(file))
        .then(unwrap),
    exportForInvitation: (invitationId) =>
        downloadCsv(`/v1/invitations/${invitationId}/guests/export`, `guest-report-${invitationId}.csv`),
    invitationQr: (invitationId) => api.get(`/v1/invitations/${invitationId}/qr`).then(unwrap),
    guestQr: (invitationId, guestId) => api.get(`/v1/invitations/${invitationId}/guests/${guestId}/qr`).then(unwrap),
    scanCheckIn: (invitationId, token, note = "") => api
        .post(`/v1/invitations/${invitationId}/check-in/scan`, { token, note })
        .then(unwrap),
    manualCheckIn: (invitationId, guestId, note = "") => api
        .post(`/v1/invitations/${invitationId}/guests/${guestId}/check-in`, { note })
        .then(unwrap),
    checkInSummary: (invitationId) => api.get(`/v1/invitations/${invitationId}/check-in/summary`).then(unwrap),
    checkInList: (invitationId) => api.get(`/v1/invitations/${invitationId}/check-in/list`).then(unwrap),
};

export default guestService;

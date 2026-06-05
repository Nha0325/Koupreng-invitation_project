import { api } from "../../shared/api/client";

function unwrap(response) {
    return response?.data ?? response;
}

export const aiAssistantService = {
    draftInvitationCopy: (payload) => api.post("/v1/ai/invitation-copy", payload).then(unwrap),
    draftInvitationStory: (payload) => api.post("/v1/ai/invitation/story", payload).then(unwrap),
    draftInvitationFormalText: (payload) => api.post("/v1/ai/invitation/formal-text", payload).then(unwrap),
    draftInvitationTranslate: (payload) => api.post("/v1/ai/invitation/translate", payload).then(unwrap),
    draftInvitationTimelineSuggestion: (payload) => api.post("/v1/ai/invitation/timeline-suggestion", payload).then(unwrap),
};

export default aiAssistantService;

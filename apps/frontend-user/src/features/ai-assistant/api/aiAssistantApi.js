import { api } from "@/shared/api/httpClient";
import { unwrap } from "@/shared/api/helpers";

const basePath = "/v1/ai";

export const aiAssistantService = {
  draftCopy: (data) => api.post(`${basePath}/invitation-copy`, data).then(unwrap),
  generateStory: (data) => api.post(`${basePath}/invitation/story`, data).then(unwrap),
  formalText: (data) => api.post(`${basePath}/invitation/formal-text`, data).then(unwrap),
  translate: (data) => api.post(`${basePath}/invitation/translate`, data).then(unwrap),
  timelineSuggestion: (data) => api.post(`${basePath}/invitation/timeline-suggestion`, data).then(unwrap),
};

export default aiAssistantService;

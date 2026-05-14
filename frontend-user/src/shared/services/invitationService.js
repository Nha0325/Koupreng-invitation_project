import api from './api';

export const invitationService = {
  getTemplates: (params) => api.get('/invitations/templates', { params }),
  getTemplateById: (id) => api.get(`/invitations/templates/${id}`),
  saveInvitation: (data) => api.post('/invitations', data),
  updateInvitation: (id, data) => api.put(`/invitations/${id}`, data),
  getMyInvitations: () => api.get('/invitations/my'),
  getInvitationById: (id) => api.get(`/invitations/${id}`),
  deleteInvitation: (id) => api.delete(`/invitations/${id}`),
  generateShareLink: (id) => api.post(`/invitations/${id}/share`),
  getSharedInvitation: (shareToken) => api.get(`/invitations/shared/${shareToken}`),
};

export default invitationService;

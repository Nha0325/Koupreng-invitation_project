import { invitationService } from "@/features/invitations/api/invitationApi";

export const eventsApi = {
    listMine: () => invitationService.listMine(),
    get: (id) => invitationService.get(id),
    remove: (id) => invitationService.remove(id),
};

export default eventsApi;

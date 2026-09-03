import { planningService } from "@/features/planning/api/planningApi";
import { guestService } from "@/features/guests/api/guestApi";
import { invitationService } from "@/features/invitations/api/invitationApi";

export const giftsApi = {
    listMineInvitations: () => invitationService.listMine(),
    listGifts: (invitationId) => planningService.listGifts(invitationId),
    createGift: (invitationId, payload) => planningService.createGift(invitationId, payload),
    updateGift: (invitationId, giftId, payload) => planningService.updateGift(invitationId, giftId, payload),
    removeGift: (invitationId, giftId) => planningService.removeGift(invitationId, giftId),
    listGuests: (invitationId) => guestService.listByInvitation(invitationId),
};

export default giftsApi;

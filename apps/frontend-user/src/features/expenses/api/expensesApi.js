import { invitationService } from "@/features/invitations/api/invitationApi";
import { budgetService } from "@/features/budget/api/budgetApi";

export const expensesApi = {
    listMineInvitations: () => invitationService.listMine(),
    listExpenses: (invitationId) => budgetService.list(invitationId),
    summary: (invitationId) => budgetService.summary(invitationId),
    createExpense: (invitationId, payload) => budgetService.create(invitationId, payload),
    updateExpense: (invitationId, itemId, payload) => budgetService.update(invitationId, itemId, payload),
    removeExpense: (invitationId, itemId) => budgetService.remove(invitationId, itemId),
};

export default expensesApi;

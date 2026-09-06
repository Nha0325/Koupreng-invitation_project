import { invitationService } from "@/features/invitations/api/invitationApi";
import { budgetService } from "@/features/budget/api/budgetApi";

export const expensesApi = {
    listMineInvitations: () => invitationService.listMine(),
    listExpenses: (invitationId) => budgetService.listItems(invitationId),
    summary: (invitationId) => budgetService.summary(invitationId),
    createExpense: (invitationId, payload) => budgetService.createItem(invitationId, payload),
    updateExpense: (invitationId, itemId, payload) => budgetService.updatePlanningItem(invitationId, itemId, payload),
    removeExpense: (invitationId, itemId) => budgetService.deletePlanningItem(invitationId, itemId),
};

export default expensesApi;

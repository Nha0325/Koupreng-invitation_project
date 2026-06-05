package com.koupreng.backend.service;

import com.koupreng.backend.dto.budget.BudgetResponse;
import com.koupreng.backend.dto.budget.CreateBudgetItemRequest;
import com.koupreng.backend.dto.budget.UpdateBudgetRequest;
import com.koupreng.backend.entity.budget.Budget;
import com.koupreng.backend.entity.budget.BudgetItem;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.repository.BudgetItemRepository;
import com.koupreng.backend.repository.BudgetRepository;
import com.koupreng.backend.repository.UserInvitationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class BudgetServiceTests {

    @Test
    void getOrCreateBudgetCreatesEmptyBudgetForOwner() {
        Fixture fixture = fixture();
        Authentication authentication = mock(Authentication.class);
        UserInvitation invitation = invitation();

        when(fixture.invitationService.requireOwnedInvitationEntity(authentication, 10L)).thenReturn(invitation);
        when(fixture.budgetRepository.findByInvitationId(10L)).thenReturn(Optional.empty());
        when(fixture.budgetItemRepository.findByBudgetIdOrderByIdDesc(40L)).thenReturn(List.of());

        BudgetResponse response = fixture.service.getOrCreateBudget(authentication, 10L);

        assertEquals(40L, response.getId());
        assertEquals(BigDecimal.ZERO, response.getTotalBudget());
        assertFalse(response.isOverBudget());
        verify(fixture.budgetRepository).save(any(Budget.class));
    }

    @Test
    void addBudgetItemReturnsCalculatedTotals() {
        Fixture fixture = fixture();
        Authentication authentication = mock(Authentication.class);
        UserInvitation invitation = invitation();
        Budget budget = budget(invitation);
        AtomicReference<BudgetItem> savedItem = new AtomicReference<>();

        when(fixture.invitationService.requireOwnedInvitationEntity(authentication, 10L)).thenReturn(invitation);
        when(fixture.budgetRepository.findByInvitationId(10L)).thenReturn(Optional.of(budget));
        when(fixture.budgetItemRepository.save(any(BudgetItem.class))).thenAnswer(invocation -> {
            BudgetItem item = invocation.getArgument(0);
            item.setId(55L);
            savedItem.set(item);
            return item;
        });
        when(fixture.budgetItemRepository.findByBudgetIdOrderByIdDesc(40L))
                .thenAnswer(invocation -> List.of(savedItem.get()));

        CreateBudgetItemRequest request = new CreateBudgetItemRequest();
        request.setCategory("food");
        request.setItemName("Dinner");
        request.setEstimatedCost(new BigDecimal("350.00"));
        request.setActualCost(new BigDecimal("375.50"));

        BudgetResponse response = fixture.service.addBudgetItem(authentication, 10L, request);

        assertEquals(new BigDecimal("350.00"), response.getTotalEstimated());
        assertEquals(new BigDecimal("375.50"), response.getTotalActual());
        assertEquals(new BigDecimal("624.50"), response.getRemainingBudget());
        assertEquals("FOOD", response.getItems().getFirst().getCategory());
    }

    @Test
    void updateBudgetPreservesTotalBudgetWhenOnlyNotesChange() {
        Fixture fixture = fixture();
        Authentication authentication = mock(Authentication.class);
        UserInvitation invitation = invitation();
        Budget budget = budget(invitation);

        when(fixture.invitationService.requireOwnedInvitationEntity(authentication, 10L)).thenReturn(invitation);
        when(fixture.budgetRepository.findByInvitationId(10L)).thenReturn(Optional.of(budget));
        when(fixture.budgetRepository.save(any(Budget.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(fixture.budgetItemRepository.findByBudgetIdOrderByIdDesc(40L)).thenReturn(List.of());

        UpdateBudgetRequest request = new UpdateBudgetRequest();
        request.setNotes("Bride family covers venue");

        BudgetResponse response = fixture.service.updateBudget(authentication, 10L, request);

        assertEquals(new BigDecimal("1000.00"), response.getTotalBudget());
        assertEquals("Bride family covers venue", response.getNotes());
    }

    @Test
    void summaryMarksOverBudgetWhenActualExceedsTotal() {
        Fixture fixture = fixture();
        Authentication authentication = mock(Authentication.class);
        UserInvitation invitation = invitation();
        Budget budget = budget(invitation);
        BudgetItem item = new BudgetItem();
        item.setId(55L);
        item.setBudget(budget);
        item.setCategory("VENUE");
        item.setItemName("Hall");
        item.setActualCost(new BigDecimal("1200.00"));

        when(fixture.invitationService.requireOwnedInvitationEntity(authentication, 10L)).thenReturn(invitation);
        when(fixture.budgetRepository.findByInvitationId(10L)).thenReturn(Optional.of(budget));
        when(fixture.budgetItemRepository.findByBudgetIdOrderByIdDesc(40L)).thenReturn(List.of(item));

        assertTrue(fixture.service.getBudgetSummary(authentication, 10L).isOverBudget());
    }

    private Fixture fixture() {
        BudgetRepository budgetRepository = mock(BudgetRepository.class);
        BudgetItemRepository budgetItemRepository = mock(BudgetItemRepository.class);
        UserInvitationRepository invitationRepository = mock(UserInvitationRepository.class);
        InvitationService invitationService = mock(InvitationService.class);
        BudgetService service = new BudgetService(
                budgetRepository,
                budgetItemRepository,
                invitationRepository,
                invitationService
        );

        when(budgetRepository.save(any(Budget.class))).thenAnswer(invocation -> {
            Budget budget = invocation.getArgument(0);
            if (budget.getId() == null) {
                budget.setId(40L);
            }
            return budget;
        });

        return new Fixture(service, budgetRepository, budgetItemRepository, invitationRepository, invitationService);
    }

    private UserInvitation invitation() {
        UserInvitation invitation = new UserInvitation();
        invitation.setId(10L);
        invitation.setTitle("Wedding");
        return invitation;
    }

    private Budget budget(UserInvitation invitation) {
        Budget budget = new Budget();
        budget.setId(40L);
        budget.setInvitation(invitation);
        budget.setTotalBudget(new BigDecimal("1000.00"));
        return budget;
    }

    private record Fixture(
            BudgetService service,
            BudgetRepository budgetRepository,
            BudgetItemRepository budgetItemRepository,
            UserInvitationRepository invitationRepository,
            InvitationService invitationService
    ) {
    }
}

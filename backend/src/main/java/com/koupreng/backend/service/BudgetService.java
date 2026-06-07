package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.budget.BudgetItemRequest;
import com.koupreng.backend.dto.budget.BudgetItemResponse;
import com.koupreng.backend.entity.budget.Budget;
import com.koupreng.backend.entity.budget.BudgetItem;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.repository.BudgetItemRepository;
import com.koupreng.backend.repository.BudgetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final BudgetItemRepository budgetItemRepository;
    private final InvitationService invitationService;

    public BudgetService(
            BudgetRepository budgetRepository,
            BudgetItemRepository budgetItemRepository,
            InvitationService invitationService
    ) {
        this.budgetRepository = budgetRepository;
        this.budgetItemRepository = budgetItemRepository;
        this.invitationService = invitationService;
    }

    @Transactional(readOnly = true)
    public List<BudgetItemResponse> list(Authentication authentication, Long invitationId) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        return budgetItemRepository.findAllByInvitationId(invitationId).stream()
                .map(BudgetItemResponse::from)
                .toList();
    }

    @Transactional
    public BudgetItemResponse create(Authentication authentication, Long invitationId, BudgetItemRequest request) {
        Budget budget = requireBudget(authentication, invitationId);
        BudgetItem item = new BudgetItem();
        item.setBudget(budget);
        applyRequest(item, request);
        BudgetItem saved = budgetItemRepository.save(item);
        updateBudgetTotal(budget);
        return BudgetItemResponse.from(saved);
    }

    @Transactional
    public BudgetItemResponse update(
            Authentication authentication,
            Long invitationId,
            Long itemId,
            BudgetItemRequest request
    ) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        BudgetItem item = requireItem(invitationId, itemId);
        applyRequest(item, request);
        BudgetItem saved = budgetItemRepository.save(item);
        updateBudgetTotal(item.getBudget());
        return BudgetItemResponse.from(saved);
    }

    @Transactional
    public void delete(Authentication authentication, Long invitationId, Long itemId) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        BudgetItem item = requireItem(invitationId, itemId);
        Budget budget = item.getBudget();
        budgetItemRepository.delete(item);
        updateBudgetTotal(budget);
    }

    private Budget requireBudget(Authentication authentication, Long invitationId) {
        UserInvitation invitation = invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        return budgetRepository.findByInvitationId(invitationId)
                .orElseGet(() -> {
                    Budget budget = new Budget();
                    budget.setInvitation(invitation);
                    budget.setTotalBudget(BigDecimal.ZERO);
                    return budgetRepository.save(budget);
                });
    }

    private BudgetItem requireItem(Long invitationId, Long itemId) {
        return budgetItemRepository.findByIdAndInvitationId(itemId, invitationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Budget item not found"));
    }

    private void applyRequest(BudgetItem item, BudgetItemRequest request) {
        item.setItemName(trimToNull(request.getName()));
        item.setCategory(trimToNull(request.getCategory()));
        item.setEstimatedCost(nonNegative(request.getBudget()));
        item.setActualCost(nonNegative(request.getAmount()));
        item.setExpenseDate(request.getDate() == null ? LocalDate.now() : request.getDate());
        item.setStatus(trimToNull(request.getStatus()));
        item.setVendorName(trimToNull(request.getVendorName()));
        item.setNotes(trimToNull(request.getNotes()));
    }

    private void updateBudgetTotal(Budget budget) {
        BigDecimal total = budgetItemRepository.findAllByInvitationId(budget.getInvitation().getId()).stream()
                .map(BudgetItem::getEstimatedCost)
                .map(this::nonNegative)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        budget.setTotalBudget(total);
        budgetRepository.save(budget);
    }

    private BigDecimal nonNegative(BigDecimal value) {
        if (value == null || value.signum() < 0) {
            return BigDecimal.ZERO;
        }
        return value;
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

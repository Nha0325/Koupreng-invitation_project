package com.koupreng.backend.controller;

import com.koupreng.backend.dto.ApiResponse;
import com.koupreng.backend.dto.budget.BudgetItemRequest;
import com.koupreng.backend.dto.budget.BudgetItemResponse;
import com.koupreng.backend.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Validated
@RequestMapping("/api/v1/invitations/{invitationId}/budget-items")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<BudgetItemResponse>>> list(
            Authentication authentication,
            @PathVariable Long invitationId
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Budget items fetched successfully",
                budgetService.list(authentication, invitationId)
        ));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BudgetItemResponse>> create(
            Authentication authentication,
            @PathVariable Long invitationId,
            @Valid @RequestBody BudgetItemRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(
                        "Budget item created successfully",
                        budgetService.create(authentication, invitationId, request)
                ));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<ApiResponse<BudgetItemResponse>> update(
            Authentication authentication,
            @PathVariable Long invitationId,
            @PathVariable Long itemId,
            @Valid @RequestBody BudgetItemRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(
                "Budget item updated successfully",
                budgetService.update(authentication, invitationId, itemId, request)
        ));
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            Authentication authentication,
            @PathVariable Long invitationId,
            @PathVariable Long itemId
    ) {
        budgetService.delete(authentication, invitationId, itemId);
        return ResponseEntity.ok(ApiResponse.success("Budget item deleted successfully", null));
    }
}

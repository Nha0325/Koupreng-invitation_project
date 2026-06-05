package com.koupreng.backend.dto.budget;

import com.koupreng.backend.entity.budget.BudgetItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BudgetItemResponse {

    private Long id;
    private Long budgetId;
    private String category;
    private String itemName;
    private BigDecimal estimatedCost;
    private BigDecimal actualCost;
    private String vendorName;
    private String notes;

    public static BudgetItemResponse from(BudgetItem item) {
        return BudgetItemResponse.builder()
                .id(item.getId())
                .budgetId(item.getBudget() == null ? null : item.getBudget().getId())
                .category(item.getCategory())
                .itemName(item.getItemName())
                .estimatedCost(item.getEstimatedCost())
                .actualCost(item.getActualCost())
                .vendorName(item.getVendorName())
                .notes(item.getNotes())
                .build();
    }
}

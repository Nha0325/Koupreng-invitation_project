package com.koupreng.backend.dto.budget;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class BudgetItemRequest {

    @NotBlank(message = "Budget item name is required")
    private String name;

    private String category;
    private BigDecimal budget;
    private BigDecimal amount;
    private LocalDate date;
    private String status;
    private String vendorName;
    private String notes;
}

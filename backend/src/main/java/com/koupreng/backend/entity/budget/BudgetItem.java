package com.koupreng.backend.entity.budget;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "budget_items")
public class BudgetItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;

    @Column(length = 100)
    private String category;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "estimated_cost", precision = 12, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "actual_cost", precision = 12, scale = 2)
    private BigDecimal actualCost;

    @Column(name = "vendor_name")
    private String vendorName;

    @Column(columnDefinition = "TEXT")
    private String notes;
}

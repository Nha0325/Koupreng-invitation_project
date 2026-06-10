package com.koupreng.backend.entity.subscription;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "packages")
public class SubscriptionPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long id;

    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "max_invitations")
    private Integer maxInvitations;

    @Column(name = "max_guests")
    private Integer maxGuests;

    @Column(name = "features_json", columnDefinition = "JSON")
    private String featuresJson;

    @Column(length = 50)
    private String status;
}

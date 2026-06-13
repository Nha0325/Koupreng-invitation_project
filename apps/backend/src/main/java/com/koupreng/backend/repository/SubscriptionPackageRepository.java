package com.koupreng.backend.repository;

import com.koupreng.backend.entity.subscription.SubscriptionPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriptionPackageRepository extends JpaRepository<SubscriptionPackage, Long> {

    List<SubscriptionPackage> findByActiveTrueOrderBySortOrderAscPriceAsc();

    Optional<SubscriptionPackage> findByIdAndActiveTrue(Long id);
}

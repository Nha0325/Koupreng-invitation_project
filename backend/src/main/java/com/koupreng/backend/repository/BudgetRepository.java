package com.koupreng.backend.repository;

import com.koupreng.backend.entity.budget.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    Optional<Budget> findByInvitationId(Long invitationId);

    boolean existsByInvitationId(Long invitationId);
}

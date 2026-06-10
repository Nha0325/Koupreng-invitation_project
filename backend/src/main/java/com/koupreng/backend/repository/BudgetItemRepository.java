package com.koupreng.backend.repository;

import com.koupreng.backend.entity.budget.BudgetItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BudgetItemRepository extends JpaRepository<BudgetItem, Long> {

    @Query("""
            select item from BudgetItem item
            where item.budget.invitation.id = :invitationId
            order by item.id desc
            """)
    List<BudgetItem> findAllByInvitationId(@Param("invitationId") Long invitationId);

    @Query("""
            select item from BudgetItem item
            where item.id = :itemId and item.budget.invitation.id = :invitationId
            """)
    Optional<BudgetItem> findByIdAndInvitationId(
            @Param("itemId") Long itemId,
            @Param("invitationId") Long invitationId
    );
}

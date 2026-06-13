package com.koupreng.backend.repository;

import com.koupreng.backend.entity.invitation.EventTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EventTableRepository extends JpaRepository<EventTable, Long> {

    List<EventTable> findByInvitationIdOrderBySortOrderAscTableNameAsc(Long invitationId);

    Optional<EventTable> findByIdAndInvitationId(Long id, Long invitationId);

    boolean existsByInvitationIdAndTableNameIgnoreCase(Long invitationId, String tableName);

    void deleteByInvitationId(Long invitationId);
}

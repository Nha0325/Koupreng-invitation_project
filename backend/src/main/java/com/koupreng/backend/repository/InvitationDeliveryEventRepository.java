package com.koupreng.backend.repository;

import com.koupreng.backend.entity.delivery.InvitationDeliveryEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationDeliveryEventRepository extends JpaRepository<InvitationDeliveryEvent, Long> {
    // NOTE: Used by delivery audit trail API.
    List<InvitationDeliveryEvent> findByInvitationIdOrderByCreatedAtDesc(Long invitationId);

    List<InvitationDeliveryEvent> findByGuestId(Long guestId);

    List<InvitationDeliveryEvent> findByEventType(String eventType);
}

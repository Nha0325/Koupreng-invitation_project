package com.koupreng.backend.repository;

import com.koupreng.backend.entity.invitation.GuestCheckIn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GuestCheckInRepository extends JpaRepository<GuestCheckIn, Long> {

    Optional<GuestCheckIn> findByInvitationIdAndGuestId(Long invitationId, Long guestId);

    boolean existsByInvitationIdAndGuestId(Long invitationId, Long guestId);

    long countByInvitationId(Long invitationId);

    List<GuestCheckIn> findByInvitationIdOrderByCheckedInAtDesc(Long invitationId);

    void deleteByInvitationId(Long invitationId);
}

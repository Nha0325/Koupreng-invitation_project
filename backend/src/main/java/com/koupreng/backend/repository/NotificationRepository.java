package com.koupreng.backend.repository;

import com.koupreng.backend.entity.invitation.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByInvitationIdOrderByScheduledAtDesc(Long invitationId);
}

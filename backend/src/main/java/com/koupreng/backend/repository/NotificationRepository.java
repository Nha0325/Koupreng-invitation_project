package com.koupreng.backend.repository;

import com.koupreng.backend.entity.notification.Notification;
import com.koupreng.backend.enums.NotificationStatus;
import com.koupreng.backend.enums.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findAllByOrderByCreatedAtDesc();

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findTop5ByUserIdOrderByCreatedAtDesc(Long userId);

    List<Notification> findByInvitationIdOrderByCreatedAtDesc(Long invitationId);

    List<Notification> findByGuestIdOrderByCreatedAtDesc(Long guestId);

    long countByUserIdAndStatus(Long userId, NotificationStatus status);

    long countByInvitationIdAndStatus(Long invitationId, NotificationStatus status);

    long countByUserIdAndReadAtIsNull(Long userId);

    long countByStatus(NotificationStatus status);

    boolean existsByGuestIdAndTypeAndCreatedAtAfter(
            Long guestId,
            NotificationType type,
            Instant createdAt
    );
}

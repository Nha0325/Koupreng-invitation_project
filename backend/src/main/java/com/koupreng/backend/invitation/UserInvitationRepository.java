package com.koupreng.backend.invitation;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserInvitationRepository extends JpaRepository<UserInvitation, Long> {

    List<UserInvitation> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<UserInvitation> findByShareToken(String shareToken);

    Optional<UserInvitation> findByIdAndUserId(Long id, Long userId);
}

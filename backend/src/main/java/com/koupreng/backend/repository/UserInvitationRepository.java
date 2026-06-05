package com.koupreng.backend.repository;

import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.enums.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInvitationRepository extends JpaRepository<UserInvitation, Long> {

    Optional<UserInvitation> findByIdAndDeletedFalse(Long id);

    Optional<UserInvitation> findByIdAndUserIdAndDeletedFalse(Long id, Long userId);

    Optional<UserInvitation> findBySlugAndDeletedFalse(String slug);

    Optional<UserInvitation> findBySlugAndStatusAndDeletedFalse(String slug, InvitationStatus status);

    List<UserInvitation> findAllByDeletedFalseOrderByCreatedAtDesc();

    List<UserInvitation> findTop5ByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId);

    List<UserInvitation> findAllByUserIdAndDeletedFalseOrderByCreatedAtDesc(Long userId);

    List<UserInvitation> findAllByUserIdAndStatusAndDeletedFalseOrderByCreatedAtDesc(
            Long userId,
            InvitationStatus status
    );

    boolean existsBySlug(String slug);

    boolean existsBySlugAndIdNot(String slug, Long id);

    boolean existsByAccessToken(String accessToken);

    long countByUserIdAndDeletedFalse(Long userId);

    long countByUserIdAndStatusAndDeletedFalse(Long userId, InvitationStatus status);

    long countByStatusAndDeletedFalse(InvitationStatus status);

    long countByTemplateIdAndDeletedFalse(Long templateId);
}

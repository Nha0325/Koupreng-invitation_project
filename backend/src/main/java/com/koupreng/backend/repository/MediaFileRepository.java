package com.koupreng.backend.repository;

import com.koupreng.backend.entity.invitation.MediaFile;
import com.koupreng.backend.enums.MediaType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MediaFileRepository extends JpaRepository<MediaFile, Long> {

    List<MediaFile> findByInvitationIdOrderBySortOrderAscCreatedAtAsc(Long invitationId);

    List<MediaFile> findAllByInvitationIdAndMediaType(Long invitationId, MediaType mediaType);

    Optional<MediaFile> findByIdAndInvitationId(Long id, Long invitationId);

    long countByInvitationIdAndMediaType(Long invitationId, MediaType mediaType);
}

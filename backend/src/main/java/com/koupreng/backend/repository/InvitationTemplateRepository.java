package com.koupreng.backend.repository;

import com.koupreng.backend.entity.invitation.InvitationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvitationTemplateRepository extends JpaRepository<InvitationTemplate, Long> {

    List<InvitationTemplate> findAllByOrderByCreatedAtDesc();

    List<InvitationTemplate> findAllByStatusIgnoreCaseOrderBySortOrderAscCreatedAtDesc(String status);

    Optional<InvitationTemplate> findByIdAndStatusIgnoreCase(Long id, String status);

    Optional<InvitationTemplate> findByCodeIgnoreCaseAndStatusIgnoreCase(String code, String status);

    long countByStatusIgnoreCase(String status);

    long countByIsPremiumTrue();
}

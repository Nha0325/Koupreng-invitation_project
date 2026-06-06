package com.koupreng.backend.repository;

import com.koupreng.backend.entity.invitation.InvitationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvitationTemplateRepository extends JpaRepository<InvitationTemplate, Long> {

    List<InvitationTemplate> findAllByOrderByCreatedAtDesc();

    long countByStatusIgnoreCase(String status);

    long countByIsPremiumTrue();
}

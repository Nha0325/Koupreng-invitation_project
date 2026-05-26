package com.koupreng.backend.repository;

import com.koupreng.backend.entity.invitation.InvitationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvitationTemplateRepository extends JpaRepository<InvitationTemplate, Long> {
}

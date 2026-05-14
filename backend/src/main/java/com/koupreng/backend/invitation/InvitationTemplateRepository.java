package com.koupreng.backend.invitation;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InvitationTemplateRepository extends JpaRepository<InvitationTemplate, Long> {

    List<InvitationTemplate> findByCategory(TemplateCategory category);

    List<InvitationTemplate> findByEventType(EventType eventType);

    List<InvitationTemplate> findByCategoryAndEventType(TemplateCategory category, EventType eventType);
}

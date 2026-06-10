package com.koupreng.backend.service;

import com.koupreng.backend.dto.template.TemplateResponse;
import com.koupreng.backend.repository.InvitationTemplateRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TemplateCatalogService {

    private final InvitationTemplateRepository templateRepository;

    public TemplateCatalogService(InvitationTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    @Transactional(readOnly = true)
    public List<TemplateResponse> list() {
        return templateRepository.findAll(Sort.by(Sort.Direction.ASC, "id")).stream()
                .map(TemplateResponse::from)
                .toList();
    }
}

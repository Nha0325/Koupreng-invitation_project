package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.template.PublicTemplateResponse;
import com.koupreng.backend.dto.template.TemplateResponse;
import com.koupreng.backend.repository.InvitationTemplateRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TemplateCatalogService {

    private static final String STATUS_ACTIVE = "ACTIVE";
    private static final String KEEP_TEMPLATE_CODE = "garden-royal-khmer-wedding";

    private final InvitationTemplateRepository templateRepository;

    public TemplateCatalogService(InvitationTemplateRepository templateRepository) {
        this.templateRepository = templateRepository;
    }

    @Transactional(readOnly = true)
    public List<PublicTemplateResponse> listActiveTemplates() {
        return templateRepository.findAllByCodeIgnoreCaseAndStatusIgnoreCaseOrderBySortOrderAscCreatedAtDesc(KEEP_TEMPLATE_CODE, STATUS_ACTIVE).stream()
                .map(PublicTemplateResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PublicTemplateResponse getActiveTemplate(Long templateId) {
        return templateRepository.findByIdAndStatusIgnoreCase(templateId, STATUS_ACTIVE)
                .filter(template -> KEEP_TEMPLATE_CODE.equalsIgnoreCase(template.getCode()))
                .map(PublicTemplateResponse::from)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Template not found"));
    }

    @Transactional(readOnly = true)
    public PublicTemplateResponse getActiveTemplateByCode(String code) {
        if (!KEEP_TEMPLATE_CODE.equalsIgnoreCase(code)) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Template not found");
        }
        return templateRepository.findByCodeIgnoreCaseAndStatusIgnoreCase(code, STATUS_ACTIVE)
                .map(PublicTemplateResponse::from)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Template not found"));
    }

    @Transactional(readOnly = true)
    public List<TemplateResponse> list() {
        return templateRepository.findAllByCodeIgnoreCaseOrderByCreatedAtDesc(KEEP_TEMPLATE_CODE).stream()
                .map(TemplateResponse::from)
                .toList();
    }
}

package com.koupreng.backend.controller;

import com.koupreng.backend.dto.ApiResponse;
import com.koupreng.backend.dto.template.TemplateResponse;
import com.koupreng.backend.service.TemplateCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/templates")
public class TemplateController {

    private final TemplateCatalogService templateCatalogService;

    public TemplateController(TemplateCatalogService templateCatalogService) {
        this.templateCatalogService = templateCatalogService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TemplateResponse>>> list() {
        return ResponseEntity.ok(ApiResponse.success(
                "Templates fetched successfully",
                templateCatalogService.list()
        ));
    }
}

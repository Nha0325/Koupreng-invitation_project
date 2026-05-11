package com.koupreng.backend.security;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ApiWebMvcConfig implements WebMvcConfigurer {

    private final ApiSecurityProperties apiSecurityProperties;
    private final FileUploadValidator fileUploadValidator;

    public ApiWebMvcConfig(
            ApiSecurityProperties apiSecurityProperties,
            FileUploadValidator fileUploadValidator
    ) {
        this.apiSecurityProperties = apiSecurityProperties;
        this.fileUploadValidator = fileUploadValidator;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new FileUploadValidationInterceptor(apiSecurityProperties, fileUploadValidator))
                .addPathPatterns("/api/**");
    }
}

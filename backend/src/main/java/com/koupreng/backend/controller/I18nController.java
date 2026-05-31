package com.koupreng.backend.controller;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import com.koupreng.backend.common.MessageService;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Demonstrates localized responses for the two supported languages:
 * English ({@code en}) and Khmer ({@code km}).
 *
 * <p>The language is chosen via the {@code Accept-Language} request header.
 * Examples:
 * <pre>
 *     curl http://localhost:8080/api/v1/i18n/welcome -H "Accept-Language: en"
 *     curl http://localhost:8080/api/v1/i18n/welcome -H "Accept-Language: km"
 * </pre>
 */
@RestController
@RequestMapping("/api/v1/i18n")
public class I18nController {

    private final MessageService messageService;

    public I18nController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/welcome")
    public Map<String, Object> welcome() {
        Locale locale = LocaleContextHolder.getLocale();
        return Map.of(
                "language", locale.getLanguage(),
                "welcome", messageService.get("app.welcome"),
                "message", messageService.get("app.language.current")
        );
    }

    @GetMapping("/languages")
    public Map<String, Object> supportedLanguages() {
        return Map.of(
                "default", "en",
                "supported", List.of(
                        Map.of("code", "en", "name", "English"),
                        Map.of("code", "km", "name", "Khmer (ភាសាខ្មែរ)")
                )
        );
    }
}

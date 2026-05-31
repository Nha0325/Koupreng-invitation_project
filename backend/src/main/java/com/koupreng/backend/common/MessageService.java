package com.koupreng.backend.common;

import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Service;

/**
 * Thin wrapper around {@link MessageSource} that resolves localized messages
 * using the locale of the current request (English or Khmer).
 *
 * <p>Usage:
 * <pre>
 *     messageService.get("error.resource.notFound");
 *     messageService.get("greeting.hello", userName);
 * </pre>
 */
@Service
public class MessageService {

    private final MessageSource messageSource;

    public MessageService(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    /**
     * Resolve a message for the current request locale.
     *
     * @param code the message key
     * @param args optional message arguments
     * @return the localized message, or the code itself if no translation exists
     */
    public String get(String code, Object... args) {
        return get(code, LocaleContextHolder.getLocale(), args);
    }

    /**
     * Resolve a message for an explicit locale.
     *
     * @param code   the message key
     * @param locale the target locale
     * @param args   optional message arguments
     * @return the localized message, or the code itself if no translation exists
     */
    public String get(String code, Locale locale, Object... args) {
        return messageSource.getMessage(code, args, code, locale);
    }
}

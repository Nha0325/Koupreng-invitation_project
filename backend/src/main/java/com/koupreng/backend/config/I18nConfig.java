package com.koupreng.backend.config;

import java.util.List;
import java.util.Locale;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

/**
 * Internationalization (i18n) configuration.
 *
 * <p>Supports two languages:
 * <ul>
 *     <li>English ({@code en}) - default</li>
 *     <li>Khmer ({@code km})</li>
 * </ul>
 *
 * <p>The active locale per request is resolved from the {@code Accept-Language}
 * HTTP header. Clients may also force a language by sending {@code Accept-Language: km}
 * or {@code Accept-Language: en}.
 */
@Configuration
public class I18nConfig {

    /** English locale (default). */
    public static final Locale ENGLISH = Locale.ENGLISH;

    /** Khmer locale. */
    public static final Locale KHMER = Locale.forLanguageTag("km");

    /**
     * Message source backed by the UTF-8 encoded property bundles under
     * {@code classpath:i18n/messages*.properties}.
     */
    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:i18n/messages");
        messageSource.setDefaultEncoding("UTF-8");
        messageSource.setDefaultLocale(ENGLISH);
        messageSource.setFallbackToSystemLocale(false);
        messageSource.setUseCodeAsDefaultMessage(true);
        messageSource.setCacheSeconds(10);
        return messageSource;
    }

    /**
     * Resolves the request locale from the {@code Accept-Language} header,
     * limited to the languages this application actually supports.
     */
    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver localeResolver = new AcceptHeaderLocaleResolver();
        localeResolver.setSupportedLocales(List.of(ENGLISH, KHMER));
        localeResolver.setDefaultLocale(ENGLISH);
        return localeResolver;
    }
}

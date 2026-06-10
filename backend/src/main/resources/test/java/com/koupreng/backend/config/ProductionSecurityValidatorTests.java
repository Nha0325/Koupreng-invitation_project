package com.koupreng.backend.config;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Set;

import com.koupreng.backend.config.AppProperties.RateLimit.Backend;
import com.koupreng.backend.security.ApiSecurityProperties;
import com.koupreng.backend.waf.WafProperties;

import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

class ProductionSecurityValidatorTests {

    @Test
    void acceptsSecureProductionConfiguration() {
        ProductionSecurityValidator validator = validator(
                "a".repeat(64),
                "jdbc:mysql://db.example.com:3306/koupreng_db?sslMode=VERIFY_IDENTITY&serverTimezone=UTC"
        );

        assertDoesNotThrow(validator::validateProductionConfiguration);
    }

    @Test
    void rejectsWeakProductionJwtSecret() {
        ProductionSecurityValidator validator = validator(
                "change_this_to_a_random_64_plus_character_secret_generated_by_openssl",
                "jdbc:mysql://db.example.com:3306/koupreng_db?sslMode=VERIFY_IDENTITY&serverTimezone=UTC"
        );

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                validator::validateProductionConfiguration
        );

        assertTrue(exception.getMessage().contains("JWT_SECRET"));
    }

    @Test
    void rejectsInsecureProductionDatabaseUrl() {
        ProductionSecurityValidator validator = validator(
                "a".repeat(64),
                "jdbc:mysql://db.example.com:3306/koupreng_db?useSSL=false&allowPublicKeyRetrieval=true"
        );

        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                validator::validateProductionConfiguration
        );

        assertTrue(exception.getMessage().contains("DB_URL"));
    }

    private ProductionSecurityValidator validator(String jwtSecret, String databaseUrl) {
        AppProperties appProperties = new AppProperties();
        appProperties.getJwt().setIssuer("koupreng-backend");
        appProperties.getJwt().setSecret(jwtSecret);
        appProperties.getRateLimit().setBackend(Backend.REDIS);
        appProperties.getRateLimit().setFailClosed(true);

        ApiSecurityProperties apiSecurityProperties = new ApiSecurityProperties();
        apiSecurityProperties.getHttps().setRequired(true);
        apiSecurityProperties.getHttps().setHstsEnabled(true);
        apiSecurityProperties.getHttps().setHstsMaxAgeSeconds(31_536_000);
        apiSecurityProperties.getCors().setAllowedOrigins(Set.of("https://app.example.com"));
        apiSecurityProperties.getClientAddress().setForwardedHeadersEnabled(true);

        WafProperties wafProperties = new WafProperties();
        wafProperties.setEnabled(true);
        wafProperties.setAuditOnly(false);

        MockEnvironment environment = new MockEnvironment()
                .withProperty("spring.datasource.url", databaseUrl)
                .withProperty("spring.jpa.hibernate.ddl-auto", "none");

        return new ProductionSecurityValidator(
                environment,
                appProperties,
                apiSecurityProperties,
                wafProperties
        );
    }
}

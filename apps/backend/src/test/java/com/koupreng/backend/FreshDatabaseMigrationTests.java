package com.koupreng.backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

@SpringBootTest
@ActiveProfiles("test")
@EnabledIfEnvironmentVariable(named = "RUN_FLYWAY_INTEGRATION", matches = "true")
class FreshDatabaseMigrationTests {

    @DynamicPropertySource
    static void databaseProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", () -> requiredEnvironment("FLYWAY_TEST_DB_URL"));
        registry.add("spring.datasource.username", () -> requiredEnvironment("FLYWAY_TEST_DB_USERNAME"));
        registry.add("spring.datasource.password", () -> requiredEnvironment("FLYWAY_TEST_DB_PASSWORD"));
        registry.add("spring.datasource.driver-class-name", () -> "com.mysql.cj.jdbc.Driver");
        registry.add("spring.flyway.enabled", () -> true);
        registry.add("spring.flyway.validate-on-migrate", () -> true);
        registry.add("spring.flyway.baseline-on-migrate", () -> false);
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
        registry.add("spring.jpa.database-platform", () -> "org.hibernate.dialect.MySQLDialect");
        registry.add("spring.jpa.properties.hibernate.boot.allow_jdbc_metadata_access", () -> true);
    }

    @Test
    void migrationsApplyAndHibernateValidatesTheFreshSchema() {
        // Context startup performs Flyway migration followed by Hibernate schema validation.
    }

    private static String requiredEnvironment(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException(name + " is required when RUN_FLYWAY_INTEGRATION=true");
        }
        return value;
    }
}

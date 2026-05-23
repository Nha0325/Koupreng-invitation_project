package com.koupreng.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"app.jwt.secret=local_test_jwt_secret_64_characters_or_longer_for_context_loads_123456",
		"spring.flyway.enabled=false",
		"spring.jpa.hibernate.ddl-auto=none",
		"spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect",
		"spring.jpa.properties.hibernate.boot.allow_jdbc_metadata_access=false",
		"spring.datasource.hikari.initialization-fail-timeout=0"
})
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}

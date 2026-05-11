package com.koupreng.backend.config;

import java.nio.charset.StandardCharsets;
import java.util.Set;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.koupreng.backend.auth.AppUserRepository;
import com.nimbusds.jose.jwk.source.ImmutableSecret;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    private static final Set<String> UNSAFE_JWT_SECRETS = Set.of(
            "local-development-jwt-secret-change-me-32-chars",
            "change_me_to_a_random_secret_with_at_least_32_chars"
    );

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AppJwtAuthenticationConverter jwtAuthenticationConverter
    ) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/api/health").permitAll()
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password"
                        ).permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
                )
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AppJwtAuthenticationConverter jwtAuthenticationConverter(AppUserRepository userRepository) {
        return new AppJwtAuthenticationConverter(userRepository);
    }

    @Bean
    public JwtEncoder jwtEncoder(AppProperties appProperties) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey(appProperties.getJwt().getSecret())));
    }

    @Bean
    public JwtDecoder jwtDecoder(AppProperties appProperties) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder.withSecretKey(jwtSecretKey(appProperties.getJwt().getSecret()))
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        OAuth2TokenValidator<Jwt> validator = JwtValidators.createDefaultWithIssuer(appProperties.getJwt().getIssuer());
        decoder.setJwtValidator(validator);
        return decoder;
    }

    private SecretKey jwtSecretKey(String secret) {
        if (UNSAFE_JWT_SECRETS.contains(secret)) {
            throw new IllegalStateException("app.jwt.secret must be replaced with a strong random value");
        }

        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 32) {
            throw new IllegalStateException("app.jwt.secret must be at least 32 characters for HS256");
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }
}

package com.koupreng.backend.config;

import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Set;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.koupreng.backend.auth.AppUserRepository;
import com.koupreng.backend.security.ApiRequestLoggingFilter;
import com.koupreng.backend.security.ApiSecurityProperties;
import com.koupreng.backend.waf.WafFilter;
import com.koupreng.backend.waf.WafProperties;
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
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.util.matcher.AnyRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private static final Set<String> UNSAFE_JWT_SECRETS = Set.of(
            "local-development-jwt-secret-change-me-32-chars",
            "change_me_to_a_random_secret_with_at_least_32_chars",
            "replace_with_a_random_64_character_or_longer_secret"
    );

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AppJwtAuthenticationConverter jwtAuthenticationConverter,
            WafProperties wafProperties,
            ApiSecurityProperties apiSecurityProperties,
            CorsConfigurationSource corsConfigurationSource
    ) throws Exception {
        WafFilter wafFilter = new WafFilter(wafProperties);
        ApiRequestLoggingFilter apiRequestLoggingFilter =
                new ApiRequestLoggingFilter(apiSecurityProperties.getLogging());

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'none'; frame-ancestors 'none'; base-uri 'none'"))
                        .frameOptions(frame -> frame.deny())
                        .referrerPolicy(referrer -> referrer.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER))
                        .httpStrictTransportSecurity(hsts -> {
                            if (apiSecurityProperties.getHttps().isHstsEnabled()) {
                                hsts.includeSubDomains(true)
                                        .maxAgeInSeconds(apiSecurityProperties.getHttps().getHstsMaxAgeSeconds());
                            } else {
                                hsts.disable();
                            }
                        })
                )
                .addFilterBefore(wafFilter, BearerTokenAuthenticationFilter.class)
                .addFilterBefore(apiRequestLoggingFilter, WafFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/api/health").permitAll()
                        .requestMatchers(
                                "/api/auth/register",
                                "/api/auth/login",
                                "/api/auth/forgot-password",
                                "/api/auth/reset-password"
                        ).permitAll()
                        .requestMatchers("/api/invitations/templates", "/api/invitations/templates/**").permitAll()
                        .requestMatchers("/api/invitations/shared/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter))
                )
                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable());

        if (apiSecurityProperties.getCors().isEnabled()) {
            http.cors(cors -> cors.configurationSource(corsConfigurationSource));
        } else {
            http.cors(cors -> cors.disable());
        }

        if (apiSecurityProperties.getHttps().isRequired()) {
            http.redirectToHttps(https -> https.requestMatchers(AnyRequestMatcher.INSTANCE));
        }

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

    @Bean
    public CorsConfigurationSource corsConfigurationSource(ApiSecurityProperties apiSecurityProperties) {
        ApiSecurityProperties.Cors corsProperties = apiSecurityProperties.getCors();

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.copyOf(corsProperties.getAllowedOrigins()));
        configuration.setAllowedMethods(List.copyOf(corsProperties.getAllowedMethods()));
        configuration.setAllowedHeaders(List.copyOf(corsProperties.getAllowedHeaders()));
        configuration.setExposedHeaders(List.copyOf(corsProperties.getExposedHeaders()));
        configuration.setAllowCredentials(false);
        configuration.setMaxAge(corsProperties.getMaxAgeSeconds());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    private SecretKey jwtSecretKey(String secret) {
        if (UNSAFE_JWT_SECRETS.contains(secret)) {
            throw new IllegalStateException("app.jwt.secret must be replaced with a strong random value");
        }

        byte[] bytes = secret.getBytes(StandardCharsets.UTF_8);
        if (bytes.length < 64) {
            throw new IllegalStateException("app.jwt.secret must be at least 64 characters for HS256");
        }
        return new SecretKeySpec(bytes, "HmacSHA256");
    }
}

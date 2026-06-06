package com.koupreng.backend.config;

import java.nio.charset.StandardCharsets;
import java.util.List;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.koupreng.backend.repository.AppUserRepository;
import com.koupreng.backend.security.AuthRateLimitFilter;
import com.koupreng.backend.security.AdminPaymentSecretFilter;
import com.koupreng.backend.security.ApiRequestLoggingFilter;
import com.koupreng.backend.security.ApiSecurityProperties;
import com.koupreng.backend.security.ClientAddressResolver;
import com.koupreng.backend.security.CookieBearerTokenResolver;
import com.koupreng.backend.service.RateLimitService;
import com.koupreng.backend.waf.WafFilter;
import com.koupreng.backend.waf.WafProperties;
import com.nimbusds.jose.jwk.source.ImmutableSecret;

import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.resource.web.BearerTokenResolver;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.security.web.util.matcher.AnyRequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            AppJwtAuthenticationConverter jwtAuthenticationConverter,
            WafProperties wafProperties,
            ApiSecurityProperties apiSecurityProperties,
            AppProperties appProperties,
            CorsConfigurationSource corsConfigurationSource,
            BearerTokenResolver bearerTokenResolver,
            AdminPaymentSecretFilter adminPaymentSecretFilter,
            RateLimitService rateLimitService,
            ClientAddressResolver clientAddressResolver
    ) throws Exception {
        WafFilter wafFilter = new WafFilter(wafProperties, rateLimitService, clientAddressResolver);
        AuthRateLimitFilter authRateLimitFilter = new AuthRateLimitFilter(
                appProperties.getAuth(),
                rateLimitService,
                clientAddressResolver
        );
        ApiRequestLoggingFilter apiRequestLoggingFilter =
                new ApiRequestLoggingFilter(apiSecurityProperties.getLogging());

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .contentSecurityPolicy(csp -> csp.policyDirectives(
                                "default-src 'none'; frame-ancestors 'none'; base-uri 'none'"))
                        .frameOptions(frame -> frame.deny())
                        .referrerPolicy(referrer -> referrer.policy(
                                ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER))
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
                .addFilterBefore(adminPaymentSecretFilter, BearerTokenAuthenticationFilter.class)
                .addFilterAfter(authRateLimitFilter, WafFilter.class)
                .addFilterBefore(apiRequestLoggingFilter, WafFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                        .requestMatchers("/", "/api/health").permitAll()
                        .requestMatchers("/uploads/**").permitAll()
                        .requestMatchers("/actuator/health", "/actuator/health/**",
                                "/actuator/info", "/actuator/prometheus").permitAll()
                        .requestMatchers("/actuator/**").hasRole("ADMIN")
                        .requestMatchers("/api/auth/login", "/api/auth/register",
                                "/api/auth/google", "/api/auth/telegram",
                                "/api/auth/forgot-password", "/api/auth/reset-password").permitAll()
                        .requestMatchers("/api/invitations/templates",
                                "/api/invitations/templates/**").permitAll()
                        .requestMatchers("/api/invitations/shared/**").permitAll()
                        .requestMatchers("/api/v1/templates",
                                "/api/v1/templates/**").permitAll()
                        .requestMatchers("/api/v1/public/invitations/**").permitAll()
                        .requestMatchers("/api/v1/payway/callback",
                                "/api/v1/payway/return",
                                "/api/v1/payway/cancel").permitAll()
                        .requestMatchers("/api/v1/internal/template-payments/**").permitAll()
                        .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .bearerTokenResolver(bearerTokenResolver)
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
    public AppJwtAuthenticationConverter jwtAuthenticationConverter(AppUserRepository userRepository) {
        return new AppJwtAuthenticationConverter(userRepository);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtEncoder jwtEncoder(AppProperties appProperties) {
        return new NimbusJwtEncoder(new ImmutableSecret<>(jwtSecretKey(appProperties)));
    }

    @Bean
    public JwtDecoder jwtDecoder(AppProperties appProperties) {
        NimbusJwtDecoder decoder = NimbusJwtDecoder
                .withSecretKey(jwtSecretKey(appProperties))
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
        decoder.setJwtValidator(JwtValidators.createDefaultWithIssuer(appProperties.getJwt().getIssuer()));
        return decoder;
    }

    @Bean
    public BearerTokenResolver bearerTokenResolver(AppProperties appProperties) {
        return new CookieBearerTokenResolver(appProperties.getAuth().getCookie());
    }

    @Bean
    public FilterRegistrationBean<AdminPaymentSecretFilter> adminPaymentSecretFilterRegistration(
            AdminPaymentSecretFilter adminPaymentSecretFilter
    ) {
        FilterRegistrationBean<AdminPaymentSecretFilter> registration =
                new FilterRegistrationBean<>(adminPaymentSecretFilter);
        registration.setEnabled(false);
        return registration;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource(ApiSecurityProperties apiSecurityProperties) {
        ApiSecurityProperties.Cors corsProperties = apiSecurityProperties.getCors();

        if (corsProperties.isAllowCredentials() && corsProperties.getAllowedOrigins().contains("*")) {
            throw new IllegalStateException(
                    "CORS_ALLOW_CREDENTIALS cannot be true when CORS_ALLOWED_ORIGINS contains *"
            );
        }

        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.copyOf(corsProperties.getAllowedOrigins()));
        configuration.setAllowedMethods(List.copyOf(corsProperties.getAllowedMethods()));
        configuration.setAllowedHeaders(List.copyOf(corsProperties.getAllowedHeaders()));
        configuration.setExposedHeaders(List.copyOf(corsProperties.getExposedHeaders()));
        configuration.setAllowCredentials(corsProperties.isAllowCredentials());
        configuration.setMaxAge(corsProperties.getMaxAgeSeconds());

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/v1/internal/**", new CorsConfiguration());
        source.registerCorsConfiguration("/api/**", configuration);
        return source;
    }

    private SecretKey jwtSecretKey(AppProperties appProperties) {
        byte[] secret = appProperties.getJwt().getSecret().getBytes(StandardCharsets.UTF_8);
        return new SecretKeySpec(secret, "HmacSHA256");
    }
}

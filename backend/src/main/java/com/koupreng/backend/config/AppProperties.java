package com.koupreng.backend.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    @Valid
    private final Supabase supabase = new Supabase();

    @Valid
    private final RateLimit rateLimit = new RateLimit();

    public Supabase getSupabase() {
        return supabase;
    }

    public RateLimit getRateLimit() {
        return rateLimit;
    }

    public static class Supabase {

        @NotBlank
        private String issuer;

        @NotBlank
        private String jwkSetUri;

        public String getIssuer() {
            return issuer;
        }

        public void setIssuer(String issuer) {
            this.issuer = issuer;
        }

        public String getJwkSetUri() {
            return jwkSetUri;
        }

        public void setJwkSetUri(String jwkSetUri) {
            this.jwkSetUri = jwkSetUri;
        }
    }

    public static class RateLimit {

        private Backend backend = Backend.MEMORY;

        @NotBlank
        private String redisKeyPrefix = "koupreng:rate-limit:";

        private boolean failClosed = true;

        public Backend getBackend() {
            return backend;
        }

        public void setBackend(Backend backend) {
            this.backend = backend == null ? Backend.MEMORY : backend;
        }

        public String getRedisKeyPrefix() {
            return redisKeyPrefix;
        }

        public void setRedisKeyPrefix(String redisKeyPrefix) {
            this.redisKeyPrefix = redisKeyPrefix;
        }

        public boolean isFailClosed() {
            return failClosed;
        }

        public void setFailClosed(boolean failClosed) {
            this.failClosed = failClosed;
        }

        public enum Backend {
            MEMORY,
            REDIS
        }
    }
}

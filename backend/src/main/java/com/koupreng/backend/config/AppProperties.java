package com.koupreng.backend.config;

import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.Valid;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    @Valid
    private final Jwt jwt = new Jwt();

    @Min(1)
    private long passwordResetTokenMinutes;

    @Min(1)
    private long emailVerificationTokenMinutes;

    @Valid
    private final PasswordReset passwordReset = new PasswordReset();

    @Valid
    private final EmailVerification emailVerification = new EmailVerification();

    @Valid
    private final Auth auth = new Auth();

    @Valid
    private final Oauth oauth = new Oauth();

    @Valid
    private final RateLimit rateLimit = new RateLimit();

    public Jwt getJwt() {
        return jwt;
    }

    public long getPasswordResetTokenMinutes() {
        return passwordResetTokenMinutes;
    }

    public void setPasswordResetTokenMinutes(long passwordResetTokenMinutes) {
        this.passwordResetTokenMinutes = passwordResetTokenMinutes;
    }

    public long getEmailVerificationTokenMinutes() {
        return emailVerificationTokenMinutes;
    }

    public void setEmailVerificationTokenMinutes(long emailVerificationTokenMinutes) {
        this.emailVerificationTokenMinutes = emailVerificationTokenMinutes;
    }

    public PasswordReset getPasswordReset() {
        return passwordReset;
    }

    public EmailVerification getEmailVerification() {
        return emailVerification;
    }

    public Auth getAuth() {
        return auth;
    }

    public Oauth getOauth() {
        return oauth;
    }

    public RateLimit getRateLimit() {
        return rateLimit;
    }

    public static class Jwt {

        @NotBlank
        @Size(min = 64)
        private String secret;

        @NotBlank
        private String issuer;

        @Min(1)
        private long accessTokenMinutes;

        public String getSecret() {
            return secret;
        }

        public void setSecret(String secret) {
            this.secret = secret;
        }

        public String getIssuer() {
            return issuer;
        }

        public void setIssuer(String issuer) {
            this.issuer = issuer;
        }

        public long getAccessTokenMinutes() {
            return accessTokenMinutes;
        }

        public void setAccessTokenMinutes(long accessTokenMinutes) {
            this.accessTokenMinutes = accessTokenMinutes;
        }
    }

    public static class PasswordReset {

        @NotBlank
        private String frontendUrl;

        @NotBlank
        @Email
        private String emailFrom;

        private boolean logTokenInDevelopment;

        public String getFrontendUrl() {
            return frontendUrl;
        }

        public void setFrontendUrl(String frontendUrl) {
            this.frontendUrl = frontendUrl;
        }

        public String getEmailFrom() {
            return emailFrom;
        }

        public void setEmailFrom(String emailFrom) {
            this.emailFrom = emailFrom;
        }

        public boolean isLogTokenInDevelopment() {
            return logTokenInDevelopment;
        }

        public void setLogTokenInDevelopment(boolean logTokenInDevelopment) {
            this.logTokenInDevelopment = logTokenInDevelopment;
        }
    }

    public static class Auth {

        private boolean firstUserAdminEnabled;

        public boolean isFirstUserAdminEnabled() {
            return firstUserAdminEnabled;
        }

        public void setFirstUserAdminEnabled(boolean firstUserAdminEnabled) {
            this.firstUserAdminEnabled = firstUserAdminEnabled;
        }
    }

    public static class EmailVerification {

        @NotBlank
        private String frontendUrl;

        private boolean logTokenInDevelopment;

        public String getFrontendUrl() {
            return frontendUrl;
        }

        public void setFrontendUrl(String frontendUrl) {
            this.frontendUrl = frontendUrl;
        }

        public boolean isLogTokenInDevelopment() {
            return logTokenInDevelopment;
        }

        public void setLogTokenInDevelopment(boolean logTokenInDevelopment) {
            this.logTokenInDevelopment = logTokenInDevelopment;
        }
    }

    public static class Oauth {

        @Valid
        private final Google google = new Google();

        @Valid
        private final Telegram telegram = new Telegram();

        public Google getGoogle() {
            return google;
        }

        public Telegram getTelegram() {
            return telegram;
        }

        public static class Google {

            private List<String> clientIds = new ArrayList<>();

            @NotBlank
            private String jwkSetUri = "https://www.googleapis.com/oauth2/v3/certs";

            public List<String> getClientIds() {
                return clientIds;
            }

            public void setClientIds(List<String> clientIds) {
                this.clientIds = clientIds == null ? new ArrayList<>() : clientIds;
            }

            public String getJwkSetUri() {
                return jwkSetUri;
            }

            public void setJwkSetUri(String jwkSetUri) {
                this.jwkSetUri = jwkSetUri;
            }
        }

        public static class Telegram {

            private String botToken = "";

            private String clientId = "";

            @NotBlank
            private String jwkSetUri = "https://oauth.telegram.org/.well-known/jwks.json";

            @Min(60)
            private long authMaxAgeSeconds = 86400;

            @NotBlank
            private String emailDomain = "telegram.local";

            public String getBotToken() {
                return botToken;
            }

            public void setBotToken(String botToken) {
                this.botToken = botToken;
            }

            public String getClientId() {
                return clientId;
            }

            public void setClientId(String clientId) {
                this.clientId = clientId;
            }

            public String getJwkSetUri() {
                return jwkSetUri;
            }

            public void setJwkSetUri(String jwkSetUri) {
                this.jwkSetUri = jwkSetUri;
            }

            public long getAuthMaxAgeSeconds() {
                return authMaxAgeSeconds;
            }

            public void setAuthMaxAgeSeconds(long authMaxAgeSeconds) {
                this.authMaxAgeSeconds = authMaxAgeSeconds;
            }

            public String getEmailDomain() {
                return emailDomain;
            }

            public void setEmailDomain(String emailDomain) {
                this.emailDomain = emailDomain;
            }
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

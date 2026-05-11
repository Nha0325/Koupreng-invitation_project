package com.koupreng.backend.config;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    @Valid
    private final Jwt jwt = new Jwt();

    @Min(1)
    private long passwordResetTokenMinutes;

    @Valid
    private final PasswordReset passwordReset = new PasswordReset();

    @Valid
    private final Auth auth = new Auth();

    public Jwt getJwt() {
        return jwt;
    }

    public long getPasswordResetTokenMinutes() {
        return passwordResetTokenMinutes;
    }

    public void setPasswordResetTokenMinutes(long passwordResetTokenMinutes) {
        this.passwordResetTokenMinutes = passwordResetTokenMinutes;
    }

    public PasswordReset getPasswordReset() {
        return passwordReset;
    }

    public Auth getAuth() {
        return auth;
    }

    public static class Jwt {

        @NotBlank
        @Size(min = 32)
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
}

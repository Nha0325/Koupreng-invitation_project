package com.koupreng.backend.service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.Locale;

import com.koupreng.backend.dto.AuthResponse;
import com.koupreng.backend.dto.ForgotPasswordResponse;
import com.koupreng.backend.dto.GoogleLoginRequest;
import com.koupreng.backend.dto.LoginRequest;
import com.koupreng.backend.dto.MessageResponse;
import com.koupreng.backend.dto.RegisterRequest;
import com.koupreng.backend.dto.ResetPasswordRequest;
import com.koupreng.backend.dto.TelegramLoginRequest;
import com.koupreng.backend.dto.UserResponse;
import com.koupreng.backend.dto.VerifyEmailRequest;
import com.koupreng.backend.entity.AppUser;
import com.koupreng.backend.entity.AuthProvider;
import com.koupreng.backend.entity.EmailVerificationToken;
import com.koupreng.backend.entity.PasswordResetToken;
import com.koupreng.backend.entity.Role;
import com.koupreng.backend.repository.AppUserRepository;
import com.koupreng.backend.repository.EmailVerificationTokenRepository;
import com.koupreng.backend.repository.PasswordResetTokenRepository;
import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.config.AppProperties;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final String PASSWORD_RESET_MESSAGE = "If the email exists, password reset instructions will be sent";
    private static final String VERIFICATION_EMAIL_MESSAGE = "If the email needs verification, verification instructions will be sent";

    private final AppUserRepository userRepository;
    private final PasswordResetTokenRepository resetTokenRepository;
    private final EmailVerificationTokenRepository emailVerificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenHashingService tokenHashingService;
    private final PasswordResetNotificationService passwordResetNotificationService;
    private final EmailVerificationNotificationService emailVerificationNotificationService;
    private final AuthRateLimiter authRateLimiter;
    private final PasswordPolicy passwordPolicy;
    private final GoogleIdentityVerifier googleIdentityVerifier;
    private final TelegramIdentityVerifier telegramIdentityVerifier;
    private final boolean firstUserAdminEnabled;
    private final SecureRandom secureRandom = new SecureRandom();
    private final Duration resetTokenTtl;
    private final Duration emailVerificationTokenTtl;

    public AuthService(
            AppUserRepository userRepository,
            PasswordResetTokenRepository resetTokenRepository,
            EmailVerificationTokenRepository emailVerificationTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            TokenHashingService tokenHashingService,
            PasswordResetNotificationService passwordResetNotificationService,
            EmailVerificationNotificationService emailVerificationNotificationService,
            AuthRateLimiter authRateLimiter,
            PasswordPolicy passwordPolicy,
            GoogleIdentityVerifier googleIdentityVerifier,
            TelegramIdentityVerifier telegramIdentityVerifier,
            AppProperties appProperties
    ) {
        this.userRepository = userRepository;
        this.resetTokenRepository = resetTokenRepository;
        this.emailVerificationTokenRepository = emailVerificationTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.tokenHashingService = tokenHashingService;
        this.passwordResetNotificationService = passwordResetNotificationService;
        this.emailVerificationNotificationService = emailVerificationNotificationService;
        this.authRateLimiter = authRateLimiter;
        this.passwordPolicy = passwordPolicy;
        this.googleIdentityVerifier = googleIdentityVerifier;
        this.telegramIdentityVerifier = telegramIdentityVerifier;
        this.resetTokenTtl = Duration.ofMinutes(appProperties.getPasswordResetTokenMinutes());
        this.emailVerificationTokenTtl = Duration.ofMinutes(appProperties.getEmailVerificationTokenMinutes());
        this.firstUserAdminEnabled = appProperties.getAuth().isFirstUserAdminEnabled();
    }

    @Transactional
    public MessageResponse register(RegisterRequest request, String clientAddress) {
        authRateLimiter.checkRegister(clientAddress);
        String email = normalizeEmail(request.email());
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException(HttpStatus.CONFLICT, "Email is already registered");
        }

        passwordPolicy.validate(request.password(), email, request.fullName());

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setFullName(request.fullName().trim());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setEnabled(true);
        user.setRole(firstUserAdminEnabled && userRepository.count() == 0 ? Role.ADMIN : Role.USER);

        userRepository.save(user);
        return new MessageResponse("Registration successful. You can log in now.");
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request, String clientAddress) {
        String email = normalizeEmail(request.email());
        authRateLimiter.checkLogin(email, clientAddress);

        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!user.isEnabled() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        return authResponse(user);
    }

    @Transactional
    public AuthResponse loginWithGoogle(GoogleLoginRequest request, String clientAddress) {
        authRateLimiter.checkExternalAuth("google", clientAddress);
        ExternalAuthIdentity identity = googleIdentityVerifier.verify(request.idToken());
        return authResponse(findOrCreateExternalUser(identity));
    }

    @Transactional
    public AuthResponse loginWithTelegram(TelegramLoginRequest request, String clientAddress) {
        authRateLimiter.checkExternalAuth("telegram", clientAddress);
        ExternalAuthIdentity identity = telegramIdentityVerifier.verify(request);
        return authResponse(findOrCreateExternalUser(identity));
    }

    @Transactional
    public MessageResponse logout(Authentication authentication) {
        AppUser user = findAuthenticatedUser(authentication);
        user.incrementTokenVersion();
        return new MessageResponse("Logged out successfully");
    }

    @Transactional
    public ForgotPasswordResponse forgotPassword(String emailInput, String clientAddress) {
        String email = normalizeEmail(emailInput);
        authRateLimiter.checkForgotPassword(email, clientAddress);

        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElse(null);

        if (user == null) {
            return passwordResetResponse();
        }

        resetTokenRepository.findByUserAndUsedAtIsNull(user).forEach(PasswordResetToken::markUsed);

        String token = generateToken();
        Instant expiresAt = Instant.now().plus(resetTokenTtl);

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setTokenHash(tokenHashingService.sha256(token));
        resetToken.setExpiresAt(expiresAt);
        resetTokenRepository.save(resetToken);

        passwordResetNotificationService.sendResetLink(user, token, expiresAt);
        return passwordResetResponse();
    }

    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request, String clientAddress) {
        authRateLimiter.checkResetPassword(clientAddress);

        PasswordResetToken resetToken = resetTokenRepository.findByTokenHash(tokenHashingService.sha256(request.token()))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid reset token"));

        if (resetToken.getUsedAt() != null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Reset token has already been used");
        }

        if (resetToken.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Reset token has expired");
        }

        AppUser user = resetToken.getUser();
        passwordPolicy.validate(request.newPassword(), user);
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.incrementTokenVersion();
        resetTokenRepository.findByUserAndUsedAtIsNull(user).forEach(PasswordResetToken::markUsed);

        return new MessageResponse("Password reset successfully");
    }

    @Transactional
    public MessageResponse verifyEmail(VerifyEmailRequest request, String clientAddress) {
        authRateLimiter.checkEmailVerification(clientAddress);

        EmailVerificationToken verificationToken = emailVerificationTokenRepository
                .findByTokenHash(tokenHashingService.sha256(request.token()))
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Invalid verification token"));

        if (verificationToken.getUsedAt() != null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Verification token has already been used");
        }

        if (verificationToken.getExpiresAt().isBefore(Instant.now())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Verification token has expired");
        }

        AppUser user = verificationToken.getUser();
        user.setEnabled(true);
        emailVerificationTokenRepository.findByUserAndUsedAtIsNull(user).forEach(EmailVerificationToken::markUsed);
        return new MessageResponse("Email verified successfully");
    }

    @Transactional
    public MessageResponse resendVerificationEmail(String emailInput, String clientAddress) {
        String email = normalizeEmail(emailInput);
        authRateLimiter.checkResendVerification(email, clientAddress);

        AppUser user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (user == null || user.isEnabled() || user.getAuthProvider() != AuthProvider.LOCAL) {
            return new MessageResponse(VERIFICATION_EMAIL_MESSAGE);
        }

        emailVerificationTokenRepository.findByUserAndUsedAtIsNull(user).forEach(EmailVerificationToken::markUsed);
        sendEmailVerification(user);
        return new MessageResponse(VERIFICATION_EMAIL_MESSAGE);
    }

    private AuthResponse authResponse(AppUser user) {
        return new AuthResponse(
                jwtService.createAccessToken(user),
                "Bearer",
                jwtService.getAccessTokenTtlSeconds(),
                UserResponse.from(user)
        );
    }

    private AppUser findAuthenticatedUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadCredentialsException("Authentication required");
        }

        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new BadCredentialsException("Authentication required"));
    }

    private AppUser findOrCreateExternalUser(ExternalAuthIdentity identity) {
        AppUser providerUser = userRepository.findByAuthProviderAndProviderId(identity.provider(), identity.providerId())
                .orElse(null);
        if (providerUser != null) {
            if (!providerUser.isEnabled()) {
                throw new BadCredentialsException("Account is disabled");
            }
            return providerUser;
        }

        String email = normalizeEmail(identity.email());
        AppUser emailUser = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (emailUser != null) {
            if (!emailUser.isEnabled()) {
                throw new BadCredentialsException("Account is disabled");
            }

            if (emailUser.getProviderId() != null
                    && emailUser.getAuthProvider() == identity.provider()
                    && !identity.providerId().equals(emailUser.getProviderId())) {
                throw new BadCredentialsException("External account is linked to another user");
            }

            if (emailUser.getProviderId() != null && emailUser.getAuthProvider() != identity.provider()) {
                throw new ApiException(HttpStatus.CONFLICT, "Email is already linked to another login provider");
            }

            if (identity.provider() == AuthProvider.TELEGRAM && emailUser.getAuthProvider() == AuthProvider.LOCAL) {
                throw new ApiException(HttpStatus.CONFLICT, "Telegram account email is already registered");
            }

            if (emailUser.getProviderId() == null || emailUser.getAuthProvider() == AuthProvider.LOCAL) {
                emailUser.setAuthProvider(identity.provider());
                emailUser.setProviderId(identity.providerId());
            }

            return emailUser;
        }

        AppUser user = new AppUser();
        user.setEmail(email);
        user.setFullName(safeFullName(identity.fullName(), email));
        user.setPasswordHash(externalPasswordHash(identity));
        user.setAuthProvider(identity.provider());
        user.setProviderId(identity.providerId());
        user.setRole(firstUserAdminEnabled && userRepository.count() == 0 ? Role.ADMIN : Role.USER);
        return userRepository.save(user);
    }

    private void sendEmailVerification(AppUser user) {
        String token = generateToken();
        Instant expiresAt = Instant.now().plus(emailVerificationTokenTtl);

        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setUser(user);
        verificationToken.setTokenHash(tokenHashingService.sha256(token));
        verificationToken.setExpiresAt(expiresAt);
        emailVerificationTokenRepository.save(verificationToken);

        emailVerificationNotificationService.sendVerificationLink(user, token, expiresAt);
    }

    private String safeFullName(String fullName, String email) {
        String value = fullName == null || fullName.isBlank() ? email.split("@", 2)[0] : fullName.trim();
        return value.length() <= 120 ? value : value.substring(0, 120);
    }

    private String externalPasswordHash(ExternalAuthIdentity identity) {
        String randomSecret = generateToken();
        String marker = "external:%s:%s:%s".formatted(identity.provider(), identity.providerId(), randomSecret);
        return passwordEncoder.encode(marker);
    }

    private ForgotPasswordResponse passwordResetResponse() {
        return new ForgotPasswordResponse(PASSWORD_RESET_MESSAGE);
    }

    private String normalizeEmail(String email) {
        if (email == null || email.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Email is required");
        }
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}

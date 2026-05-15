package com.koupreng.backend.service;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.koupreng.backend.config.AppProperties;
import com.koupreng.backend.dto.AuthResponse;
import com.koupreng.backend.dto.GoogleLoginRequest;
import com.koupreng.backend.dto.LoginRequest;
import com.koupreng.backend.dto.RegisterRequest;
import com.koupreng.backend.dto.ResetPasswordRequest;

import com.koupreng.backend.dto.VerifyEmailRequest;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.AuthProvider;
import com.koupreng.backend.entity.user.EmailVerificationToken;
import com.koupreng.backend.entity.user.PasswordResetToken;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.repository.AppUserRepository;
import com.koupreng.backend.repository.EmailVerificationTokenRepository;
import com.koupreng.backend.repository.PasswordResetTokenRepository;

class AuthServiceTests {

    private final AppUserRepository userRepository = mock(AppUserRepository.class);
    private final PasswordResetTokenRepository resetTokenRepository = mock(PasswordResetTokenRepository.class);
    private final EmailVerificationTokenRepository emailVerificationTokenRepository =
            mock(EmailVerificationTokenRepository.class);
    private final JwtService jwtService = mock(JwtService.class);
    private final PasswordResetNotificationService notificationService = mock(PasswordResetNotificationService.class);
    private final EmailVerificationNotificationService emailVerificationNotificationService =
            mock(EmailVerificationNotificationService.class);
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final GoogleIdentityVerifier googleIdentityVerifier = mock(GoogleIdentityVerifier.class);
    private final TelegramIdentityVerifier telegramIdentityVerifier = mock(TelegramIdentityVerifier.class);
    private final TokenHashingService tokenHashingService = mock(TokenHashingService.class);
    private final AuthService authService = new AuthService(
            userRepository,
            resetTokenRepository,
            emailVerificationTokenRepository,
            passwordEncoder,
            jwtService,
            tokenHashingService,
            notificationService,
            emailVerificationNotificationService,
            mock(AuthRateLimiter.class),
            new PasswordPolicy(),
            googleIdentityVerifier,
            telegramIdentityVerifier,
            appProperties()
    );


    @BeforeEach
    public void setUp() {
        when(tokenHashingService.sha256(any(String.class))).thenAnswer(inv -> {
            String token = inv.getArgument(0);
            return (token + "a".repeat(64)).substring(0, 64);
        });
    }

    @Test
    void registerCreatesEnabledLocalUserWithHashedPassword() {
        when(userRepository.existsByEmailIgnoreCase("new@example.com")).thenReturn(false);
        when(userRepository.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.register(
                new RegisterRequest("New@Example.com", "Str0ng!Password", "New User"),
                "203.0.113.10"
        );

        ArgumentCaptor<AppUser> userCaptor = ArgumentCaptor.forClass(AppUser.class);
        verify(userRepository).save(userCaptor.capture());
        verify(emailVerificationTokenRepository, never()).save(any(EmailVerificationToken.class));
        verify(emailVerificationNotificationService, never()).sendVerificationLink(any(AppUser.class), any(String.class), any(Instant.class));
        AppUser savedUser = userCaptor.getValue();

        assertEquals("new@example.com", savedUser.getEmail());
        assertEquals("New User", savedUser.getFullName());
        assertEquals(AuthProvider.LOCAL, savedUser.getAuthProvider());
        assertEquals(Role.USER, savedUser.getRole());
        assertTrue(savedUser.isEnabled());
        assertNotEquals("Str0ng!Password", savedUser.getPasswordHash());
        assertTrue(passwordEncoder.matches("Str0ng!Password", savedUser.getPasswordHash()));
    }

    @Test
    void loginReturnsTokenForValidPassword() {
        AppUser user = localUser("user@example.com", "Str0ng!Password");
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(jwtService.createAccessToken(any(AppUser.class))).thenReturn("access-token");
        when(jwtService.getAccessTokenTtlSeconds()).thenReturn(3600L);

        AuthResponse response = authService.login(
                new LoginRequest("USER@example.com", "Str0ng!Password"),
                "203.0.113.10"
        );

        assertEquals("access-token", response.accessToken());
        assertEquals("user@example.com", response.user().email());
    }

    @Test
    void logoutRevokesExistingTokenVersion() {
        AppUser user = localUser("user@example.com", "Str0ng!Password");
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));

        authService.logout(new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                "user@example.com",
                "n/a",
                List.of()
        ));

        assertEquals(1, user.getTokenVersion());
    }

    @Test
    void forgotPasswordStoresHashedResetTokenAndSendsRawTokenOnlyToNotification() {
        AppUser user = localUser("user@example.com", "Str0ng!Password");
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(resetTokenRepository.findByUserAndUsedAtIsNull(user)).thenReturn(List.of());
        when(resetTokenRepository.save(any(PasswordResetToken.class))).thenAnswer(invocation -> invocation.getArgument(0));

        authService.forgotPassword("user@example.com", "203.0.113.10");

        ArgumentCaptor<PasswordResetToken> resetTokenCaptor = ArgumentCaptor.forClass(PasswordResetToken.class);
        ArgumentCaptor<String> rawTokenCaptor = ArgumentCaptor.forClass(String.class);
        verify(resetTokenRepository).save(resetTokenCaptor.capture());
        verify(notificationService).sendResetLink(eq(user), rawTokenCaptor.capture(), any(Instant.class));

        PasswordResetToken savedToken = resetTokenCaptor.getValue();
        String rawToken = rawTokenCaptor.getValue();

        assertEquals(user, savedToken.getUser());
        assertEquals(64, savedToken.getTokenHash().length());
        assertNotEquals(rawToken, savedToken.getTokenHash());
        assertNotNull(savedToken.getExpiresAt());
    }

    @Test
    void resetPasswordHashesNewPasswordMarksTokenUsedAndRevokesExistingJwt() {
        AppUser user = localUser("user@example.com", "OldStr0ng!Password");
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setUser(user);
        resetToken.setExpiresAt(Instant.now().plusSeconds(300));

        when(resetTokenRepository.findByTokenHash(any(String.class))).thenReturn(Optional.of(resetToken));
        when(resetTokenRepository.findByUserAndUsedAtIsNull(user)).thenReturn(List.of(resetToken));

        authService.resetPassword(
                new ResetPasswordRequest("raw-reset-token", "NewStr0ng!Password"),
                "203.0.113.10"
        );

        assertTrue(passwordEncoder.matches("NewStr0ng!Password", user.getPasswordHash()));
        assertFalse(passwordEncoder.matches("OldStr0ng!Password", user.getPasswordHash()));
        assertEquals(1, user.getTokenVersion());
        assertNotNull(resetToken.getUsedAt());
    }

    @Test
    void verifyEmailEnablesLocalUserAndMarksAllVerificationTokensUsed() {
        AppUser user = localUser("user@example.com", "Str0ng!Password");
        user.setEnabled(false);
        EmailVerificationToken verificationToken = new EmailVerificationToken();
        verificationToken.setUser(user);
        verificationToken.setExpiresAt(Instant.now().plusSeconds(300));

        when(emailVerificationTokenRepository.findByTokenHash(any(String.class))).thenReturn(Optional.of(verificationToken));
        when(emailVerificationTokenRepository.findByUserAndUsedAtIsNull(user)).thenReturn(List.of(verificationToken));

        authService.verifyEmail(new VerifyEmailRequest("raw-verification-token"), "203.0.113.10");

        assertTrue(user.isEnabled());
        assertNotNull(verificationToken.getUsedAt());
    }

    @Test
    void externalAuthWithLongProviderIdDoesNotExceedBcryptLimit() {
        when(userRepository.findByAuthProviderAndProviderId(any(), any())).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase(any())).thenReturn(Optional.empty());
        when(userRepository.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ExternalAuthIdentity identity = new ExternalAuthIdentity(
                AuthProvider.GOOGLE,
                "a".repeat(100),
                "long@example.com",
                "Long User"
        );
        when(googleIdentityVerifier.verify(any(String.class))).thenReturn(identity);
        when(jwtService.createAccessToken(any(AppUser.class))).thenReturn("access-token");
        when(jwtService.getAccessTokenTtlSeconds()).thenReturn(3600L);

        authService.loginWithGoogle(new GoogleLoginRequest("fake-id-token"), "203.0.113.10");

        ArgumentCaptor<AppUser> userCaptor = ArgumentCaptor.forClass(AppUser.class);
        verify(userRepository).save(userCaptor.capture());
        
        AppUser savedUser = userCaptor.getValue();
        assertEquals("long@example.com", savedUser.getEmail());
        assertTrue(savedUser.getPasswordHash() != null && savedUser.getPasswordHash().length() >= 60);
    }

    private AppUser localUser(String email, String password) {
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setFullName("Test User");
        user.setRole(Role.USER);
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setEnabled(true);
        user.setPasswordHash(passwordEncoder.encode(password));
        return user;
    }

    private static AppProperties appProperties() {
        AppProperties appProperties = new AppProperties();
        appProperties.setPasswordResetTokenMinutes(30);
        appProperties.setEmailVerificationTokenMinutes(1440);
        appProperties.getAuth().setFirstUserAdminEnabled(false);
        return appProperties;
    }
}


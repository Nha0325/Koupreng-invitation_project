package com.koupreng.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.koupreng.backend.config.AppProperties;
import com.koupreng.backend.dto.AuthResponse;
import com.koupreng.backend.dto.LoginRequest;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.repository.AppUserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;

class AuthServiceTests {

    @Test
    void loginReturnsBearerToken() {
        AppUserRepository userRepository = mock(AppUserRepository.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        JwtEncoder jwtEncoder = mock(JwtEncoder.class);
        AuthService authService = authService(userRepository, passwordEncoder, jwtEncoder);
        AppUser user = activeUser();

        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("password123", user.getPasswordHash())).thenReturn(true);
        when(jwtEncoder.encode(any(JwtEncoderParameters.class))).thenReturn(jwt("jwt-token"));

        AuthResponse response = authService.login(new LoginRequest("user@example.com", "password123"));

        assertEquals("jwt-token", response.accessToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals(1L, response.user().id());
    }

    @Test
    void logoutIncrementsTokenVersion() {
        AppUserRepository userRepository = mock(AppUserRepository.class);
        AuthService authService = authService(userRepository, mock(PasswordEncoder.class), mock(JwtEncoder.class));
        AppUser user = activeUser();
        Authentication authentication = mock(Authentication.class);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("1");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        authService.logout(authentication);

        assertEquals(1, user.getTokenVersion());
    }

    private AuthService authService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtEncoder jwtEncoder
    ) {
        AppProperties appProperties = new AppProperties();
        appProperties.getJwt().setIssuer("koupreng-backend");
        appProperties.getJwt().setSecret("local_test_jwt_secret_64_characters_or_longer_for_auth_service_tests_123456");
        return new AuthService(
                userRepository,
                passwordEncoder,
                jwtEncoder,
                appProperties,
                mock(GoogleIdentityVerifier.class),
                mock(TelegramIdentityVerifier.class)
        );
    }

    private AppUser activeUser() {
        AppUser user = new AppUser();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setFullName("Test User");
        user.setPasswordHash("hash");
        user.setRole(Role.USER);
        user.setStatus(AppUser.STATUS_ACTIVE);
        return user;
    }

    private Jwt jwt(String tokenValue) {
        return Jwt.withTokenValue(tokenValue)
                .header("alg", "HS256")
                .subject("1")
                .claim("token_version", 0)
                .build();
    }
}

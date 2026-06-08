package com.koupreng.backend.config;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.repository.AppUserRepository;

import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;

class AppJwtAuthenticationConverterTests {

    @Test
    void convertsValidTokenVersionForActiveUser() {
        AppUserRepository userRepository = mock(AppUserRepository.class);
        AppJwtAuthenticationConverter converter = new AppJwtAuthenticationConverter(userRepository);
        AppUser user = user(AppUser.STATUS_ACTIVE);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        JwtAuthenticationToken authentication = converter.convert(jwtWithTokenVersion(0));

        assertEquals("1", authentication.getName());
        assertEquals("ROLE_USER", authentication.getAuthorities().iterator().next().getAuthority());
    }

    @Test
    void rejectsDisabledUser() {
        AppUserRepository userRepository = mock(AppUserRepository.class);
        AppJwtAuthenticationConverter converter = new AppJwtAuthenticationConverter(userRepository);
        when(userRepository.findById(1L)).thenReturn(Optional.of(user(AppUser.STATUS_DISABLED)));

        BadCredentialsException exception = assertThrows(
                BadCredentialsException.class,
                () -> converter.convert(jwtWithTokenVersion(0))
        );

        assertEquals("Account is disabled", exception.getMessage());
    }

    @Test
    void rejectsOldTokenAfterLogoutChangesTokenVersion() {
        AppUserRepository userRepository = mock(AppUserRepository.class);
        AppJwtAuthenticationConverter converter = new AppJwtAuthenticationConverter(userRepository);
        AppUser user = user(AppUser.STATUS_ACTIVE);
        user.incrementTokenVersion();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        BadCredentialsException exception = assertThrows(
                BadCredentialsException.class,
                () -> converter.convert(jwtWithTokenVersion(0))
        );

        assertEquals("Authentication required", exception.getMessage());
    }

    private AppUser user(String status) {
        AppUser user = new AppUser();
        user.setId(1L);
        user.setEmail("user@example.com");
        user.setFullName("Test User");
        user.setRole(Role.USER);
        user.setStatus(status);
        return user;
    }

    private Jwt jwtWithTokenVersion(int tokenVersion) {
        return Jwt.withTokenValue("jwt-token")
                .header("alg", "HS256")
                .subject("1")
                .claim("token_version", tokenVersion)
                .build();
    }
}

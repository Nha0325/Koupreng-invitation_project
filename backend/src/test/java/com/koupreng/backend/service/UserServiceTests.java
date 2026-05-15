package com.koupreng.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.ChangePasswordRequest;
import com.koupreng.backend.dto.UpdateProfileRequest;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.AuthProvider;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.repository.AppUserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

class UserServiceTests {

    private AppUserRepository userRepository;
    private UserService userService;
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository = mock(AppUserRepository.class);
        passwordEncoder = new BCryptPasswordEncoder();
        userService = new UserService(userRepository, passwordEncoder, new PasswordPolicy());
    }

    @Test
    void updateProfileChangesCurrentUsersFullName() {
        AppUser user = localUser("user@example.com", Role.USER);
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));

        userService.updateProfile(authentication("user@example.com"), new UpdateProfileRequest("Updated Name"));

        assertEquals("Updated Name", user.getFullName());
    }

    @Test
    void changePasswordHashesNewPasswordAndRevokesExistingJwt() {
        AppUser user = localUser("user@example.com", Role.USER);
        user.setPasswordHash(passwordEncoder.encode("OldStr0ng!Password"));
        when(userRepository.findByEmailIgnoreCase("user@example.com")).thenReturn(Optional.of(user));

        userService.changePassword(
                authentication("user@example.com"),
                new ChangePasswordRequest("OldStr0ng!Password", "NewStr0ng!Password")
        );

        assertTrue(passwordEncoder.matches("NewStr0ng!Password", user.getPasswordHash()));
        assertEquals(1, user.getTokenVersion());
    }

    @Test
    void updateRolePreventsRemovingLastAdmin() {
        AppUser admin = localUser("admin@example.com", Role.ADMIN);
        when(userRepository.findById(1L)).thenReturn(Optional.of(admin));
        when(userRepository.countByRole(Role.ADMIN)).thenReturn(1L);

        assertThrows(ApiException.class, () -> userService.updateRole(1L, Role.USER));
    }

    @Test
    void updateRoleRevokesTokensWhenRoleChanges() {
        AppUser user = localUser("user@example.com", Role.USER);
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        userService.updateRole(2L, Role.ADMIN);

        assertEquals(Role.ADMIN, user.getRole());
        assertEquals(1, user.getTokenVersion());
    }

    @Test
    void listUsersMapsRepositoryUsersToResponses() {
        when(userRepository.findAll()).thenReturn(List.of(
                localUser("one@example.com", Role.USER),
                localUser("two@example.com", Role.ADMIN)
        ));

        assertEquals(2, userService.listUsers().size());
    }

    private UsernamePasswordAuthenticationToken authentication(String email) {
        return new UsernamePasswordAuthenticationToken(email, "n/a", List.of());
    }

    private AppUser localUser(String email, Role role) {
        AppUser user = new AppUser();
        user.setEmail(email);
        user.setFullName("Test User");
        user.setRole(role);
        user.setEnabled(true);
        user.setAuthProvider(AuthProvider.LOCAL);
        user.setPasswordHash(passwordEncoder.encode("Str0ng!Password"));
        return user;
    }
}


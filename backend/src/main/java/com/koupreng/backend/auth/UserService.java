package com.koupreng.backend.auth;

import java.util.List;

import com.koupreng.backend.auth.dto.ChangePasswordRequest;
import com.koupreng.backend.auth.dto.MessageResponse;
import com.koupreng.backend.auth.dto.UpdateProfileRequest;
import com.koupreng.backend.auth.dto.UserResponse;
import com.koupreng.backend.common.ApiException;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordPolicy passwordPolicy;

    public UserService(
            AppUserRepository userRepository,
            PasswordEncoder passwordEncoder,
            PasswordPolicy passwordPolicy
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordPolicy = passwordPolicy;
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(Authentication authentication) {
        return UserResponse.from(currentUser(authentication));
    }

    @Transactional
    public UserResponse updateProfile(Authentication authentication, UpdateProfileRequest request) {
        AppUser user = currentUser(authentication);
        user.setFullName(request.fullName().trim());
        return UserResponse.from(user);
    }

    @Transactional
    public MessageResponse changePassword(Authentication authentication, ChangePasswordRequest request) {
        AppUser user = currentUser(authentication);
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Current password is incorrect");
        }

        passwordPolicy.validate(request.newPassword(), user);
        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.incrementTokenVersion();
        return new MessageResponse("Password changed successfully");
    }

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse updateRole(Long userId, Role role) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));
        if (user.getRole() == Role.ADMIN && role != Role.ADMIN && userRepository.countByRole(Role.ADMIN) <= 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "At least one admin account is required");
        }

        user.setRole(role);
        user.incrementTokenVersion();
        return UserResponse.from(user);
    }

    private AppUser currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BadCredentialsException("Authentication required");
        }

        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .orElseThrow(() -> new BadCredentialsException("Authentication required"));
    }
}

package com.koupreng.backend.service;

import java.util.List;
import java.util.UUID;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.UpdateProfileRequest;
import com.koupreng.backend.dto.UserResponse;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.repository.AppUserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final AppUserRepository userRepository;

    public UserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
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

    @Transactional(readOnly = true)
    public List<UserResponse> listUsers() {
        return userRepository.findAll().stream()
                .map(UserResponse::from)
                .toList();
    }

    @Transactional
    public UserResponse updateRole(UUID userId, Role role) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getRole() == Role.ADMIN
                && role != Role.ADMIN
                && userRepository.countByRole(Role.ADMIN) <= 1) {
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
        String principal = authentication.getName();
        try {
            return userRepository.findById(UUID.fromString(principal))
                    .orElseThrow(() -> new BadCredentialsException("Authentication required"));
        } catch (IllegalArgumentException ex) {
            return userRepository.findByEmailIgnoreCase(principal)
                    .orElseThrow(() -> new BadCredentialsException("Authentication required"));
        }
    }
}

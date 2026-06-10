package com.koupreng.backend.service;

import java.util.List;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.ChangePasswordRequest;
import com.koupreng.backend.dto.UpdateProfileRequest;
import com.koupreng.backend.dto.UserResponse;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;
import com.koupreng.backend.repository.AppUserRepository;

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
    private final MessageService msg;

    public UserService(AppUserRepository userRepository, PasswordEncoder passwordEncoder, MessageService msg) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.msg = msg;
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(Authentication authentication) {
        return UserResponse.from(currentUser(authentication));
    }

    @Transactional
    public UserResponse updateProfile(Authentication authentication, UpdateProfileRequest request) {
        AppUser user = currentUser(authentication);
        user.setFullName(request.fullName().trim());
        if (request.phone() != null) {
            user.setPhone(request.phone().trim());
        }
        if (request.profileImage() != null) {
            user.setProfileImage(request.profileImage().trim());
        }
        return UserResponse.from(user);
    }

    @Transactional
    public void changePassword(Authentication authentication, ChangePasswordRequest request) {
        AppUser user = currentUser(authentication);

        if (user.getPasswordHash() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, msg.get("user.oauth-no-password"));
        }
        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, msg.get("user.password-wrong"));
        }
        if (request.currentPassword().equals(request.newPassword())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, msg.get("user.password-same"));
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        // Invalidate all previously issued tokens
        user.incrementTokenVersion();
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
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, msg.get("user.not-found")));

        if (user.getRole() == Role.ADMIN
                && role != Role.ADMIN
                && userRepository.countByRole(Role.ADMIN) <= 1) {
            throw new ApiException(HttpStatus.BAD_REQUEST, msg.get("user.role-last-admin"));
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
            return userRepository.findById(Long.valueOf(principal))
                    .orElseThrow(() -> new BadCredentialsException("Authentication required"));
        } catch (NumberFormatException ex) {
            return userRepository.findByEmailIgnoreCase(principal)
                    .orElseThrow(() -> new BadCredentialsException("Authentication required"));
        }
    }
}

package com.koupreng.backend.repository;

import java.util.Optional;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.AuthProvider;
import com.koupreng.backend.entity.user.Role;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmailIgnoreCase(String email);

    Optional<AppUser> findByAuthProviderAndProviderId(AuthProvider authProvider, String providerId);

    boolean existsByEmailIgnoreCase(String email);

    long countByRole(Role role);
}


package com.koupreng.backend.repository;

import java.util.Optional;
import java.util.UUID;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.AuthProvider;
import com.koupreng.backend.entity.user.Role;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    Optional<AppUser> findByPhone(String phone);

    Optional<AppUser> findByAuthProviderAndProviderId(AuthProvider authProvider, String providerId);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhone(String phone);

    long countByRole(Role role);
}

package com.koupreng.backend.repository;

import java.util.Optional;
import java.util.UUID;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    long countByRole(Role role);
}

package com.koupreng.backend.repository;

import java.util.Optional;
import java.util.List;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.Role;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmailIgnoreCase(String email);

    Optional<AppUser> findByPhone(String phone);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhone(String phone);

    long countByRole(Role role);

    long countByStatus(String status);

    List<AppUser> findAllByOrderByCreatedAtDesc();
}

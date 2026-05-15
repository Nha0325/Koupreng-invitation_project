package com.koupreng.backend.repository;

import java.util.List;
import java.util.Optional;

import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.entity.user.PasswordResetToken;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByTokenHash(String tokenHash);

    List<PasswordResetToken> findByUserAndUsedAtIsNull(AppUser user);
}


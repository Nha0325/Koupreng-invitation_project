package com.koupreng.backend.repository;

import java.util.List;
import java.util.Optional;

import com.koupreng.backend.entity.AppUser;
import com.koupreng.backend.entity.EmailVerificationToken;

import org.springframework.data.jpa.repository.JpaRepository;

public interface EmailVerificationTokenRepository extends JpaRepository<EmailVerificationToken, Long> {
    Optional<EmailVerificationToken> findByTokenHash(String tokenHash);

    List<EmailVerificationToken> findByUserAndUsedAtIsNull(AppUser user);
}

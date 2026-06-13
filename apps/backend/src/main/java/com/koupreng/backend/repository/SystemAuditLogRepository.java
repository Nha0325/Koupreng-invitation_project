package com.koupreng.backend.repository;

import com.koupreng.backend.entity.audit.SystemAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SystemAuditLogRepository extends JpaRepository<SystemAuditLog, Long> {

    List<SystemAuditLog> findAllByOrderByCreatedAtDesc();

    List<SystemAuditLog> findTop100ByOrderByCreatedAtDesc();
}

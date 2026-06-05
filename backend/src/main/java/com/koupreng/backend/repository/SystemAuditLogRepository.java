package com.koupreng.backend.repository;

import com.koupreng.backend.entity.audit.SystemAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemAuditLogRepository extends JpaRepository<SystemAuditLog, Long> {

    List<SystemAuditLog> findAllByOrderByCreatedAtDesc();

    List<SystemAuditLog> findTop100ByOrderByCreatedAtDesc();
}

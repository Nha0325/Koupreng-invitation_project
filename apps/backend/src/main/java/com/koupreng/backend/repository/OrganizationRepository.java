package com.koupreng.backend.repository;

import com.koupreng.backend.entity.organization.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {

    List<Organization> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);

    Optional<Organization> findBySlug(String slug);

    boolean existsBySlug(String slug);
}

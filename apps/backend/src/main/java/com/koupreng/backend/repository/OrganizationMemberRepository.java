package com.koupreng.backend.repository;

import com.koupreng.backend.entity.organization.OrganizationMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrganizationMemberRepository extends JpaRepository<OrganizationMember, Long> {

    List<OrganizationMember> findByOrganizationIdOrderByCreatedAtAsc(Long organizationId);

    List<OrganizationMember> findByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<OrganizationMember> findByIdAndOrganizationId(Long id, Long organizationId);

    Optional<OrganizationMember> findByOrganizationIdAndEmailIgnoreCase(Long organizationId, String email);

    boolean existsByOrganizationIdAndUserId(Long organizationId, Long userId);
}

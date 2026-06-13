package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.organization.OrganizationMemberRequest;
import com.koupreng.backend.dto.organization.OrganizationMemberResponse;
import com.koupreng.backend.dto.organization.OrganizationResponse;
import com.koupreng.backend.entity.organization.Organization;
import com.koupreng.backend.entity.organization.OrganizationMember;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.repository.AppUserRepository;
import com.koupreng.backend.repository.OrganizationMemberRepository;
import com.koupreng.backend.repository.OrganizationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class OrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrganizationMemberRepository memberRepository;
    private final AppUserRepository userRepository;
    private final CurrentUserService currentUserService;

    public OrganizationService(
            OrganizationRepository organizationRepository,
            OrganizationMemberRepository memberRepository,
            AppUserRepository userRepository,
            CurrentUserService currentUserService
    ) {
        this.organizationRepository = organizationRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
    }

    @Transactional(readOnly = true)
    public List<OrganizationResponse> listMine(Authentication authentication) {
        AppUser user = currentUserService.currentUser(authentication);
        Map<Long, Organization> organizations = new LinkedHashMap<>();
        organizationRepository.findByOwnerIdOrderByCreatedAtDesc(user.getId())
                .forEach(organization -> organizations.put(organization.getId(), organization));
        memberRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(OrganizationMember::getOrganization)
                .filter(organization -> organization != null && Organization.STATUS_ACTIVE.equals(organization.getStatus()))
                .forEach(organization -> organizations.putIfAbsent(organization.getId(), organization));
        return organizations.values().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public OrganizationResponse create(Authentication authentication, String name) {
        AppUser user = currentUserService.currentUser(authentication);
        Organization organization = new Organization();
        organization.setName(requireText(name, "Organization name is required"));
        organization.setSlug(uniqueSlug(slugify(organization.getName())));
        organization.setOwner(user);
        Organization saved = organizationRepository.save(organization);

        OrganizationMember ownerMember = new OrganizationMember();
        ownerMember.setOrganization(saved);
        ownerMember.setUser(user);
        ownerMember.setEmail(user.getEmail() == null ? "user-" + user.getId() + "@local" : user.getEmail());
        ownerMember.setRole(OrganizationMember.ROLE_OWNER);
        ownerMember.setStatus(OrganizationMember.STATUS_ACTIVE);
        ownerMember.setJoinedAt(Instant.now());
        memberRepository.save(ownerMember);
        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public OrganizationResponse get(Authentication authentication, Long organizationId) {
        return toResponse(requireOrganizationAccess(authentication, organizationId));
    }

    @Transactional
    public OrganizationMemberResponse addMember(
            Authentication authentication,
            Long organizationId,
            OrganizationMemberRequest request
    ) {
        Organization organization = requireOrganizationOwner(authentication, organizationId);
        String email = requireText(request.getEmail(), "Member email is required").toLowerCase(Locale.ROOT);
        OrganizationMember member = memberRepository.findByOrganizationIdAndEmailIgnoreCase(organizationId, email)
                .orElseGet(OrganizationMember::new);
        member.setOrganization(organization);
        member.setEmail(email);
        member.setRole(normalizeRole(request.getRole()));
        userRepository.findByEmailIgnoreCase(email).ifPresent(user -> {
            member.setUser(user);
            member.setStatus(OrganizationMember.STATUS_ACTIVE);
            member.setJoinedAt(Instant.now());
        });
        if (member.getUser() == null) {
            member.setStatus(OrganizationMember.STATUS_INVITED);
            member.setInvitedAt(Instant.now());
        }
        return OrganizationMemberResponse.from(memberRepository.save(member));
    }

    @Transactional
    public void removeMember(Authentication authentication, Long organizationId, Long memberId) {
        Organization organization = requireOrganizationOwner(authentication, organizationId);
        OrganizationMember member = memberRepository.findByIdAndOrganizationId(memberId, organizationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Organization member not found"));
        if (member.getUser() != null && organization.getOwner() != null
                && organization.getOwner().getId().equals(member.getUser().getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Organization owner cannot be removed");
        }
        memberRepository.delete(member);
    }

    private OrganizationResponse toResponse(Organization organization) {
        List<OrganizationMemberResponse> members = memberRepository.findByOrganizationIdOrderByCreatedAtAsc(organization.getId()).stream()
                .map(OrganizationMemberResponse::from)
                .toList();
        return OrganizationResponse.from(organization, members);
    }

    private Organization requireOrganizationAccess(Authentication authentication, Long organizationId) {
        AppUser user = currentUserService.currentUser(authentication);
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Organization not found"));
        if (organization.getOwner() != null && organization.getOwner().getId().equals(user.getId())) {
            return organization;
        }
        if (memberRepository.existsByOrganizationIdAndUserId(organizationId, user.getId())) {
            return organization;
        }
        throw new ApiException(HttpStatus.FORBIDDEN, "You do not have access to this organization");
    }

    private Organization requireOrganizationOwner(Authentication authentication, Long organizationId) {
        AppUser user = currentUserService.currentUser(authentication);
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Organization not found"));
        if (organization.getOwner() == null || !organization.getOwner().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Only the organization owner can manage members");
        }
        return organization;
    }

    private String normalizeRole(String role) {
        String normalized = role == null || role.isBlank()
                ? "VIEWER"
                : role.trim().toUpperCase(Locale.ROOT);
        return switch (normalized) {
            case "OWNER", "MANAGER", "DESIGNER", "CHECK_IN_STAFF", "VIEWER", "MEMBER", "ADMIN" -> normalized;
            default -> throw new ApiException(HttpStatus.BAD_REQUEST, "Organization role is invalid");
        };
    }

    @Transactional
    public OrganizationMemberResponse updateRole(
            Authentication authentication,
            Long organizationId,
            Long memberId,
            String role
    ) {
        Organization organization = requireOrganizationOwner(authentication, organizationId);
        OrganizationMember member = memberRepository.findByIdAndOrganizationId(memberId, organizationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Organization member not found"));

        if (member.getUser() != null && organization.getOwner() != null
                && organization.getOwner().getId().equals(member.getUser().getId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Organization owner role cannot be changed");
        }

        String normalized = normalizeRole(role);
        member.setRole(normalized);
        return OrganizationMemberResponse.from(memberRepository.save(member));
    }

    private String uniqueSlug(String base) {
        String safeBase = base == null || base.isBlank() ? "organization" : base;
        for (int attempt = 0; attempt < 50; attempt++) {
            String candidate = attempt == 0 ? safeBase : safeBase + "-" + attempt;
            if (!organizationRepository.existsBySlug(candidate)) {
                return candidate;
            }
        }
        throw new ApiException(HttpStatus.CONFLICT, "Could not generate organization slug");
    }

    private String slugify(String value) {
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT)
                .replaceAll("[^\\p{L}\\p{N}]+", "-")
                .replaceAll("(^-|-$)", "");
        if (normalized.length() > 80) {
            normalized = normalized.substring(0, 80).replaceAll("-$", "");
        }
        return normalized.isBlank() ? "organization" : normalized;
    }

    private String requireText(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, message);
        }
        return value.trim();
    }
}

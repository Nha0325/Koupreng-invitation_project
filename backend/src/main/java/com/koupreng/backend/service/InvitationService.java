package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.invitation.InvitationRequest;
import com.koupreng.backend.dto.invitation.InvitationResponse;
import com.koupreng.backend.dto.invitation.InvitationSummaryResponse;
import com.koupreng.backend.entity.invitation.EventType;
import com.koupreng.backend.entity.invitation.InvitationTemplate;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.enums.InvitationStatus;
import com.koupreng.backend.enums.InvitationVisibility;
import com.koupreng.backend.repository.InvitationTemplateRepository;
import com.koupreng.backend.repository.UserInvitationRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
public class InvitationService {

    private final UserInvitationRepository invitationRepository;
    private final InvitationTemplateRepository templateRepository;
    private final CurrentUserService currentUserService;
    private final PasswordEncoder passwordEncoder;

    public InvitationService(
            UserInvitationRepository invitationRepository,
            InvitationTemplateRepository templateRepository,
            CurrentUserService currentUserService,
            PasswordEncoder passwordEncoder
    ) {
        this.invitationRepository = invitationRepository;
        this.templateRepository = templateRepository;
        this.currentUserService = currentUserService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public InvitationResponse create(Authentication authentication, InvitationRequest request) {
        AppUser user = currentUserService.currentUser(authentication);
        UserInvitation invitation = new UserInvitation();
        invitation.setUser(user);
        invitation.setStatus(InvitationStatus.DRAFT);
        applyRequest(invitation, request);
        ensureSlug(invitation);
        return toResponse(save(invitation));
    }

    @Transactional(readOnly = true)
    public List<InvitationSummaryResponse> listMine(Authentication authentication, InvitationStatus status) {
        AppUser user = currentUserService.currentUser(authentication);
        List<UserInvitation> invitations = status == null
                ? invitationRepository.findAllByUserIdAndDeletedFalseOrderByCreatedAtDesc(user.getId())
                : invitationRepository.findAllByUserIdAndStatusAndDeletedFalseOrderByCreatedAtDesc(user.getId(), status);
        return invitations.stream()
                .map(InvitationSummaryResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<InvitationResponse> listAllForAdmin() {
        return invitationRepository.findAllByDeletedFalseOrderByCreatedAtDesc().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public InvitationResponse get(Authentication authentication, Long id) {
        return toResponse(requireOwnedInvitation(authentication, id));
    }

    @Transactional
    public InvitationResponse update(Authentication authentication, Long id, InvitationRequest request) {
        UserInvitation invitation = requireOwnedInvitation(authentication, id);
        applyRequest(invitation, request);
        ensureSlug(invitation);
        if (invitation.getStatus() == InvitationStatus.PUBLISHED) {
            validatePublishReady(invitation);
        }
        return toResponse(save(invitation));
    }

    @Transactional
    public void delete(Authentication authentication, Long id) {
        UserInvitation invitation = requireOwnedInvitation(authentication, id);
        invitation.setDeleted(true);
        invitation.setStatus(InvitationStatus.ARCHIVED);
        invitationRepository.save(invitation);
    }

    @Transactional
    public InvitationResponse saveAsDraft(Authentication authentication, Long id) {
        UserInvitation invitation = requireOwnedInvitation(authentication, id);
        invitation.setStatus(InvitationStatus.DRAFT);
        invitation.setPublishedAt(null);
        ensureSlug(invitation);
        return toResponse(save(invitation));
    }

    @Transactional
    public InvitationResponse publish(Authentication authentication, Long id) {
        UserInvitation invitation = requireOwnedInvitation(authentication, id);
        ensureSlug(invitation);
        validatePublishReady(invitation);
        invitation.setStatus(InvitationStatus.PUBLISHED);
        invitation.setPublishedAt(Instant.now());
        return toResponse(save(invitation));
    }

    @Transactional
    public InvitationResponse unpublish(Authentication authentication, Long id) {
        UserInvitation invitation = requireOwnedInvitation(authentication, id);
        if (invitation.getStatus() != InvitationStatus.PUBLISHED) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invitation is not published");
        }
        invitation.setStatus(InvitationStatus.UNPUBLISHED);
        return toResponse(save(invitation));
    }

    @Transactional(readOnly = true)
    public InvitationResponse preview(Authentication authentication, Long id) {
        return toResponse(requireOwnedInvitation(authentication, id));
    }

    @Transactional(readOnly = true)
    public InvitationResponse publicBySlug(String slug) {
        UserInvitation invitation = invitationRepository
                .findBySlugAndStatusAndDeletedFalse(slug, InvitationStatus.PUBLISHED)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invitation not found"));

        if (invitation.getVisibility() == InvitationVisibility.PRIVATE) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Invitation not found");
        }
        if (invitation.getVisibility() == InvitationVisibility.PASSWORD_PROTECTED) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Invitation password required");
        }
        return toResponse(invitation);
    }

    @Transactional(readOnly = true)
    public UserInvitation requireOwnedInvitationEntity(Authentication authentication, Long id) {
        return requireOwnedInvitation(authentication, id);
    }

    @Transactional(readOnly = true)
    public UserInvitation requirePublishedInvitationForRsvp(String slug, boolean tokenAccess) {
        UserInvitation invitation = invitationRepository
                .findBySlugAndStatusAndDeletedFalse(slug, InvitationStatus.PUBLISHED)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invitation not found"));

        if (!tokenAccess && invitation.getVisibility() == InvitationVisibility.PRIVATE) {
            throw new ApiException(HttpStatus.NOT_FOUND, "Invitation not found");
        }
        if (!tokenAccess && invitation.getVisibility() == InvitationVisibility.PASSWORD_PROTECTED) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Invitation password required");
        }
        return invitation;
    }

    private UserInvitation requireOwnedInvitation(Authentication authentication, Long id) {
        AppUser user = currentUserService.currentUser(authentication);
        UserInvitation invitation = invitationRepository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Invitation not found"));
        if (invitation.getUser() == null || !invitation.getUser().getId().equals(user.getId())) {
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have access to this invitation");
        }
        return invitation;
    }

    private void applyRequest(UserInvitation invitation, InvitationRequest request) {
        invitation.setTitle(trimToNull(request.getTitle()));
        invitation.setTemplate(resolveTemplate(request.getTemplateId()));
        invitation.setEventType(request.getEventType());
        invitation.setEventDate(request.getEventDate());
        invitation.setEventTime(request.getEventTime());
        invitation.setVenueName(trimToNull(request.getVenueName()));
        invitation.setVenueAddress(trimToNull(request.getVenueAddress()));
        invitation.setGoogleMapUrl(trimToNull(request.getGoogleMapUrl()));
        invitation.setHostName(trimToNull(request.getHostName()));
        invitation.setPartnerName(trimToNull(request.getPartnerName()));
        invitation.setGroomName(trimToNull(request.getGroomName()));
        invitation.setBrideName(trimToNull(request.getBrideName()));
        invitation.setStoryText(trimToNull(request.getStoryText()));
        invitation.setLanguageMode(trimToNull(request.getLanguageMode()));
        invitation.setRsvpDeadline(request.getRsvpDeadline());

        InvitationVisibility visibility = parseVisibility(request.getVisibility());
        invitation.setVisibility(visibility);
        if (visibility == InvitationVisibility.PASSWORD_PROTECTED) {
            String password = trimToNull(request.getAccessPassword());
            if (password != null) {
                invitation.setAccessPassword(passwordEncoder.encode(password));
            }
        } else {
            invitation.setAccessPassword(null);
        }
    }

    private InvitationTemplate resolveTemplate(Long templateId) {
        if (templateId == null) {
            return null;
        }
        return templateRepository.findById(templateId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Template not found"));
    }

    private InvitationVisibility parseVisibility(String value) {
        String normalized = trimToNull(value);
        if (normalized == null) {
            return InvitationVisibility.PUBLIC;
        }
        try {
            return InvitationVisibility.valueOf(normalized.toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Invitation visibility is invalid");
        }
    }

    private void validatePublishReady(UserInvitation invitation) {
        List<String> missing = new ArrayList<>();
        requirePresent(invitation.getTitle(), "title", missing);
        if (invitation.getEventType() == null) {
            missing.add("eventType");
        }
        if (invitation.getEventDate() == null) {
            missing.add("eventDate");
        }
        if (invitation.getEventTime() == null) {
            missing.add("eventTime");
        }
        requirePresent(invitation.getVenueName(), "venueName", missing);
        requirePresent(invitation.getVenueAddress(), "venueAddress", missing);
        requirePresent(invitation.getSlug(), "slug", missing);

        if (invitation.getEventType() == EventType.WEDDING || invitation.getEventType() == EventType.ENGAGEMENT) {
            requirePresent(invitation.getGroomName(), "groomName", missing);
            requirePresent(invitation.getBrideName(), "brideName", missing);
        } else {
            requirePresent(invitation.getHostName(), "hostName", missing);
        }

        if (invitation.getRsvpDeadline() != null
                && invitation.getEventDate() != null
                && invitation.getRsvpDeadline().isAfter(invitation.getEventDate())) {
            missing.add("rsvpDeadline must not be after eventDate");
        }

        if (invitation.getVisibility() == InvitationVisibility.PASSWORD_PROTECTED
                && trimToNull(invitation.getAccessPassword()) == null) {
            missing.add("accessPassword");
        }

        if (!missing.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Publish requirements missing: " + String.join(", ", missing));
        }
    }

    private void requirePresent(String value, String field, List<String> missing) {
        if (trimToNull(value) == null) {
            missing.add(field);
        }
    }

    private void ensureSlug(UserInvitation invitation) {
        if (trimToNull(invitation.getSlug()) != null) {
            return;
        }

        String base = firstPresent(
                joinNames(invitation.getGroomName(), invitation.getBrideName()),
                joinNames(invitation.getHostName(), invitation.getPartnerName()),
                invitation.getTitle(),
                "invitation"
        );
        invitation.setSlug(uniqueSlug(slugify(base), invitation.getId()));
    }

    private String uniqueSlug(String base, Long invitationId) {
        String safeBase = base == null || base.isBlank() ? "invitation" : base;
        for (int attempt = 0; attempt < 25; attempt++) {
            String candidate = attempt == 0 ? safeBase : safeBase + "-" + attempt;
            if (!slugExistsForOtherInvitation(candidate, invitationId)) {
                return candidate;
            }
        }
        String candidate;
        do {
            candidate = safeBase + "-" + UUID.randomUUID().toString().substring(0, 8);
        } while (slugExistsForOtherInvitation(candidate, invitationId));
        return candidate;
    }

    private boolean slugExistsForOtherInvitation(String slug, Long invitationId) {
        return invitationId == null
                ? invitationRepository.existsBySlug(slug)
                : invitationRepository.existsBySlugAndIdNot(slug, invitationId);
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
        return normalized.isBlank() ? "invitation" : normalized;
    }

    private String joinNames(String first, String second) {
        String left = trimToNull(first);
        String right = trimToNull(second);
        if (left == null && right == null) {
            return null;
        }
        if (left == null) {
            return right;
        }
        if (right == null) {
            return left;
        }
        return left + " " + right;
    }

    private String firstPresent(String... values) {
        for (String value : values) {
            String trimmed = trimToNull(value);
            if (trimmed != null) {
                return trimmed;
            }
        }
        return "invitation";
    }

    private UserInvitation save(UserInvitation invitation) {
        try {
            return invitationRepository.save(invitation);
        } catch (DataIntegrityViolationException ex) {
            throw new ApiException(HttpStatus.CONFLICT, "Invitation slug already exists");
        }
    }

    private InvitationResponse toResponse(UserInvitation invitation) {
        return InvitationResponse.from(invitation);
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

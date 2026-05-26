package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.rsvp.RsvpRequest;
import com.koupreng.backend.dto.rsvp.RsvpResponse;
import com.koupreng.backend.dto.rsvp.RsvpSummaryResponse;
import com.koupreng.backend.entity.invitation.Guest;
import com.koupreng.backend.entity.invitation.Rsvp;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.enums.RsvpStatus;
import com.koupreng.backend.repository.GuestRepository;
import com.koupreng.backend.repository.RsvpRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RsvpService {

    private final RsvpRepository rsvpRepository;
    private final GuestRepository guestRepository;
    private final InvitationService invitationService;

    public RsvpService(
            RsvpRepository rsvpRepository,
            GuestRepository guestRepository,
            InvitationService invitationService
    ) {
        this.rsvpRepository = rsvpRepository;
        this.guestRepository = guestRepository;
        this.invitationService = invitationService;
    }

    @Transactional
    public RsvpResponse submitPublic(String slug, RsvpRequest request) {
        UserInvitation invitation = invitationService.requirePublishedInvitationForRsvp(slug, false);
        validateDeadline(invitation);
        Guest guest = reusableGuest(invitation.getId(), request)
                .orElseGet(() -> createPublicGuest(invitation, request));
        return RsvpResponse.from(upsertRsvp(invitation, guest, request));
    }

    @Transactional
    public RsvpResponse submitPublicWithToken(String slug, String inviteToken, RsvpRequest request) {
        UserInvitation invitation = invitationService.requirePublishedInvitationForRsvp(slug, true);
        validateDeadline(invitation);
        Guest guest = guestRepository.findByInvitationIdAndInviteToken(invitation.getId(), inviteToken)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Guest invitation link not found"));
        guest.setInvitationViewedAt(Instant.now());
        return RsvpResponse.from(upsertRsvp(invitation, guest, request));
    }

    @Transactional(readOnly = true)
    public List<RsvpResponse> list(Authentication authentication, Long invitationId) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        return rsvpRepository.findByInvitationIdOrderByRespondedAtDesc(invitationId).stream()
                .map(RsvpResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public RsvpSummaryResponse summary(Authentication authentication, Long invitationId) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        long totalGuests = guestRepository.countByInvitationId(invitationId);
        long attending = rsvpRepository.countByInvitationIdAndResponseStatus(invitationId, RsvpStatus.ATTENDING);
        long notAttending = rsvpRepository.countByInvitationIdAndResponseStatus(invitationId, RsvpStatus.NOT_ATTENDING);
        long maybe = rsvpRepository.countByInvitationIdAndResponseStatus(invitationId, RsvpStatus.MAYBE);
        long pending = rsvpRepository.countPendingGuests(invitationId);
        long totalAttendeeCount = rsvpRepository.sumAttendeeCountByInvitationIdAndStatus(invitationId, RsvpStatus.ATTENDING);
        return RsvpSummaryResponse.builder()
                .totalGuests(totalGuests)
                .attending(attending)
                .notAttending(notAttending)
                .maybe(maybe)
                .pending(pending)
                .totalAttendeeCount(totalAttendeeCount)
                .build();
    }

    private Rsvp upsertRsvp(UserInvitation invitation, Guest guest, RsvpRequest request) {
        if (request.getResponseStatus() == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "RSVP status is required");
        }
        int attendeeCount = attendeeCount(request);
        Rsvp rsvp = rsvpRepository.findByInvitationIdAndGuestId(invitation.getId(), guest.getId())
                .orElseGet(Rsvp::new);
        rsvp.setInvitation(invitation);
        rsvp.setGuest(guest);
        rsvp.setResponseStatus(request.getResponseStatus());
        rsvp.setAttendeeCount(attendeeCount);
        rsvp.setMessage(trimToNull(request.getMessage()));
        return rsvpRepository.save(rsvp);
    }

    private Optional<Guest> reusableGuest(Long invitationId, RsvpRequest request) {
        String email = trimToNull(request.getEmail());
        if (email != null) {
            Optional<Guest> guest = guestRepository.findByInvitationIdAndEmailIgnoreCase(invitationId, email);
            if (guest.isPresent()) {
                return guest;
            }
        }
        String phone = trimToNull(request.getPhone());
        if (phone != null) {
            return guestRepository.findByInvitationIdAndPhone(invitationId, phone);
        }
        return Optional.empty();
    }

    private Guest createPublicGuest(UserInvitation invitation, RsvpRequest request) {
        String guestName = trimToNull(request.getGuestName());
        if (guestName == null) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Guest name is required");
        }
        Guest guest = new Guest();
        guest.setInvitation(invitation);
        guest.setGuestName(guestName);
        guest.setPhone(trimToNull(request.getPhone()));
        guest.setEmail(trimToNull(request.getEmail()));
        guest.setInviteToken(uniqueInviteToken());
        guest.setQrCodeUrl("/i/" + invitation.getSlug() + "?token=" + guest.getInviteToken());
        guest.setInvitationViewedAt(Instant.now());
        return guestRepository.save(guest);
    }

    private int attendeeCount(RsvpRequest request) {
        int attendeeCount = request.getAttendeeCount() == null
                ? (request.getResponseStatus() == RsvpStatus.NOT_ATTENDING ? 0 : 1)
                : request.getAttendeeCount();
        if (attendeeCount < 0) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Attendee count must be zero or greater");
        }
        return request.getResponseStatus() == RsvpStatus.NOT_ATTENDING ? 0 : attendeeCount;
    }

    private void validateDeadline(UserInvitation invitation) {
        if (invitation.getRsvpDeadline() != null && LocalDate.now().isAfter(invitation.getRsvpDeadline())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "RSVP deadline has passed");
        }
    }

    private String uniqueInviteToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "");
        } while (guestRepository.existsByInviteToken(token));
        return token;
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

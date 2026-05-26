package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.guest.GuestImportRequest;
import com.koupreng.backend.dto.guest.GuestRequest;
import com.koupreng.backend.dto.guest.GuestResponse;
import com.koupreng.backend.entity.invitation.Guest;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.repository.GuestRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class GuestService {

    private final GuestRepository guestRepository;
    private final InvitationService invitationService;

    public GuestService(GuestRepository guestRepository, InvitationService invitationService) {
        this.guestRepository = guestRepository;
        this.invitationService = invitationService;
    }

    @Transactional
    public GuestResponse create(Authentication authentication, Long invitationId, GuestRequest request) {
        UserInvitation invitation = invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        Guest guest = new Guest();
        guest.setInvitation(invitation);
        guest.setInviteToken(uniqueInviteToken());
        applyRequest(guest, request);
        guest.setQrCodeUrl(tokenUrl(invitation, guest.getInviteToken()));
        return GuestResponse.from(guestRepository.save(guest));
    }

    @Transactional(readOnly = true)
    public List<GuestResponse> list(Authentication authentication, Long invitationId) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        return guestRepository.findByInvitationIdOrderByCreatedAtDesc(invitationId).stream()
                .map(GuestResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public GuestResponse get(Authentication authentication, Long invitationId, Long guestId) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        return GuestResponse.from(requireGuest(invitationId, guestId));
    }

    @Transactional
    public GuestResponse update(Authentication authentication, Long invitationId, Long guestId, GuestRequest request) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        Guest guest = requireGuest(invitationId, guestId);
        applyRequest(guest, request);
        if (guest.getQrCodeUrl() == null || guest.getQrCodeUrl().isBlank()) {
            guest.setQrCodeUrl(tokenUrl(guest.getInvitation(), guest.getInviteToken()));
        }
        return GuestResponse.from(guestRepository.save(guest));
    }

    @Transactional
    public void delete(Authentication authentication, Long invitationId, Long guestId) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        guestRepository.delete(requireGuest(invitationId, guestId));
    }

    @Transactional(readOnly = true)
    public List<GuestResponse> search(Authentication authentication, Long invitationId, String keyword) {
        invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        if (keyword == null || keyword.isBlank()) {
            return list(authentication, invitationId);
        }
        return guestRepository.search(invitationId, keyword.trim()).stream()
                .map(GuestResponse::from)
                .toList();
    }

    @Transactional
    public List<GuestResponse> importGuests(Authentication authentication, Long invitationId, GuestImportRequest request) {
        UserInvitation invitation = invitationService.requireOwnedInvitationEntity(authentication, invitationId);
        return request.getGuests().stream()
                .filter(guest -> guest.getGuestName() != null && !guest.getGuestName().isBlank())
                .map(guestRequest -> {
                    Guest guest = new Guest();
                    guest.setInvitation(invitation);
                    guest.setInviteToken(uniqueInviteToken());
                    applyRequest(guest, guestRequest);
                    guest.setQrCodeUrl(tokenUrl(invitation, guest.getInviteToken()));
                    return GuestResponse.from(guestRepository.save(guest));
                })
                .toList();
    }

    private Guest requireGuest(Long invitationId, Long guestId) {
        return guestRepository.findByIdAndInvitationId(guestId, invitationId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Guest not found"));
    }

    private void applyRequest(Guest guest, GuestRequest request) {
        guest.setGuestName(trimToNull(request.getGuestName()));
        guest.setPhone(trimToNull(request.getPhone()));
        guest.setEmail(trimToNull(request.getEmail()));
        guest.setGuestGroup(trimToNull(request.getGuestGroup()));
        guest.setSideType(trimToNull(request.getSideType()));
        guest.setTableNumber(trimToNull(request.getTableNumber()));
        guest.setSendStatus(trimToNull(request.getSendStatus()));
        guest.setContributionStatus(trimToNull(request.getContributionStatus()));
        guest.setTotalContributed(request.getTotalContributed());
    }

    private String uniqueInviteToken() {
        String token;
        do {
            token = UUID.randomUUID().toString().replace("-", "");
        } while (guestRepository.existsByInviteToken(token));
        return token;
    }

    private String tokenUrl(UserInvitation invitation, String inviteToken) {
        String slug = invitation.getSlug() == null || invitation.getSlug().isBlank()
                ? "invitation-" + invitation.getId()
                : invitation.getSlug();
        return "/i/" + slug + "?token=" + inviteToken;
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }
}

package com.koupreng.backend.service;

import com.koupreng.backend.dto.guest.GuestRequest;
import com.koupreng.backend.dto.guest.GuestResponse;
import com.koupreng.backend.entity.invitation.Guest;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.repository.GuestRepository;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class GuestServiceTests {

    @Test
    void createGuestGeneratesInviteTokenAndQrUrl() {
        Fixture fixture = fixture();

        GuestResponse response = fixture.service.create(fixture.authentication, 10L, request("Sophea"));

        assertEquals("Sophea", response.getGuestName());
        assertNotNull(response.getInviteToken());
        assertEquals("/i/samnang-sreyneang?token=" + response.getInviteToken(), response.getQrCodeUrl());
    }

    @Test
    void updateGuestChangesEditableFields() {
        Fixture fixture = fixture();
        Guest guest = guest(fixture.invitation, "Sophea");
        GuestRequest request = request("Sophea Updated");
        request.setPhone("012345678");
        when(fixture.guestRepository.findByIdAndInvitationId(20L, 10L)).thenReturn(Optional.of(guest));

        GuestResponse response = fixture.service.update(fixture.authentication, 10L, 20L, request);

        assertEquals("Sophea Updated", response.getGuestName());
        assertEquals("012345678", response.getPhone());
    }

    @Test
    void listGuestsByInvitation() {
        Fixture fixture = fixture();
        when(fixture.guestRepository.findByInvitationIdOrderByCreatedAtDesc(10L))
                .thenReturn(List.of(guest(fixture.invitation, "Sophea")));

        List<GuestResponse> responses = fixture.service.list(fixture.authentication, 10L);

        assertEquals(1, responses.size());
        assertEquals("Sophea", responses.getFirst().getGuestName());
    }

    @Test
    void searchGuestsByKeyword() {
        Fixture fixture = fixture();
        when(fixture.guestRepository.search(10L, "sop"))
                .thenReturn(List.of(guest(fixture.invitation, "Sophea")));

        List<GuestResponse> responses = fixture.service.search(fixture.authentication, 10L, "sop");

        assertEquals(1, responses.size());
        assertEquals("Sophea", responses.getFirst().getGuestName());
    }

    @Test
    void deleteGuestRemovesGuest() {
        Fixture fixture = fixture();
        Guest guest = guest(fixture.invitation, "Sophea");
        when(fixture.guestRepository.findByIdAndInvitationId(20L, 10L)).thenReturn(Optional.of(guest));

        fixture.service.delete(fixture.authentication, 10L, 20L);

        verify(fixture.guestRepository).delete(guest);
    }

    private Fixture fixture() {
        GuestRepository guestRepository = mock(GuestRepository.class);
        InvitationService invitationService = mock(InvitationService.class);
        Authentication authentication = mock(Authentication.class);
        UserInvitation invitation = invitation();
        GuestService service = new GuestService(guestRepository, invitationService);

        when(invitationService.requireOwnedInvitationEntity(authentication, 10L)).thenReturn(invitation);
        when(guestRepository.existsByInviteToken(any())).thenReturn(false);
        when(guestRepository.save(any(Guest.class))).thenAnswer(invocation -> {
            Guest guest = invocation.getArgument(0);
            if (guest.getId() == null) {
                guest.setId(20L);
            }
            return guest;
        });

        return new Fixture(service, guestRepository, authentication, invitation);
    }

    private GuestRequest request(String name) {
        GuestRequest request = new GuestRequest();
        request.setGuestName(name);
        return request;
    }

    private UserInvitation invitation() {
        AppUser user = new AppUser();
        user.setId(1L);
        user.setFullName("Owner");

        UserInvitation invitation = new UserInvitation();
        invitation.setId(10L);
        invitation.setUser(user);
        invitation.setTitle("Wedding");
        invitation.setSlug("samnang-sreyneang");
        return invitation;
    }

    private Guest guest(UserInvitation invitation, String name) {
        Guest guest = new Guest();
        guest.setId(20L);
        guest.setInvitation(invitation);
        guest.setGuestName(name);
        guest.setInviteToken("token");
        return guest;
    }

    private record Fixture(
            GuestService service,
            GuestRepository guestRepository,
            Authentication authentication,
            UserInvitation invitation
    ) {
    }
}

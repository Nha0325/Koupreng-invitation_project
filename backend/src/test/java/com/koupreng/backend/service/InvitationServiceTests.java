package com.koupreng.backend.service;

import com.koupreng.backend.common.ApiException;
import com.koupreng.backend.dto.invitation.InvitationRequest;
import com.koupreng.backend.dto.invitation.InvitationResponse;
import com.koupreng.backend.entity.invitation.EventType;
import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.entity.user.AppUser;
import com.koupreng.backend.enums.InvitationStatus;
import com.koupreng.backend.repository.InvitationTemplateRepository;
import com.koupreng.backend.repository.UserInvitationRepository;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class InvitationServiceTests {

    @Test
    void createDraftInvitationGeneratesSlug() {
        Fixture fixture = fixture();
        InvitationRequest request = request("Samnang and Sreyneang");

        InvitationResponse response = fixture.service.create(fixture.authentication, request);

        assertEquals(InvitationStatus.DRAFT, response.getStatus());
        assertEquals("Samnang and Sreyneang", response.getTitle());
        assertNotNull(response.getSlug());
    }

    @Test
    void publishWithMissingFieldsFails() {
        Fixture fixture = fixture();
        UserInvitation invitation = invitation(fixture.owner);
        when(fixture.invitationRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(invitation));

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.publish(fixture.authentication, 10L)
        );

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
        assertTrue(exception.getMessage().contains("eventType"));
    }

    @Test
    void publishValidInvitationSucceeds() {
        Fixture fixture = fixture();
        UserInvitation invitation = validInvitation(fixture.owner);
        when(fixture.invitationRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(invitation));

        InvitationResponse response = fixture.service.publish(fixture.authentication, 10L);

        assertEquals(InvitationStatus.PUBLISHED, response.getStatus());
        assertNotNull(response.getPublishedAt());
    }

    @Test
    void nonOwnerCannotUpdateInvitation() {
        Fixture fixture = fixture();
        AppUser otherUser = user(2L);
        when(fixture.currentUserService.currentUser(fixture.authentication)).thenReturn(otherUser);
        when(fixture.invitationRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(validInvitation(fixture.owner)));

        ApiException exception = assertThrows(
                ApiException.class,
                () -> fixture.service.update(fixture.authentication, 10L, request("Updated"))
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatus());
    }

    @Test
    void deleteSoftDeletesInvitation() {
        Fixture fixture = fixture();
        UserInvitation invitation = validInvitation(fixture.owner);
        when(fixture.invitationRepository.findByIdAndDeletedFalse(10L)).thenReturn(Optional.of(invitation));

        fixture.service.delete(fixture.authentication, 10L);

        assertTrue(invitation.isDeleted());
        assertEquals(InvitationStatus.ARCHIVED, invitation.getStatus());
        verify(fixture.invitationRepository).save(invitation);
    }

    private Fixture fixture() {
        UserInvitationRepository invitationRepository = mock(UserInvitationRepository.class);
        InvitationTemplateRepository templateRepository = mock(InvitationTemplateRepository.class);
        CurrentUserService currentUserService = mock(CurrentUserService.class);
        PasswordEncoder passwordEncoder = mock(PasswordEncoder.class);
        Authentication authentication = mock(Authentication.class);
        AppUser owner = user(1L);
        InvitationService service = new InvitationService(
                invitationRepository,
                templateRepository,
                currentUserService,
                passwordEncoder
        );

        when(currentUserService.currentUser(authentication)).thenReturn(owner);
        when(invitationRepository.existsBySlug(any())).thenReturn(false);
        when(invitationRepository.existsBySlugAndIdNot(any(), any())).thenReturn(false);
        when(invitationRepository.save(any(UserInvitation.class))).thenAnswer(invocation -> {
            UserInvitation invitation = invocation.getArgument(0);
            if (invitation.getId() == null) {
                invitation.setId(10L);
            }
            return invitation;
        });

        return new Fixture(service, invitationRepository, currentUserService, authentication, owner);
    }

    private InvitationRequest request(String title) {
        InvitationRequest request = new InvitationRequest();
        request.setTitle(title);
        return request;
    }

    private UserInvitation invitation(AppUser owner) {
        UserInvitation invitation = new UserInvitation();
        invitation.setId(10L);
        invitation.setUser(owner);
        invitation.setTitle("Draft invitation");
        invitation.setSlug("draft-invitation");
        invitation.setStatus(InvitationStatus.DRAFT);
        return invitation;
    }

    private UserInvitation validInvitation(AppUser owner) {
        UserInvitation invitation = invitation(owner);
        invitation.setEventType(EventType.WEDDING);
        invitation.setEventDate(LocalDate.now().plusDays(30));
        invitation.setEventTime(LocalTime.of(17, 0));
        invitation.setVenueName("Koupreng Hall");
        invitation.setVenueAddress("Phnom Penh");
        invitation.setGroomName("Samnang");
        invitation.setBrideName("Sreyneang");
        invitation.setRsvpDeadline(LocalDate.now().plusDays(20));
        return invitation;
    }

    private AppUser user(Long id) {
        AppUser user = new AppUser();
        user.setId(id);
        user.setFullName("Test User " + id);
        return user;
    }

    private record Fixture(
            InvitationService service,
            UserInvitationRepository invitationRepository,
            CurrentUserService currentUserService,
            Authentication authentication,
            AppUser owner
    ) {
    }
}

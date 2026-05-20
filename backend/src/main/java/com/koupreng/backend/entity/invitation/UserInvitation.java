package com.koupreng.backend.entity.invitation;

import com.koupreng.backend.entity.user.AppUser;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Entity
@Table(name = "invitations")
public class UserInvitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "invitation_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "template_id")
    private InvitationTemplate template;

    @Column(nullable = false)
    private String title;

    @Column(unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", length = 50)
    private EventType eventType;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "event_time")
    private LocalTime eventTime;

    @Column(name = "venue_name")
    private String venueName;

    @Column(name = "venue_address", length = 1000)
    private String venueAddress;

    @Column(name = "google_map_url", length = 1000)
    private String googleMapUrl;

    @Column(name = "host_name")
    private String hostName;

    @Column(name = "partner_name")
    private String partnerName;

    @Column(name = "groom_name")
    private String groomName;

    @Column(name = "bride_name")
    private String brideName;

    @Column(name = "story_text", columnDefinition = "TEXT")
    private String storyText;

    @Column(name = "language_mode", length = 20)
    private String languageMode;

    @Column(length = 20)
    private String visibility;

    @Column(name = "access_password")
    private String accessPassword;

    @Column(name = "rsvp_deadline")
    private LocalDate rsvpDeadline;

    @Column(length = 20)
    private String status;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
        updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }
}

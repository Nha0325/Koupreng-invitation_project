package com.koupreng.backend.entity.invitation;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "rsvps")
public class Rsvp {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rsvp_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private UserInvitation invitation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @Column(name = "response_status", length = 50)
    private String responseStatus;

    @Column(name = "attendee_count")
    private Integer attendeeCount;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "responded_at")
    private Instant respondedAt;
}

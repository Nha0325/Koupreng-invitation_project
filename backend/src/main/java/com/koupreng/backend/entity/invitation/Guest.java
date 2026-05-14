package com.koupreng.backend.entity.invitation;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "guests")
public class Guest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "guest_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private UserInvitation invitation;

    @Column(name = "guest_name", nullable = false)
    private String guestName;

    private String phone;

    private String email;

    @Column(name = "guest_group")
    private String guestGroup;

    @Column(name = "side_type")
    private String sideType;

    @Column(name = "table_number")
    private String tableNumber;

    @Column(name = "invite_token", unique = true)
    private String inviteToken;

    @Column(name = "qr_code_url", length = 1000)
    private String qrCodeUrl;

    @Column(name = "send_status", length = 50)
    private String sendStatus;

    @Column(name = "invitation_viewed_at")
    private Instant invitationViewedAt;

    @Column(name = "contribution_status", length = 50)
    private String contributionStatus;

    @Column(name = "total_contributed", precision = 10, scale = 2)
    private BigDecimal totalContributed;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}

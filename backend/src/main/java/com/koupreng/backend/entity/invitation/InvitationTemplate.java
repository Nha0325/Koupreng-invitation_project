package com.koupreng.backend.entity.invitation;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "templates")
public class InvitationTemplate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "template_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private TemplateCategory category;

    @Column(name = "thumbnail_url", length = 1000)
    private String thumbnailUrl;

    @Column(name = "preview_url", length = 1000)
    private String previewUrl;

    @Column(name = "is_premium", nullable = false)
    private boolean isPremium = false;

    @Column(length = 20)
    private String status;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}

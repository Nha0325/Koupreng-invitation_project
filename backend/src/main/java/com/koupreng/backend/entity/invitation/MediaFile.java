package com.koupreng.backend.entity.invitation;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "media_files")
public class MediaFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "media_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private UserInvitation invitation;

    @Column(name = "media_type", length = 50)
    private String mediaType;

    @Column(name = "file_url", length = 1000)
    private String fileUrl;

    @Column(name = "public_id")
    private String publicId;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_cover", nullable = false)
    private boolean isCover = false;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}

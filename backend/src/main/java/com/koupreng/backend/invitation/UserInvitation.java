package com.koupreng.backend.invitation;

import java.time.Instant;

import com.koupreng.backend.auth.AppUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_invitations")
public class UserInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "template_id")
    private InvitationTemplate template;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "LONGTEXT", name = "canvas_data_json")
    private String canvasDataJson;

    @Column(columnDefinition = "LONGTEXT", name = "thumbnail_data_url")
    private String thumbnailDataUrl;

    @Column(unique = true, name = "share_token")
    private String shareToken;

    @Column(nullable = false)
    private boolean exported = false;

    @Column(nullable = false, updatable = false, name = "created_at")
    private Instant createdAt;

    @Column(nullable = false, name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public AppUser getUser() {
        return user;
    }

    public void setUser(AppUser user) {
        this.user = user;
    }

    public InvitationTemplate getTemplate() {
        return template;
    }

    public void setTemplate(InvitationTemplate template) {
        this.template = template;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCanvasDataJson() {
        return canvasDataJson;
    }

    public void setCanvasDataJson(String canvasDataJson) {
        this.canvasDataJson = canvasDataJson;
    }

    public String getThumbnailDataUrl() {
        return thumbnailDataUrl;
    }

    public void setThumbnailDataUrl(String thumbnailDataUrl) {
        this.thumbnailDataUrl = thumbnailDataUrl;
    }

    public String getShareToken() {
        return shareToken;
    }

    public void setShareToken(String shareToken) {
        this.shareToken = shareToken;
    }

    public boolean isExported() {
        return exported;
    }

    public void setExported(boolean exported) {
        this.exported = exported;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}

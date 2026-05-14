import os

base_dir = r"d:\Koupreng-invitation_project\backend\src\main\java\com\koupreng\backend\entity"

# Define packages
packages = {
    "invitation": ["UserInvitation", "InvitationTemplate", "InvitationSection", "Guest", "MediaFile", "Rsvp", "Notification", "EventType", "TemplateCategory"],
    "budget": ["Budget", "BudgetItem"],
    "payment": ["PaymentConfig", "PaymentTransaction", "PaymentWebhookLog", "TelegramNotification", "OrganizerPayoutAccount"],
    "subscription": ["Subscription", "SubscriptionPackage"],
    "audit": ["AuditLog"]
}

# Ensure directories exist
for pkg in packages.keys():
    os.makedirs(os.path.join(base_dir, pkg), exist_ok=True)

entities = {
    "invitation/EventType.java": """package com.koupreng.backend.entity.invitation;

public enum EventType {
    WEDDING,
    ENGAGEMENT,
    BIRTHDAY,
    ANNIVERSARY,
    CORPORATE,
    OTHER
}
""",
    "invitation/TemplateCategory.java": """package com.koupreng.backend.entity.invitation;

public enum TemplateCategory {
    MODERN,
    TRADITIONAL,
    MINIMALIST,
    FLORAL,
    LUXURY,
    OTHER
}
""",
    "invitation/InvitationTemplate.java": """package com.koupreng.backend.entity.invitation;

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
""",
    "invitation/UserInvitation.java": """package com.koupreng.backend.entity.invitation;

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
""",
    "invitation/InvitationSection.java": """package com.koupreng.backend.entity.invitation;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "invitation_sections")
public class InvitationSection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "section_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private UserInvitation invitation;

    @Column(name = "section_key", nullable = false, length = 50)
    private String sectionKey;

    @Column(name = "section_title")
    private String sectionTitle;

    @Column(name = "content_json", columnDefinition = "JSON")
    private String contentJson;

    @Column(name = "sort_order")
    private Integer sortOrder;

    @Column(name = "is_enabled", nullable = false)
    private boolean isEnabled = true;
}
""",
    "invitation/MediaFile.java": """package com.koupreng.backend.entity.invitation;

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
""",
    "invitation/Guest.java": """package com.koupreng.backend.entity.invitation;

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
""",
    "invitation/Rsvp.java": """package com.koupreng.backend.entity.invitation;

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
""",
    "invitation/Notification.java": """package com.koupreng.backend.entity.invitation;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notification_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private UserInvitation invitation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @Column(length = 50)
    private String channel;

    private String subject;

    @Column(name = "message_body", columnDefinition = "TEXT")
    private String messageBody;

    @Column(name = "scheduled_at")
    private Instant scheduledAt;

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(length = 50)
    private String status;
}
""",
    "budget/Budget.java": """package com.koupreng.backend.entity.budget;

import com.koupreng.backend.entity.invitation.UserInvitation;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "budgets")
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private UserInvitation invitation;

    @Column(name = "total_budget", precision = 12, scale = 2)
    private BigDecimal totalBudget;

    @Column(columnDefinition = "TEXT")
    private String notes;

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
""",
    "budget/BudgetItem.java": """package com.koupreng.backend.entity.budget;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "budget_items")
public class BudgetItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "budget_item_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "budget_id", nullable = false)
    private Budget budget;

    @Column(length = 100)
    private String category;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(name = "estimated_cost", precision = 12, scale = 2)
    private BigDecimal estimatedCost;

    @Column(name = "actual_cost", precision = 12, scale = 2)
    private BigDecimal actualCost;

    @Column(name = "vendor_name")
    private String vendorName;

    @Column(columnDefinition = "TEXT")
    private String notes;
}
""",
    "subscription/SubscriptionPackage.java": """package com.koupreng.backend.entity.subscription;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "packages")
public class SubscriptionPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_id")
    private Long id;

    @Column(name = "package_name", nullable = false)
    private String packageName;

    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "max_invitations")
    private Integer maxInvitations;

    @Column(name = "max_guests")
    private Integer maxGuests;

    @Column(name = "features_json", columnDefinition = "JSON")
    private String featuresJson;

    @Column(length = 50)
    private String status;
}
""",
    "subscription/Subscription.java": """package com.koupreng.backend.entity.subscription;

import com.koupreng.backend.entity.user.AppUser;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "subscriptions")
public class Subscription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "subscription_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "package_id", nullable = false)
    private SubscriptionPackage subscriptionPackage;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "payment_status", length = 50)
    private String paymentStatus;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = false;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
""",
    "audit/AuditLog.java": """package com.koupreng.backend.entity.audit;

import com.koupreng.backend.entity.user.AppUser;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AppUser user;

    @Column(nullable = false)
    private String action;

    @Column(name = "target_type", length = 100)
    private String targetType;

    @Column(name = "target_id")
    private Long targetId;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
""",
    "payment/PaymentConfig.java": """package com.koupreng.backend.entity.payment;

import com.koupreng.backend.entity.invitation.UserInvitation;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "payment_configs")
public class PaymentConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_config_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", unique = true, nullable = false)
    private UserInvitation invitation;

    @Column(length = 50)
    private String provider;

    @Column(name = "payment_mode", length = 50)
    private String paymentMode;

    @Column(name = "is_enabled", nullable = false)
    private boolean isEnabled = true;

    @Column(name = "is_fixed_amount", nullable = false)
    private boolean isFixedAmount = false;

    @Column(name = "fixed_amount", precision = 12, scale = 2)
    private BigDecimal fixedAmount;

    @Column(name = "min_amount", precision = 12, scale = 2)
    private BigDecimal minAmount;

    @Column(name = "max_amount", precision = 12, scale = 2)
    private BigDecimal maxAmount;

    @Column(length = 10)
    private String currency;

    @Column(name = "allow_anonymous", nullable = false)
    private boolean allowAnonymous = true;

    @Column(name = "organizer_label")
    private String organizerLabel;

    @Column(name = "success_message", columnDefinition = "TEXT")
    private String successMessage;

    @Column(name = "telegram_notify_enabled", nullable = false)
    private boolean telegramNotifyEnabled = false;

    @Column(name = "telegram_chat_id")
    private String telegramChatId;

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
""",
    "payment/PaymentTransaction.java": """package com.koupreng.backend.entity.payment;

import com.koupreng.backend.entity.invitation.UserInvitation;
import com.koupreng.backend.entity.invitation.Guest;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "payment_transactions")
public class PaymentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invitation_id", nullable = false)
    private UserInvitation invitation;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guest_id")
    private Guest guest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_config_id", nullable = false)
    private PaymentConfig paymentConfig;

    @Column(name = "payer_name")
    private String payerName;

    @Column(name = "payer_message", columnDefinition = "TEXT")
    private String payerMessage;

    @Column(name = "merchant_ref_no", unique = true)
    private String merchantRefNo;

    @Column(name = "payway_transaction_id")
    private String paywayTransactionId;

    @Column(length = 50)
    private String channel;

    @Column(precision = 12, scale = 2, nullable = false)
    private BigDecimal amount;

    @Column(length = 10, nullable = false)
    private String currency;

    @Column(name = "qr_payload", columnDefinition = "TEXT")
    private String qrPayload;

    @Column(name = "payment_link", length = 1000)
    private String paymentLink;

    @Column(length = 50)
    private String status;

    @Column(name = "requested_at")
    private Instant requestedAt;

    @Column(name = "paid_at")
    private Instant paidAt;

    @Column(name = "expired_at")
    private Instant expiredAt;

    @Column(name = "callback_received", nullable = false)
    private boolean callbackReceived = false;

    @Column(name = "raw_callback_json", columnDefinition = "JSON")
    private String rawCallbackJson;

    @Column(name = "verification_response_json", columnDefinition = "JSON")
    private String verificationResponseJson;

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
""",
    "payment/PaymentWebhookLog.java": """package com.koupreng.backend.entity.payment;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "payment_webhook_logs")
public class PaymentWebhookLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "webhook_log_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private PaymentTransaction paymentTransaction;

    @Column(length = 50)
    private String provider;

    @Column(name = "event_type", length = 100)
    private String eventType;

    @Column(name = "request_headers", columnDefinition = "TEXT")
    private String requestHeaders;

    @Column(name = "request_body", columnDefinition = "TEXT")
    private String requestBody;

    @Column(name = "received_at")
    private Instant receivedAt;

    @Column(name = "processed_status", length = 50)
    private String processedStatus;

    @Column(name = "processing_note", columnDefinition = "TEXT")
    private String processingNote;
}
""",
    "payment/TelegramNotification.java": """package com.koupreng.backend.entity.payment;

import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "telegram_notifications")
public class TelegramNotification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "telegram_notification_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private PaymentTransaction paymentTransaction;

    @Column(name = "chat_id", nullable = false)
    private String chatId;

    @Column(name = "message_text", columnDefinition = "TEXT", nullable = false)
    private String messageText;

    @Column(length = 50)
    private String status;

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(name = "response_json", columnDefinition = "JSON")
    private String responseJson;

    @Column(name = "created_at", updatable = false)
    private Instant createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = Instant.now();
    }
}
""",
    "payment/OrganizerPayoutAccount.java": """package com.koupreng.backend.entity.payment;

import com.koupreng.backend.entity.user.AppUser;
import jakarta.persistence.*;
import lombok.Data;
import java.time.Instant;

@Data
@Entity
@Table(name = "organizer_payout_accounts")
public class OrganizerPayoutAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payout_account_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;

    @Column(length = 50)
    private String provider;

    @Column(name = "merchant_id")
    private String merchantId;

    @Column(name = "merchant_name")
    private String merchantName;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

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
"""
}

for path, content in entities.items():
    with open(os.path.join(base_dir, path), "w", encoding="utf-8") as f:
        f.write(content)

print("Entities created successfully.")

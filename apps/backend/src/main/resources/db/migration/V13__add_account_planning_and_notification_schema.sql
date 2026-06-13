-- Forward-only compatibility migration for schema added after V12.
-- Keep the existing Flyway history intact; do not rewrite earlier versioned files.

ALTER TABLE templates
    ADD COLUMN code VARCHAR(120) NULL AFTER name,
    ADD COLUMN description TEXT NULL AFTER category,
    ADD COLUMN price DECIMAL(10,2) NULL AFTER preview_url,
    ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'USD' AFTER price,
    ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER status,
    ADD COLUMN updated_at DATETIME(6) NULL AFTER created_at;

UPDATE templates
SET code = CONCAT('template-', template_id)
WHERE code IS NULL OR code = '';

UPDATE templates
SET status = 'ACTIVE'
WHERE status IS NULL OR status = '';

ALTER TABLE templates
    MODIFY COLUMN code VARCHAR(120) NOT NULL,
    MODIFY COLUMN status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    ADD CONSTRAINT uk_templates_code UNIQUE (code),
    ADD INDEX idx_templates_status_sort (status, sort_order, created_at),
    ADD INDEX idx_templates_category (category),
    ADD INDEX idx_templates_premium (is_premium);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    used_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_password_reset_tokens_hash UNIQUE (token_hash),
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    INDEX idx_password_reset_tokens_user (user_id),
    INDEX idx_password_reset_tokens_expires_at (expires_at)
);

ALTER TABLE guests
    ADD COLUMN note TEXT NULL AFTER seat_count;

CREATE TABLE IF NOT EXISTS organizations (
    organization_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    owner_user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_organizations_slug UNIQUE (slug),
    CONSTRAINT fk_organizations_owner FOREIGN KEY (owner_user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    INDEX idx_organizations_owner (owner_user_id, status)
);

CREATE TABLE IF NOT EXISTS organization_members (
    member_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    organization_id BIGINT NOT NULL,
    user_id BIGINT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    status VARCHAR(50) NOT NULL DEFAULT 'INVITED',
    invited_at DATETIME(6) NULL,
    joined_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_organization_members_email UNIQUE (organization_id, email),
    CONSTRAINT fk_organization_members_org FOREIGN KEY (organization_id)
        REFERENCES organizations (organization_id) ON DELETE CASCADE,
    CONSTRAINT fk_organization_members_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE SET NULL,
    INDEX idx_organization_members_user (user_id, status)
);

ALTER TABLE invitations
    ADD COLUMN organization_id BIGINT NULL AFTER template_id,
    ADD COLUMN design_json TEXT NULL AFTER language_mode,
    ADD COLUMN content_json TEXT NULL AFTER design_json,
    ADD COLUMN custom_colors TEXT NULL AFTER content_json,
    ADD COLUMN custom_fonts TEXT NULL AFTER custom_colors,
    ADD COLUMN enabled_sections TEXT NULL AFTER custom_fonts,
    ADD COLUMN layout_settings TEXT NULL AFTER enabled_sections,
    ADD COLUMN access_token VARCHAR(80) NULL AFTER access_password,
    ADD COLUMN moderation_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE' AFTER status,
    MODIFY COLUMN visibility VARCHAR(30) NULL,
    ADD CONSTRAINT uk_invitations_access_token UNIQUE (access_token),
    ADD CONSTRAINT fk_invitations_organization FOREIGN KEY (organization_id)
        REFERENCES organizations (organization_id) ON DELETE SET NULL,
    ADD INDEX idx_invitations_organization (organization_id),
    ADD INDEX idx_invitations_user_deleted_created (user_id, deleted, created_at),
    ADD INDEX idx_invitations_template_deleted (template_id, deleted),
    ADD INDEX idx_invitations_status_deleted (status, deleted),
    ADD INDEX idx_invitations_deleted_created (deleted, created_at);

CREATE TABLE IF NOT EXISTS event_tables (
    table_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    table_name VARCHAR(120) NOT NULL,
    table_label VARCHAR(255) NULL,
    capacity INT NOT NULL DEFAULT 10,
    sort_order INT NOT NULL DEFAULT 0,
    notes TEXT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_event_tables_invitation_name UNIQUE (invitation_id, table_name),
    CONSTRAINT fk_event_tables_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE,
    INDEX idx_event_tables_invitation_sort (invitation_id, sort_order, table_name)
);

CREATE TABLE IF NOT EXISTS guest_seat_assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    table_id BIGINT NOT NULL,
    guest_id BIGINT NOT NULL,
    seat_label VARCHAR(80) NULL,
    seat_count INT NOT NULL DEFAULT 1,
    notes TEXT NULL,
    assigned_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_guest_seat_assignments_guest UNIQUE (guest_id),
    CONSTRAINT fk_guest_seat_assignments_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_seat_assignments_table FOREIGN KEY (table_id)
        REFERENCES event_tables (table_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_seat_assignments_guest FOREIGN KEY (guest_id)
        REFERENCES guests (guest_id) ON DELETE CASCADE,
    INDEX idx_guest_seat_assignments_invitation (invitation_id, table_id),
    INDEX idx_guest_seat_assignments_table (table_id)
);

CREATE TABLE IF NOT EXISTS guest_check_ins (
    check_in_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT NOT NULL,
    checked_in_by BIGINT NULL,
    checked_in_at DATETIME(6) NOT NULL,
    source VARCHAR(50) NOT NULL DEFAULT 'MANUAL',
    note TEXT NULL,
    CONSTRAINT uk_guest_check_ins_guest UNIQUE (guest_id),
    CONSTRAINT fk_guest_check_ins_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_check_ins_guest FOREIGN KEY (guest_id)
        REFERENCES guests (guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_check_ins_checked_by FOREIGN KEY (checked_in_by)
        REFERENCES users (user_id) ON DELETE SET NULL,
    INDEX idx_guest_check_ins_invitation (invitation_id, checked_in_at),
    INDEX idx_guest_check_ins_checked_by (checked_in_by)
);

CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(255) NOT NULL,
    groom VARCHAR(255) NULL,
    bride VARCHAR(255) NULL,
    event_date DATE NOT NULL,
    eating_time TIME NULL,
    location TEXT NULL,
    description TEXT NULL,
    cover_image_url VARCHAR(255) NULL,
    status VARCHAR(255) NOT NULL DEFAULT 'DRAFT',
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    published_at DATETIME(6) NULL,
    INDEX idx_events_status_deleted_date (status, deleted, event_date),
    INDEX idx_events_deleted (deleted),
    INDEX idx_events_created_at (created_at)
);

ALTER TABLE packages
    ADD COLUMN code VARCHAR(50) NULL AFTER package_name,
    ADD COLUMN description TEXT NULL AFTER code,
    ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'USD' AFTER price,
    ADD COLUMN billing_interval VARCHAR(30) NOT NULL DEFAULT 'ONCE' AFTER currency,
    ADD COLUMN max_guests_per_invitation INT NULL AFTER max_guests,
    ADD COLUMN max_team_members INT NULL AFTER max_guests_per_invitation,
    ADD COLUMN premium_templates_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER status,
    ADD COLUMN qr_invitations_enabled BOOLEAN NOT NULL DEFAULT TRUE AFTER premium_templates_enabled,
    ADD COLUMN qr_check_in_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER qr_invitations_enabled,
    ADD COLUMN seating_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER qr_check_in_enabled,
    ADD COLUMN advanced_analytics_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER seating_enabled,
    ADD COLUMN custom_branding_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER advanced_analytics_enabled,
    ADD COLUMN team_members_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER custom_branding_enabled,
    ADD COLUMN ai_assistant_enabled BOOLEAN NOT NULL DEFAULT FALSE AFTER team_members_enabled,
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE AFTER ai_assistant_enabled,
    ADD COLUMN sort_order INT NOT NULL DEFAULT 0 AFTER active,
    ADD COLUMN created_at DATETIME(6) NULL AFTER sort_order,
    ADD COLUMN updated_at DATETIME(6) NULL AFTER created_at;

UPDATE packages
SET code = CASE LOWER(package_name)
    WHEN 'free' THEN 'FREE'
    WHEN 'pro' THEN 'PRO'
    WHEN 'enterprise' THEN 'ENTERPRISE'
    ELSE CONCAT('PACKAGE-', package_id)
END
WHERE code IS NULL OR code = '';

ALTER TABLE packages
    MODIFY COLUMN code VARCHAR(50) NOT NULL,
    ADD CONSTRAINT uk_packages_code UNIQUE (code),
    ADD INDEX idx_packages_active_sort_price (active, sort_order, price),
    ADD INDEX idx_packages_status (status);

ALTER TABLE subscriptions
    ADD COLUMN order_code VARCHAR(50) NULL AFTER end_date,
    ADD COLUMN amount DECIMAL(10,2) NULL AFTER order_code,
    ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'USD' AFTER amount,
    ADD COLUMN provider VARCHAR(80) NULL AFTER currency,
    ADD COLUMN payment_link TEXT NULL AFTER provider,
    ADD COLUMN payment_note VARCHAR(120) NULL AFTER payment_link,
    ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'PENDING_PAYMENT' AFTER payment_status,
    ADD COLUMN updated_at DATETIME(6) NULL AFTER created_at,
    ADD CONSTRAINT uk_subscriptions_order_code UNIQUE (order_code),
    ADD INDEX idx_subscriptions_user_active (user_id, is_active, end_date),
    ADD INDEX idx_subscriptions_user_created (user_id, created_at),
    ADD INDEX idx_subscriptions_package (package_id);

ALTER TABLE notifications
    DROP FOREIGN KEY fk_notifications_invitation;

ALTER TABLE notifications
    ADD COLUMN user_id BIGINT NULL AFTER notification_id,
    ADD COLUMN rsvp_id BIGINT NULL AFTER guest_id,
    ADD COLUMN payment_order_id BIGINT NULL AFTER rsvp_id,
    ADD COLUMN type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM_ALERT' AFTER payment_order_id,
    ADD COLUMN title VARCHAR(255) NULL AFTER status,
    ADD COLUMN message TEXT NULL AFTER title,
    ADD COLUMN recipient_name VARCHAR(255) NULL AFTER message,
    ADD COLUMN recipient_email VARCHAR(255) NULL AFTER recipient_name,
    ADD COLUMN recipient_phone VARCHAR(50) NULL AFTER recipient_email,
    ADD COLUMN recipient_telegram_id VARCHAR(100) NULL AFTER recipient_phone,
    ADD COLUMN provider_message_id VARCHAR(255) NULL AFTER recipient_telegram_id,
    ADD COLUMN error_message TEXT NULL AFTER provider_message_id,
    ADD COLUMN delivered_at DATETIME(6) NULL AFTER sent_at,
    ADD COLUMN read_at DATETIME(6) NULL AFTER delivered_at,
    ADD COLUMN created_at DATETIME(6) NULL AFTER read_at,
    ADD COLUMN updated_at DATETIME(6) NULL AFTER created_at;

UPDATE notifications
SET title = COALESCE(NULLIF(title, ''), NULLIF(subject, ''), 'Notification'),
    message = COALESCE(message, message_body),
    channel = COALESCE(NULLIF(channel, ''), 'SYSTEM'),
    status = COALESCE(NULLIF(status, ''), 'PENDING'),
    created_at = COALESCE(created_at, scheduled_at, sent_at, NOW(6)),
    updated_at = COALESCE(updated_at, sent_at, scheduled_at, NOW(6));

ALTER TABLE notifications
    MODIFY COLUMN invitation_id BIGINT NULL,
    MODIFY COLUMN channel VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    MODIFY COLUMN status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    MODIFY COLUMN title VARCHAR(255) NOT NULL,
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_notifications_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_notifications_rsvp FOREIGN KEY (rsvp_id)
        REFERENCES rsvps (rsvp_id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_notifications_payment_order FOREIGN KEY (payment_order_id)
        REFERENCES template_payment_orders (id) ON DELETE SET NULL,
    ADD INDEX idx_notifications_user_created (user_id, created_at),
    ADD INDEX idx_notifications_user_status (user_id, status),
    ADD INDEX idx_notifications_user_unread (user_id, read_at),
    ADD INDEX idx_notifications_invitation_created (invitation_id, created_at),
    ADD INDEX idx_notifications_invitation_status (invitation_id, status),
    ADD INDEX idx_notifications_guest_type_created (guest_id, type, created_at),
    ADD INDEX idx_notifications_payment_order (payment_order_id),
    ADD INDEX idx_notifications_status (status),
    ADD INDEX idx_notifications_type (type),
    ADD INDEX idx_notifications_created_at (created_at);

CREATE TABLE IF NOT EXISTS system_audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    actor_user_id BIGINT NULL,
    actor_email VARCHAR(255) NULL,
    action VARCHAR(120) NOT NULL,
    resource_type VARCHAR(100) NULL,
    resource_id BIGINT NULL,
    description TEXT NULL,
    ip_address VARCHAR(100) NULL,
    user_agent VARCHAR(500) NULL,
    metadata_json TEXT NULL,
    created_at DATETIME(6) NULL,
    CONSTRAINT fk_system_audit_logs_actor FOREIGN KEY (actor_user_id)
        REFERENCES users (user_id) ON DELETE SET NULL,
    INDEX idx_system_audit_logs_created_at (created_at),
    INDEX idx_system_audit_logs_actor (actor_user_id),
    INDEX idx_system_audit_logs_resource (resource_type, resource_id)
);

INSERT INTO packages (
    code, package_name, description, price, currency, duration_days, max_invitations,
    max_guests, max_guests_per_invitation, max_team_members, features_json, status,
    billing_interval, premium_templates_enabled, qr_invitations_enabled, qr_check_in_enabled,
    seating_enabled, advanced_analytics_enabled, custom_branding_enabled, team_members_enabled,
    ai_assistant_enabled, active, sort_order, created_at, updated_at
)
SELECT 'FREE', 'Free', 'Starter plan for small invitations.', 0.00, 'USD', 365, 1,
       40, 40, 1,
       JSON_OBJECT('qrInvitations', TRUE, 'guestImport', TRUE),
       'ACTIVE', 'YEARLY', FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE,
       TRUE, 10, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE code = 'FREE');

INSERT INTO packages (
    code, package_name, description, price, currency, duration_days, max_invitations,
    max_guests, max_guests_per_invitation, max_team_members, features_json, status,
    billing_interval, premium_templates_enabled, qr_invitations_enabled, qr_check_in_enabled,
    seating_enabled, advanced_analytics_enabled, custom_branding_enabled, team_members_enabled,
    ai_assistant_enabled, active, sort_order, created_at, updated_at
)
SELECT 'PRO', 'Pro', 'Premium invitation operations for hosts.', 169.00, 'USD', 365, 20,
       2000, 500, 5,
       JSON_OBJECT('premiumTemplates', TRUE, 'qrCheckIn', TRUE, 'seating', TRUE, 'analytics', TRUE),
       'ACTIVE', 'YEARLY', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
       TRUE, 20, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE code = 'PRO');

INSERT INTO packages (
    code, package_name, description, price, currency, duration_days, max_invitations,
    max_guests, max_guests_per_invitation, max_team_members, features_json, status,
    billing_interval, premium_templates_enabled, qr_invitations_enabled, qr_check_in_enabled,
    seating_enabled, advanced_analytics_enabled, custom_branding_enabled, team_members_enabled,
    ai_assistant_enabled, active, sort_order, created_at, updated_at
)
SELECT 'ENTERPRISE', 'Enterprise', 'Team foundation for planners and venues.', 0.00, 'USD', 365, 999,
       99999, 5000, 25,
       JSON_OBJECT('teamMembers', TRUE, 'customBranding', TRUE, 'advancedAnalytics', TRUE),
       'ACTIVE', 'CUSTOM', TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE,
       TRUE, 30, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM packages WHERE code = 'ENTERPRISE');

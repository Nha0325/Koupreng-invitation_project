-- Core schema: auth, template catalog, invitations, guests, RSVP, notifications,
-- delivery history, and the standalone events module.

CREATE TABLE users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NULL,
    phone VARCHAR(30) NULL,
    full_name VARCHAR(120) NOT NULL,
    password_hash VARCHAR(100) NULL,
    role ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    token_version INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_users_email UNIQUE (email),
    CONSTRAINT uk_users_phone UNIQUE (phone)
);

CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_status ON users (status);
CREATE INDEX idx_users_created_at ON users (created_at);

CREATE TABLE password_reset_tokens (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(64) NOT NULL,
    expires_at DATETIME(6) NOT NULL,
    used_at DATETIME(6) NULL,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    CONSTRAINT uk_password_reset_tokens_hash UNIQUE (token_hash),
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_password_reset_tokens_user ON password_reset_tokens (user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens (expires_at);

CREATE TABLE templates (
    template_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(120) NOT NULL,
    category VARCHAR(50) NULL,
    description TEXT NULL,
    thumbnail_url VARCHAR(1000) NULL,
    preview_url VARCHAR(1000) NULL,
    price DECIMAL(10,2) NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    is_premium BOOLEAN NOT NULL DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT uk_templates_code UNIQUE (code)
);

CREATE INDEX idx_templates_status_sort ON templates (status, sort_order, created_at);
CREATE INDEX idx_templates_category ON templates (category);
CREATE INDEX idx_templates_premium ON templates (is_premium);

CREATE TABLE invitations (
    invitation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    template_id BIGINT NULL,
    organization_id BIGINT NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NULL,
    event_type VARCHAR(50) NULL,
    event_date DATE NULL,
    event_time TIME NULL,
    venue_name VARCHAR(255) NULL,
    venue_address VARCHAR(1000) NULL,
    google_map_url VARCHAR(1000) NULL,
    host_name VARCHAR(255) NULL,
    partner_name VARCHAR(255) NULL,
    groom_name VARCHAR(255) NULL,
    bride_name VARCHAR(255) NULL,
    story_text TEXT NULL,
    language_mode VARCHAR(20) NULL,
    design_json TEXT NULL,
    content_json TEXT NULL,
    custom_colors TEXT NULL,
    custom_fonts TEXT NULL,
    enabled_sections TEXT NULL,
    layout_settings TEXT NULL,
    visibility VARCHAR(30) NOT NULL DEFAULT 'PUBLIC',
    access_password VARCHAR(255) NULL,
    access_token VARCHAR(80) NULL,
    rsvp_deadline DATE NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    moderation_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    published_at DATETIME(6) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT uk_invitations_slug UNIQUE (slug),
    CONSTRAINT uk_invitations_access_token UNIQUE (access_token),
    CONSTRAINT fk_invitations_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE CASCADE,
    CONSTRAINT fk_invitations_template FOREIGN KEY (template_id)
        REFERENCES templates (template_id) ON DELETE SET NULL
);

CREATE INDEX idx_invitations_user_deleted_created ON invitations (user_id, deleted, created_at);
CREATE INDEX idx_invitations_template_deleted ON invitations (template_id, deleted);
CREATE INDEX idx_invitations_organization ON invitations (organization_id);
CREATE INDEX idx_invitations_status_deleted ON invitations (status, deleted);
CREATE INDEX idx_invitations_event_date ON invitations (event_date);
CREATE INDEX idx_invitations_deleted_created ON invitations (deleted, created_at);

CREATE TABLE invitation_sections (
    section_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    section_key VARCHAR(50) NOT NULL,
    section_title VARCHAR(255) NULL,
    content_json JSON NULL,
    sort_order INT NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_invitation_sections_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE
);

CREATE INDEX idx_invitation_sections_invitation_sort ON invitation_sections (invitation_id, sort_order);

CREATE TABLE media_files (
    media_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    media_type VARCHAR(50) NULL,
    file_url VARCHAR(1000) NULL,
    public_id VARCHAR(255) NULL,
    file_size BIGINT NULL,
    mime_type VARCHAR(100) NULL,
    original_filename VARCHAR(255) NULL,
    storage_provider VARCHAR(50) NULL,
    sort_order INT NULL,
    is_cover BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT fk_media_files_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE
);

CREATE INDEX idx_media_files_invitation_sort ON media_files (invitation_id, sort_order, created_at);
CREATE INDEX idx_media_files_media_type ON media_files (media_type);
CREATE INDEX idx_media_files_cover ON media_files (is_cover);

CREATE TABLE guests (
    guest_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    guest_group VARCHAR(255) NULL,
    side_type VARCHAR(255) NULL,
    table_number VARCHAR(255) NULL,
    invite_token VARCHAR(255) NULL,
    qr_code_url VARCHAR(1000) NULL,
    send_status VARCHAR(50) NULL,
    seat_count INT NULL,
    note TEXT NULL,
    last_sent_at DATETIME(6) NULL,
    last_reminder_at DATETIME(6) NULL,
    reminder_count INT NULL DEFAULT 0,
    last_send_channel VARCHAR(50) NULL,
    last_send_error VARCHAR(1000) NULL,
    invitation_viewed_at DATETIME(6) NULL,
    contribution_status VARCHAR(50) NULL,
    total_contributed DECIMAL(10,2) NULL,
    created_at DATETIME(6) NULL,
    CONSTRAINT uk_guests_invite_token UNIQUE (invite_token),
    CONSTRAINT fk_guests_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE
);

CREATE INDEX idx_guests_invitation_created ON guests (invitation_id, created_at);
CREATE INDEX idx_guests_invitation_group_table_name ON guests (invitation_id, guest_group, table_number, guest_name);
CREATE INDEX idx_guests_invitation_token ON guests (invitation_id, invite_token);
CREATE INDEX idx_guests_invitation_email ON guests (invitation_id, email);
CREATE INDEX idx_guests_invitation_phone ON guests (invitation_id, phone);
CREATE INDEX idx_guests_send_status ON guests (invitation_id, send_status);
CREATE INDEX idx_guests_invitation_viewed ON guests (invitation_id, invitation_viewed_at);

CREATE TABLE rsvps (
    rsvp_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT NULL,
    response_status VARCHAR(50) NULL,
    attendee_count INT NULL,
    message TEXT NULL,
    responded_at DATETIME(6) NULL,
    CONSTRAINT uk_rsvps_guest_id UNIQUE (guest_id),
    CONSTRAINT fk_rsvps_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_rsvps_guest FOREIGN KEY (guest_id)
        REFERENCES guests (guest_id) ON DELETE SET NULL
);

CREATE INDEX idx_rsvps_invitation_responded ON rsvps (invitation_id, responded_at);
CREATE INDEX idx_rsvps_invitation_status ON rsvps (invitation_id, response_status);
CREATE INDEX idx_rsvps_invitation_guest ON rsvps (invitation_id, guest_id);

CREATE TABLE notifications (
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    invitation_id BIGINT NULL,
    guest_id BIGINT NULL,
    rsvp_id BIGINT NULL,
    payment_order_id BIGINT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'SYSTEM_ALERT',
    channel VARCHAR(50) NOT NULL DEFAULT 'SYSTEM',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    title VARCHAR(255) NOT NULL,
    message TEXT NULL,
    recipient_name VARCHAR(255) NULL,
    recipient_email VARCHAR(255) NULL,
    recipient_phone VARCHAR(50) NULL,
    recipient_telegram_id VARCHAR(100) NULL,
    provider_message_id VARCHAR(255) NULL,
    error_message TEXT NULL,
    sent_at DATETIME(6) NULL,
    delivered_at DATETIME(6) NULL,
    read_at DATETIME(6) NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE SET NULL,
    CONSTRAINT fk_notifications_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE SET NULL,
    CONSTRAINT fk_notifications_guest FOREIGN KEY (guest_id)
        REFERENCES guests (guest_id) ON DELETE SET NULL,
    CONSTRAINT fk_notifications_rsvp FOREIGN KEY (rsvp_id)
        REFERENCES rsvps (rsvp_id) ON DELETE SET NULL
);

CREATE INDEX idx_notifications_user_created ON notifications (user_id, created_at);
CREATE INDEX idx_notifications_user_status ON notifications (user_id, status);
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, read_at);
CREATE INDEX idx_notifications_invitation_created ON notifications (invitation_id, created_at);
CREATE INDEX idx_notifications_invitation_status ON notifications (invitation_id, status);
CREATE INDEX idx_notifications_guest_type_created ON notifications (guest_id, type, created_at);
CREATE INDEX idx_notifications_payment_order ON notifications (payment_order_id);
CREATE INDEX idx_notifications_status ON notifications (status);
CREATE INDEX idx_notifications_type ON notifications (type);
CREATE INDEX idx_notifications_created_at ON notifications (created_at);

CREATE TABLE invitation_delivery_events (
    delivery_event_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT NULL,
    event_type VARCHAR(50) NOT NULL,
    channel VARCHAR(50) NULL,
    status VARCHAR(50) NULL,
    message TEXT NULL,
    error_message VARCHAR(1000) NULL,
    created_at DATETIME(6) NULL,
    CONSTRAINT fk_invitation_delivery_events_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_invitation_delivery_events_guest FOREIGN KEY (guest_id)
        REFERENCES guests (guest_id) ON DELETE SET NULL
);

CREATE INDEX idx_invitation_delivery_events_invitation_created ON invitation_delivery_events (invitation_id, created_at);
CREATE INDEX idx_invitation_delivery_events_guest ON invitation_delivery_events (guest_id);
CREATE INDEX idx_invitation_delivery_events_type ON invitation_delivery_events (event_type);

CREATE TABLE events (
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
    published_at DATETIME(6) NULL
);

CREATE INDEX idx_events_status_deleted_date ON events (status, deleted, event_date);
CREATE INDEX idx_events_deleted ON events (deleted);
CREATE INDEX idx_events_created_at ON events (created_at);

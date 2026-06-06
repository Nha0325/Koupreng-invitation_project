-- Enterprise foundations: seating, subscriptions, organizations, and package metadata.

ALTER TABLE packages
    ADD COLUMN code VARCHAR(50) NULL,
    ADD COLUMN description TEXT NULL,
    ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    ADD COLUMN billing_interval VARCHAR(30) NOT NULL DEFAULT 'ONCE',
    ADD COLUMN max_guests_per_invitation INT NULL,
    ADD COLUMN max_team_members INT NULL,
    ADD COLUMN premium_templates_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN qr_invitations_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN qr_check_in_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN seating_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN advanced_analytics_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN custom_branding_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN team_members_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN ai_assistant_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN sort_order INT NOT NULL DEFAULT 0,
    ADD COLUMN created_at DATETIME(6) NULL,
    ADD COLUMN updated_at DATETIME(6) NULL;

UPDATE packages
SET code = CONCAT('PACKAGE_', package_id),
    currency = COALESCE(currency, 'USD'),
    billing_interval = COALESCE(billing_interval, 'ONCE'),
    active = CASE WHEN UPPER(COALESCE(status, 'ACTIVE')) = 'ACTIVE' THEN TRUE ELSE FALSE END,
    created_at = COALESCE(created_at, NOW(6)),
    updated_at = COALESCE(updated_at, NOW(6))
WHERE code IS NULL OR code = '';

ALTER TABLE packages
    MODIFY code VARCHAR(50) NOT NULL;

CREATE UNIQUE INDEX uk_packages_code ON packages (code);
CREATE INDEX idx_packages_active_sort ON packages (active, sort_order);

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

ALTER TABLE subscriptions
    ADD COLUMN order_code VARCHAR(50) NULL,
    ADD COLUMN amount DECIMAL(10,2) NULL,
    ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    ADD COLUMN provider VARCHAR(80) NULL,
    ADD COLUMN payment_link TEXT NULL,
    ADD COLUMN payment_note VARCHAR(120) NULL,
    ADD COLUMN status VARCHAR(50) NOT NULL DEFAULT 'PENDING_PAYMENT',
    ADD COLUMN updated_at DATETIME(6) NULL;

CREATE UNIQUE INDEX uk_subscriptions_order_code ON subscriptions (order_code);
CREATE INDEX idx_subscriptions_user_active ON subscriptions (user_id, is_active, end_date);

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
    CONSTRAINT fk_event_tables_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX uk_event_tables_invitation_name ON event_tables (invitation_id, table_name);
CREATE INDEX idx_event_tables_invitation_sort ON event_tables (invitation_id, sort_order, table_name);

CREATE TABLE IF NOT EXISTS guest_seat_assignments (
    assignment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    table_id BIGINT NOT NULL,
    guest_id BIGINT NOT NULL,
    seat_label VARCHAR(80) NULL,
    seat_count INT NOT NULL DEFAULT 1,
    notes TEXT NULL,
    assigned_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_guest_seat_assignments_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_seat_assignments_table FOREIGN KEY (table_id)
        REFERENCES event_tables (table_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_seat_assignments_guest FOREIGN KEY (guest_id)
        REFERENCES guests (guest_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX uk_guest_seat_assignments_guest ON guest_seat_assignments (guest_id);
CREATE INDEX idx_guest_seat_assignments_invitation ON guest_seat_assignments (invitation_id, table_id);

CREATE TABLE IF NOT EXISTS organizations (
    organization_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    owner_user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT fk_organizations_owner FOREIGN KEY (owner_user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX uk_organizations_slug ON organizations (slug);
CREATE INDEX idx_organizations_owner ON organizations (owner_user_id, status);

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
    CONSTRAINT fk_organization_members_org FOREIGN KEY (organization_id)
        REFERENCES organizations (organization_id) ON DELETE CASCADE,
    CONSTRAINT fk_organization_members_user FOREIGN KEY (user_id)
        REFERENCES users (user_id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX uk_organization_members_email ON organization_members (organization_id, email);
CREATE INDEX idx_organization_members_user ON organization_members (user_id, status);

ALTER TABLE invitations
    ADD COLUMN organization_id BIGINT NULL;

CREATE INDEX idx_invitations_organization ON invitations (organization_id);

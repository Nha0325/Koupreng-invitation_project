-- Planning, seating, check-in, and organization tables.

CREATE TABLE budgets (
    budget_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    total_budget DECIMAL(12,2) NULL,
    notes TEXT NULL,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    CONSTRAINT uk_budgets_invitation UNIQUE (invitation_id),
    CONSTRAINT fk_budgets_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE
);

CREATE TABLE budget_items (
    budget_item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    budget_id BIGINT NOT NULL,
    category VARCHAR(100) NULL,
    item_name VARCHAR(255) NOT NULL,
    estimated_cost DECIMAL(12,2) NULL,
    actual_cost DECIMAL(12,2) NULL,
    vendor_name VARCHAR(255) NULL,
    notes TEXT NULL,
    CONSTRAINT fk_budget_items_budget FOREIGN KEY (budget_id)
        REFERENCES budgets (budget_id) ON DELETE CASCADE
);

CREATE INDEX idx_budget_items_budget_id ON budget_items (budget_id);
CREATE INDEX idx_budget_items_category ON budget_items (category);

CREATE TABLE event_tables (
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
        REFERENCES invitations (invitation_id) ON DELETE CASCADE
);

CREATE INDEX idx_event_tables_invitation_sort ON event_tables (invitation_id, sort_order, table_name);

CREATE TABLE guest_seat_assignments (
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
        REFERENCES guests (guest_id) ON DELETE CASCADE
);

CREATE INDEX idx_guest_seat_assignments_invitation ON guest_seat_assignments (invitation_id, table_id);
CREATE INDEX idx_guest_seat_assignments_table ON guest_seat_assignments (table_id);

CREATE TABLE guest_check_ins (
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
        REFERENCES users (user_id) ON DELETE SET NULL
);

CREATE INDEX idx_guest_check_ins_invitation ON guest_check_ins (invitation_id, checked_in_at);
CREATE INDEX idx_guest_check_ins_checked_by ON guest_check_ins (checked_in_by);

CREATE TABLE organizations (
    organization_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(120) NOT NULL,
    owner_user_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    CONSTRAINT uk_organizations_slug UNIQUE (slug),
    CONSTRAINT fk_organizations_owner FOREIGN KEY (owner_user_id)
        REFERENCES users (user_id) ON DELETE CASCADE
);

CREATE INDEX idx_organizations_owner ON organizations (owner_user_id, status);

CREATE TABLE organization_members (
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
        REFERENCES users (user_id) ON DELETE SET NULL
);

CREATE INDEX idx_organization_members_user ON organization_members (user_id, status);

ALTER TABLE invitations
    ADD CONSTRAINT fk_invitations_organization FOREIGN KEY (organization_id)
        REFERENCES organizations (organization_id) ON DELETE SET NULL;

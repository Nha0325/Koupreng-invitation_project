-- Align active JPA models with Flyway-managed schema.

CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    template_type VARCHAR(50) NOT NULL,
    groom VARCHAR(255) NULL,
    bride VARCHAR(255) NULL,
    event_date DATE NOT NULL,
    eating_time TIME NULL,
    location TEXT NULL,
    description TEXT NULL,
    cover_image_url VARCHAR(1000) NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME(6) NULL,
    updated_at DATETIME(6) NULL,
    published_at DATETIME(6) NULL,
    INDEX idx_events_status_deleted (status, deleted),
    INDEX idx_events_date (event_date)
);

ALTER TABLE templates
    ADD COLUMN code VARCHAR(120) NULL,
    ADD COLUMN description TEXT NULL,
    ADD COLUMN price DECIMAL(10,2) NULL,
    ADD COLUMN currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    ADD COLUMN sort_order INT NOT NULL DEFAULT 0,
    ADD COLUMN updated_at DATETIME(6) NULL;

UPDATE templates
SET code = CONCAT('template-', template_id)
WHERE code IS NULL OR code = '';

UPDATE templates
SET status = 'ACTIVE'
WHERE status IS NULL OR status = '';

UPDATE templates
SET currency = 'USD'
WHERE currency IS NULL OR currency = '';

ALTER TABLE templates
    MODIFY code VARCHAR(120) NOT NULL,
    MODIFY status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';

CREATE UNIQUE INDEX uk_templates_code ON templates (code);
CREATE INDEX idx_templates_status_sort ON templates (status, sort_order, created_at);

ALTER TABLE invitations
    ADD CONSTRAINT fk_invitations_organization FOREIGN KEY (organization_id)
        REFERENCES organizations (organization_id) ON DELETE SET NULL;

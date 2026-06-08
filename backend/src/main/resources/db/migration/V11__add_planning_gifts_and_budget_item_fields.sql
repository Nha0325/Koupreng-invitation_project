ALTER TABLE budget_items
    ADD COLUMN expense_date DATE NULL AFTER actual_cost,
    ADD COLUMN status VARCHAR(50) NULL AFTER expense_date;

CREATE TABLE IF NOT EXISTS wedding_gifts (
    gift_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    giver_name VARCHAR(255) NOT NULL,
    amount DECIMAL(12,2),
    method VARCHAR(100),
    received_date DATE,
    note TEXT,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    CONSTRAINT fk_wedding_gifts_invitation FOREIGN KEY (invitation_id) REFERENCES invitations(invitation_id) ON DELETE CASCADE,
    INDEX idx_wedding_gifts_invitation_id (invitation_id)
);

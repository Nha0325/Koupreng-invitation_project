-- Supporting/security additions for private invitation access, guest import metadata, and QR check-in.

SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE invitations ADD COLUMN access_token VARCHAR(80) NULL',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'invitations'
      AND COLUMN_NAME = 'access_token'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE UNIQUE INDEX uk_invitations_access_token ON invitations (access_token)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'invitations'
      AND INDEX_NAME = 'uk_invitations_access_token'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'ALTER TABLE guests ADD COLUMN note TEXT NULL',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'guests'
      AND COLUMN_NAME = 'note'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS guest_check_ins (
    check_in_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invitation_id BIGINT NOT NULL,
    guest_id BIGINT NOT NULL,
    checked_in_by BIGINT NULL,
    checked_in_at DATETIME(6) NOT NULL,
    source VARCHAR(50) NOT NULL,
    note TEXT NULL,
    CONSTRAINT fk_guest_check_ins_invitation FOREIGN KEY (invitation_id)
        REFERENCES invitations (invitation_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_check_ins_guest FOREIGN KEY (guest_id)
        REFERENCES guests (guest_id) ON DELETE CASCADE,
    CONSTRAINT fk_guest_check_ins_user FOREIGN KEY (checked_in_by)
        REFERENCES users (user_id) ON DELETE SET NULL
);

SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE UNIQUE INDEX uk_guest_check_ins_guest ON guest_check_ins (guest_id)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'guest_check_ins'
      AND INDEX_NAME = 'uk_guest_check_ins_guest'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_guest_check_ins_invitation ON guest_check_ins (invitation_id, checked_in_at)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'guest_check_ins'
      AND INDEX_NAME = 'idx_guest_check_ins_invitation'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

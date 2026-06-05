-- Part K: budget management query indexes.

SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_budget_items_budget_id ON budget_items (budget_id)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'budget_items'
      AND INDEX_NAME = 'idx_budget_items_budget_id'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (
    SELECT IF(
        COUNT(*) = 0,
        'CREATE INDEX idx_budget_items_category ON budget_items (category)',
        'SELECT 1'
    )
    FROM INFORMATION_SCHEMA.STATISTICS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'budget_items'
      AND INDEX_NAME = 'idx_budget_items_category'
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Seed Garden Royal Khmer Wedding template
INSERT INTO templates (name, category, thumbnail_url, preview_url, is_premium, status, created_at)
SELECT
    'Garden Royal Khmer Wedding',
    'TRADITIONAL',
    '/facebook/all/03-card/cover-card.jpg',
    '/templates/garden-royal-khmer-wedding',
    FALSE,
    'ACTIVE',
    NOW(6)
WHERE NOT EXISTS (
    SELECT 1
    FROM templates
    WHERE name = 'Garden Royal Khmer Wedding'
);

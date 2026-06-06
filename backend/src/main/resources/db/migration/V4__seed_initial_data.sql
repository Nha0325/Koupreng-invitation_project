-- Seed only backend-managed defaults required for the current application.
-- Templates remain admin-managed; the user frontend keeps static templates as a fallback.

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

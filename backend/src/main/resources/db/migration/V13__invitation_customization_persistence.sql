ALTER TABLE invitations
    ADD COLUMN design_json TEXT NULL,
    ADD COLUMN content_json TEXT NULL,
    ADD COLUMN custom_colors TEXT NULL,
    ADD COLUMN custom_fonts TEXT NULL,
    ADD COLUMN enabled_sections TEXT NULL,
    ADD COLUMN layout_settings TEXT NULL;

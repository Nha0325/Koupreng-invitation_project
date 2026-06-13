-- Run as a MySQL administrator, then replace passwords and host ranges.
-- The backend should use koupreng_app. Use koupreng_migrator only for schema migrations.

CREATE DATABASE IF NOT EXISTS koupreng_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

CREATE USER IF NOT EXISTS 'koupreng_app'@'10.%'
  IDENTIFIED BY 'CHANGE_ME_APP_PASSWORD'
  REQUIRE SSL;

GRANT SELECT, INSERT, UPDATE, DELETE
  ON koupreng_db.*
  TO 'koupreng_app'@'10.%';

CREATE USER IF NOT EXISTS 'koupreng_migrator'@'10.%'
  IDENTIFIED BY 'CHANGE_ME_MIGRATOR_PASSWORD'
  REQUIRE SSL;

GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, DROP, INDEX, REFERENCES
  ON koupreng_db.*
  TO 'koupreng_migrator'@'10.%';

CREATE USER IF NOT EXISTS 'koupreng_backup'@'10.%'
  IDENTIFIED BY 'CHANGE_ME_BACKUP_PASSWORD'
  REQUIRE SSL;

GRANT SELECT, SHOW VIEW, TRIGGER, EVENT, LOCK TABLES
  ON koupreng_db.*
  TO 'koupreng_backup'@'10.%';

FLUSH PRIVILEGES;

# Production Rollback and Forward-Recovery Plan

This plan requires provider-specific commands and ownership to be completed before release. Do not improvise destructive database changes during an incident.

## Trigger conditions

- Health checks fail or error/latency rates breach the approved release threshold.
- Authentication, invitation rendering, payment reconciliation, or RSVP becomes unavailable.
- A migration fails or the new application is incompatible with the migrated schema.
- A confirmed security incident requires immediate traffic isolation.

## Application rollback

1. Stop new deploys and preserve provider/build/application logs.
2. Route traffic to the previous healthy immutable frontend/backend artifacts using the deployment provider's supported rollback feature.
3. Keep the database at its current schema unless the reviewed migration plan explicitly proves backward incompatibility.
4. Verify health, login, one public invitation, RSVP read path, owner authorization, and admin authorization on the restored version.
5. Record the deployed commit SHA, artifact IDs, database migration version, timestamps, and incident owner.

Do not use broad process-name kills or mutable `target/archive` files as a production rollback mechanism. The provider must identify and stop the exact service/release.

## Database recovery

Flyway migrations are forward-only in this repository. Never delete rows from `flyway_schema_history`, edit an already-shared migration, or drop production columns/tables without a reviewed recovery plan and verified backup.

Preferred order:

1. Add and test a compensating forward migration.
2. If data recovery is required, take the application offline/read-only and restore a verified backup to a separate database.
3. Validate schema, row counts, ownership boundaries, and application smoke tests before traffic cutover.
4. Retain the failed database and logs until incident review permits disposal.

## Post-recovery verification

- Provider health check and `/actuator/health` are healthy.
- User/admin authentication and authorization boundaries pass.
- Public invitation rendering, RSVP read/write, and representative owner workflows pass.
- Payment/Telegram/email/storage integrations are reconciled before re-enabling writes.
- Monitoring, alerting, backup schedule, and deployment commit metadata are confirmed.

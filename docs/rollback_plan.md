# Production Rollback Plan

This document provides step-by-step procedures to revert the application stack to a known stable version in the event of a deployment failure.

---

## 1. Rollback Criteria

A rollback must be initiated if any of the following symptoms occur post-deployment:
- Actuator health endpoints report `DOWN` or do not respond within 3 minutes.
- User authentication logs report high error rates (above 5%) for standard login requests.
- Frontends return loading failures or console JS script crashes.
- Database locking errors occur during database migration sequences.

---

## 2. Reversion Steps

Follow these recovery steps in order:

### Phase A: Reverse Proxy Re-routing (Edge)
- If the deployment fails completely, immediately modify the reverse proxy (Nginx or Load Balancer configuration) to target the previous server instance hosting the last stable version.
- This restores client operations instantly while debugging occurs.

### Phase B: Frontend Rollback
- Re-tag or redeploy the static asset folder from the previous build version:
  - Copy the backup `/dist` folder to Nginx's HTML folder.
  - Or trigger a version fallback in Cloudflare Pages / Vercel history logs.

### Phase C: Backend Application Rollback
- Stop the active JAR:
  ```bash
  kill $(pgrep -f "backend-0.0.1-SNAPSHOT.jar")
  ```
- Startup the previous stable JAR package from target archives:
  ```bash
  nohup java -jar target/archive/backend-0.0.0-STABLE.jar --spring.profiles.active=prod > backend.log 2>&1 &
  ```
- Monitor backend startup logs.

### Phase D: Database Schema Rollback
- **Caution**: Only rollback database schemas if migrations altered table structures incompatibly.
- Since Flyway works forward-only, database schema rollbacks require manual scripts:
  - Execute the corresponding `rollback_V{version}.sql` script manually in the MySQL shell to drop fields/tables safely.
  - Delete the corresponding version entry in the `flyway_schema_history` table to allow subsequent schema migrations.
  ```sql
  DELETE FROM flyway_schema_history WHERE version = '13';
  ```

---

## 3. Post-Rollback Verification

Confirm system stabilization:
- Verify Actuator reporting: `GET /actuator/health`.
- Test user logins, invitation custom properties saving, and budget exports.
- Inspect system logs for any exceptions or connection errors.

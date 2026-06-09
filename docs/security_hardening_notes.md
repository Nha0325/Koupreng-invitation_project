# Security Hardening Notes

## CSV Formula Injection Risk
Exports built dynamically could allow code execution vulnerabilities on the admin's machine (e.g. MS Excel) via Formula Injection if user-provided strings begin with `=`, `+`, `-`, or `@`.

**Affected Exports (Patched)**
* `BudgetService` (budget export)
* `SeatingService` (seating arrangement export)
* `DashboardReportService` (guests and RSVP reports)
* `GuestService` (guest tracking export)

**Mitigation**
All CSV endpoints now use a centralized `CsvExportUtils` utility that safely trims leading whitespaces and pads malicious prefixes with a preceding single quote (`'`). All cells are safely wrapped in double quotes. Comprehensive unit tests added.

## Audit IP Spoofing Risk
Using `X-Forwarded-For` without validating or properly configuring the reverse proxy pipeline allows attackers to inject spoofed IP addresses into system audit logs.

**Mitigation**
`AuditLogService` defaults to resolving client IP securely using `request.getRemoteAddr()`. 

To safely pass original client IPs behind a trusted Load Balancer/Proxy (like Cloudflare, AWS ALB, Nginx):
1. The deployment must be behind a trusted reverse proxy (e.g., Cloudflare, Nginx, ALB).
2. The proxy must forcefully strip or overwrite incoming client-provided `X-Forwarded-For` headers to prevent external spoofing.
3. Enable framework-level parsing using the Spring Boot configuration property:
   `server.forward-headers-strategy=framework`
4. Turn on the application's header trust setting using:
   `app.audit.trust-forwarded-headers=true`

# Security Alerts & Monitoring (React2Shell)

## Detection Strategy
Monitor for anomalies that indicate attempted exploitation of CVE-2025-55182.

### 1. WAF & Edge Alerts (Cloudflare/Vercel)
- **High Priority:** Spikes in blocked requests matching "Suspicious React Flight Headers".
- **Medium Priority:** Increased 413 (Payload Too Large) on `POST` requests to `/`.

### 2. Application Logs (Datadog / Sentry)
- **Pattern:** `[Security] Blocked large payload` (from middleware).
- **Pattern:** `[Security] Rate limit exceeded` on API routes.
- **Pattern:** Uncaught exceptions in `ReactServerComponents` or deserialization errors.

### 3. Infrastructure (AWS / Vercel Logs)
- **Critical:** Detection of unexpected child processes (`sh`, `bash`, `curl`) spawned by the Node.js process.
- **Critical:** Outbound network connections to unknown IPs from the serverless function environment.

## Response Plan
If exploitation is confirmed:
1. Trigger **Emergency Maintenance Mode** (see `hotfix.md`).
2. Rotate all database credentials and API keys.
3. Analyze logs to determine scope of data exfiltration.
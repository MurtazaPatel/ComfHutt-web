# Security Operations: React2Shell Mitigation

This directory contains scripts and documentation for mitigating **React2Shell (CVE-2025-55182)**.

## Quick Actions

### 1. Emergency Block (Active Attack)
Set the environment variable:
\`\`\`bash
DISABLE_RSC=true
\`\`\`
Then redeploy. This triggers logic in `next.config.ts` (if supported) or can be used to toggle middleware blocks.

### 2. Audit Codebase
Run the audit script to detect RSC endpoints:
\`\`\`bash
./scripts/security/react2shell-audit.sh
\`\`\`

### 3. Update Dependencies
Run the update script to pull patched versions:
\`\`\`bash
./patches/update-deps/update-script.sh
\`\`\`

## References
- [Alerts & Monitoring](./alerts.md)
- [Hotfix & Rollback](./hotfix.md)
- [WAF Rules](../waf/vercel_rules.md)
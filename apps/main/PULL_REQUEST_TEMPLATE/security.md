# Security Patch PR

**Vulnerability:** React2Shell (CVE-2025-55182) / Next.js (CVE-2025-66478)
**Priority:** Critical

## 🛡️ Hardening Checklist
- [ ] **Dependencies:** React/Next.js upgraded to patched versions.
- [ ] **Middleware:** Request body size limit and header validation active.
- [ ] **Server Functions:** All server actions validated with Zod/Type check before use.
- [ ] **WAF:** Edge rules verified (Cloudflare/Vercel).

## 🧪 Verification
- [ ] `npm run build` succeeds.
- [ ] `npm test` passes (no regressions).
- [ ] Manual Smoke Test: Verify `/choices` and `/auth` endpoints work correctly.
- [ ] Security Scan: `scripts/security/react2shell-audit.sh` report attached.

## ⚠️ Rollback Plan
If this patch causes issues, revert using `security/hotfix.md` procedures.
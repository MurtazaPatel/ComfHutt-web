# Emergency Hotfix & Rollback Procedures

## Scenario A: Active Exploitation Detected
**Immediate Action:** Block traffic to Server Components.

### 1. Enable RSC Safe Mode
Set the following environment variable in Vercel / AWS:
\`\`\`bash
DISABLE_RSC=true
\`\`\`
*Redeploy the application.* This will trigger the `next.config.ts` flag to restrict server actions configuration (if supported by your Next.js version logic) or can be used in Middleware to block all `next-action` requests.

### 2. Apply WAF Block
Go to Cloudflare/Vercel Firewall and enable the **"Block Suspicious React Flight Headers"** rule (see `waf/`).

## Scenario B: Bad Patch / Regression
**Immediate Action:** Revert to last known good commit.

### 1. Fast Revert
\`\`\`bash
git revert HEAD -m 1
git push origin main
\`\`\`

### 2. Redeploy Previous Build
In Vercel Dashboard, go to **Deployments**, find the last successful build (green), click **...** and select **Redeploy**.

## Scenario C: Patching Dependencies
If a new React/Next.js patch is released:
1. Run `patches/update-deps/update-script.sh` locally.
2. Verify `npm audit` is clean.
3. Commit and push: `git commit -am "chore(security): upgrade react/next"`.
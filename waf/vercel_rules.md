# Vercel WAF / Firewall Configuration

To protect against **React2Shell (CVE-2025-55182)**, configure the following rules in your Vercel Project Settings > Security > Firewall.

## 1. Block Suspicious RSC Headers
**Condition:**
- Header `rsc` equals `1`
- AND Header `content-type` DOES NOT CONTAIN `text/x-component`

**Action:** Deny

## 2. Block Large Payloads on Server Actions
**Condition:**
- Method `POST`
- AND Header `next-action` Exists
- AND Header `content-length` is greater than `102400` (100KB) - *Adjust based on app needs*

**Action:** Deny

## 3. Strict Content-Type for Actions
**Condition:**
- Method `POST`
- AND Header `next-action` Exists
- AND Header `content-type` is NOT IN (`text/x-component`, `multipart/form-data`, `application/json`)

**Action:** Challenge or Deny
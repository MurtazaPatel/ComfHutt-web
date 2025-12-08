#!/bin/bash

# react2shell-audit.sh
# Audits codebase for React2Shell (CVE-2025-55182) and Next.js (CVE-2025-66478) vulnerability patterns.

REPORT_FILE="security/react2shell-report.json"
mkdir -p security

echo "Starting React2Shell Audit..."

# 1. Detect Versions
REACT_VERSION=$(grep '"react":' package.json | awk -F '"' '{print $4}')
NEXT_VERSION=$(grep '"next":' package.json | awk -F '"' '{print $4}')

echo "Detected React Version: $REACT_VERSION"
echo "Detected Next.js Version: $NEXT_VERSION"

# 2. Scan for Server Actions / Server Components
# Patterns: "use server", "export async function", "server-only"
# We scan src/app and src/lib primarily

echo "Scanning for Server Actions and RSC endpoints..."

SERVER_ACTIONS=$(grep -r "use server" src/app src/lib src/actions --include=*.{ts,tsx,js,jsx} 2>/dev/null)
SERVER_ONLY_IMPORTS=$(grep -r "server-only" src/ --include=*.{ts,tsx,js,jsx} 2>/dev/null)
NEXT_CONFIG_RSC=$(grep -r "serverActions" next.config.ts 2>/dev/null)

# 3. Generate Report
cat <<EOF > $REPORT_FILE
{
  "timestamp": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "environment": {
    "react_version": "$REACT_VERSION",
    "next_version": "$NEXT_VERSION",
    "node_version": "$(node -v)"
  },
  "findings": {
    "server_actions_files": [
$(echo "$SERVER_ACTIONS" | awk -F: '{print "      \"" $1 "\","}' | sort | uniq | sed '$s/,$//')
    ],
    "server_only_usage": [
$(echo "$SERVER_ONLY_IMPORTS" | awk -F: '{print "      \"" $1 "\","}' | sort | uniq | sed '$s/,$//')
    ],
    "next_config_server_actions": "$NEXT_CONFIG_RSC"
  },
  "status": "Audit Complete"
}
EOF

echo "Audit Complete. Report generated at $REPORT_FILE"
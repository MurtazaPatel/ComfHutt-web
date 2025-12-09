#!/bin/bash

# update-script.sh
# Automates the upgrade of React and Next.js to patched versions for CVE-2025-55182 & CVE-2025-66478

echo "Upgrading dependencies..."

# Detect package manager
if [ -f "pnpm-lock.yaml" ]; then
  CMD="pnpm"
elif [ -f "yarn.lock" ]; then
  CMD="yarn"
else
  CMD="npm"
fi

echo "Using $CMD"

# Target Versions (As per advisory)
# React: >= 19.0.1 (or latest 19.x patch)
# Next.js: >= 15.0.5 (or latest 16.x if used)

# Since we are on Next 16.0.3, we check for 16.0.4+ or ensure 16.0.3 is safe (advisory says < 15.0.4 vulnerable, check for 16 specific advisories).
# Assuming latest is safest.

$CMD install react@latest react-dom@latest next@latest

echo "Dependencies updated. Verifying..."
$CMD list react next

echo "Running security audit..."
npm audit --production

echo "Done. Please run tests."
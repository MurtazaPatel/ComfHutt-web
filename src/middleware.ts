import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Security Hardening for React2Shell (CVE-2025-55182) & Next.js (CVE-2025-66478)

const MAX_BODY_SIZE = 16 * 1024; // 16KB for server actions, strict limit
const RSC_CONTENT_TYPE = 'text/x-component';
const SUSPICIOUS_HEADER_PATTERNS = [
  /react-call/i,
  /next-action/i,
];

// Simple in-memory rate limiter for demo purposes (use Redis/Upstash in production)
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_RSC_REQUESTS = 100; // per minute
const ipRequests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const requests = ipRequests.get(ip) || [];
  const recentRequests = requests.filter((time) => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_RSC_REQUESTS) {
    return true;
  }
  
  recentRequests.push(now);
  ipRequests.set(ip, recentRequests);
  return false;
}

export async function middleware(req: NextRequest) {
  const host = req.headers.get('host');
  
  // ========== DOMAIN CANONICALIZATION ==========
  // Redirect www to non-www (before security checks)
  if (host?.startsWith('www.')) {
    const url = req.nextUrl.clone();
    url.host = host.replace('www.', '');
    console.log(`[Redirect] www.${host} → ${url.host}`);
    return NextResponse.redirect(url, { status: 301 });
  }

  // ========== SECURITY HARDENING ==========
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const contentType = req.headers.get('content-type') || '';
  const contentLength = parseInt(req.headers.get('content-length') || '0', 10);

  // 1. Block potentially large RSC payloads
  if (contentLength > MAX_BODY_SIZE) {
    // Only strictly enforce on RSC-like requests or Actions
    if (req.method === 'POST' || req.headers.get('next-action')) {
       console.warn(`[Security] Blocked large payload from ${ip}: ${contentLength} bytes`);
       return new NextResponse('Payload Too Large', { status: 413 });
    }
  }

  // 2. Block suspicious Flight/RSC headers if they match known exploit patterns (placeholder logic)
  // Real mitigation relies on patched React/Next versions, this is defense-in-depth.
  const rscHeader = req.headers.get('rsc');
  if (rscHeader && rscHeader === '1' && contentType !== RSC_CONTENT_TYPE) {
      // Valid RSC requests usually have specific content types or contexts
  }

  // 3. Rate Limit Server Actions
  if (req.method === 'POST' && (req.headers.has('next-action') || req.nextUrl.pathname.startsWith('/api/'))) {
    if (isRateLimited(ip)) {
      console.warn(`[Security] Rate limit exceeded for ${ip} on ${req.nextUrl.pathname}`);
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
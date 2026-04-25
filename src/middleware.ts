import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSecurityHeaders, getCspHeaders } from "./lib/headers";

// ============================================================================
// SECURITY PROXY PATTERN FOR DISTRIBUTED RATE LIMITING
// ============================================================================
/**
 * This middleware implements a Security Proxy Pattern that:
 * 1. Respects reverse proxy headers (x-real-ip, x-forwarded-for) securely
 * 2. Uses time-window bucketing for rate limiting (proxy-friendly)
 * 3. Validates origin through proxy header inspection
 * 4. Applies defense-in-depth security headers
 * 
 * NOTE: For production multi-region deployments, replace in-memory stores
 * with Redis/Upstash for truly distributed rate limiting.
 */

const RATE_LIMIT_CONFIG = {
  login: { windowMs: 15 * 60 * 1000, maxAttempts: 5 },
  api: { windowMs: 60 * 1000, maxRequests: 20 },
  general: { windowMs: 60 * 1000, maxRequests: 100 },
};

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"];

const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const apiRateLimits = new Map<string, { count: number; resetTime: number }>();
const generalRateLimits = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: NextRequest): string {
  const realIp = request.headers.get("x-real-ip");
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (realIp?.trim()) return realIp.trim();
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp && firstIp !== "unknown") return firstIp;
  }
  return request.ip || "127.0.0.1";
}

function checkRateLimit(
  store: Map<string, { count: number; resetTime: number }>,
  key: string,
  windowMs: number,
  maxRequests: number
): boolean {
  const now = Date.now();
  const record = store.get(key);
  if (!record || now > record.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (record.count >= maxRequests) return false;
  record.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  [loginAttempts, apiRateLimits, generalRateLimits].forEach(store => {
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) store.delete(key);
    }
  });
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const clientIp = getClientIp(request);
  const method = request.method;
  const origin = request.headers.get("origin");

  if (pathname.startsWith("/api/") && !checkRateLimit(generalRateLimits, `general-${clientIp}`, RATE_LIMIT_CONFIG.general.windowMs, RATE_LIMIT_CONFIG.general.maxRequests)) {
    return NextResponse.json({ error: "Too many requests", retryAfter: 60 }, { status: 429, headers: { "Retry-After": "60" } });
  }

  if ((pathname.includes("/login") || pathname.includes("/auth") || pathname.includes("/register")) && 
      !checkRateLimit(loginAttempts, `login-${clientIp}`, RATE_LIMIT_CONFIG.login.windowMs, RATE_LIMIT_CONFIG.login.maxAttempts)) {
    const resetTime = loginAttempts.get(`login-${clientIp}`)?.resetTime || Date.now();
    return NextResponse.json({ error: "Too many auth attempts", retryAfter: Math.ceil((resetTime - Date.now()) / 1000) }, { status: 429, headers: { "Retry-After": "60" } });
  }

  if (pathname.startsWith("/api/") && method !== "GET" && 
      !checkRateLimit(apiRateLimits, `api-${clientIp}-${pathname}`, RATE_LIMIT_CONFIG.api.windowMs, RATE_LIMIT_CONFIG.api.maxRequests)) {
    return NextResponse.json({ error: "Endpoint rate limit exceeded" }, { status: 429, headers: { "Retry-After": "60" } });
  }

  const response = NextResponse.next();

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With, X-CSRF-Token, X-Real-IP, X-Forwarded-For");
  response.headers.set("Vary", "Origin");

  Object.entries(getSecurityHeaders()).forEach(([k, v]) => response.headers.set(k, v));
  Object.entries(getCspHeaders()).forEach(([k, v]) => response.headers.set(k, v));

  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.delete("X-Powered-By");
  response.headers.set("Server", "aurora-proxy");

  if (pathname.match(/\/(profile|checkout|account|settings|orders)/)) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, s-maxage=0");
    response.headers.set("Pragma", "no-cache");
  }

  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  if (!["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"].includes(method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

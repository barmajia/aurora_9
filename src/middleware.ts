import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSecurityHeaders, getCspHeaders } from "./lib/headers";

const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
];

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= MAX_ATTEMPTS) {
    return true;
  }

  record.count++;
  return false;
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function sanitizeHeaderName(header: string): string {
  return header.replace(/[^a-zA-Z0-9-]/g, "");
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const clientIp = getClientIp(request);
  const method = request.method;

  // ========================================================================
  // RATE LIMITING - Login Endpoints
  // ========================================================================
  if (
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/seller/login") ||
    pathname.startsWith("/api/factory/login") ||
    pathname.startsWith("/api/auth/login")
  ) {
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 },
      );
    }
  }

  // ========================================================================
  // API RATE LIMITING - General Endpoints
  // ========================================================================
  const apiRateLimits = new Map<string, { count: number; resetTime: number }>();
  if (pathname.startsWith("/api/") && method !== "GET") {
    const now = Date.now();
    const key = `${clientIp}-${pathname}`;
    const record = apiRateLimits.get(key);

    if (record && now < record.resetTime) {
      if (record.count >= 20) {
        // 20 POST/PUT/DELETE requests per minute
        return NextResponse.json(
          { error: "Rate limit exceeded" },
          { status: 429 },
        );
      }
      record.count++;
    } else {
      apiRateLimits.set(key, { count: 1, resetTime: now + 60000 });
    }
  }

  const response = NextResponse.next();

  // ========================================================================
  // CORS CONFIGURATION - Origin Validation
  // ========================================================================
  const origin = request.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.some((allowed) => origin.includes(allowed))) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else if (ALLOWED_ORIGINS.length > 0) {
    response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-CSRF-Token",
  );
  response.headers.set("Access-Control-Max-Age", "3600");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // ========================================================================
  // SECURITY HEADERS - XSS, Clickjacking, MIME Type Protection
  // ========================================================================
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // ========================================================================
  // CONTENT SECURITY POLICY
  // ========================================================================
  const cspHeaders = getCspHeaders();
  Object.entries(cspHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // ========================================================================
  // ADDITIONAL SECURITY HEADERS
  // ========================================================================
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  response.headers.set("X-Powered-By", ""); // Remove server info
  response.headers.set("Server", ""); // Remove server info

  // ========================================================================
  // REQUEST SIZE LIMIT - Prevent large payload attacks
  // ========================================================================
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    // 10MB limit
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  // ========================================================================
  // METHOD VALIDATION - Prevent invalid HTTP methods
  // ========================================================================
  const validMethods = [
    "GET",
    "POST",
    "PUT",
    "DELETE",
    "OPTIONS",
    "PATCH",
    "HEAD",
  ];
  if (!validMethods.includes(method)) {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/seller/login/:path*",
    "/factory/login/:path*",
    "/login/:path*",
  ],
};

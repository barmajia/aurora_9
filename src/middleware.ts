import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];

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
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
         request.headers.get("x-real-ip") ||
         "unknown";
}

function sanitizeHeaderName(header: string): string {
  return header.replace(/[^a-zA-Z0-9-]/g, '');
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const clientIp = getClientIp(request);

  if (
    pathname.startsWith("/seller/login") ||
    pathname.startsWith("/factory/login") ||
    pathname === "/login"
  ) {
    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }
  }

  const response = NextResponse.next();

  const origin = request.headers.get("origin");
  if (origin && ALLOWED_ORIGINS.some(allowed => origin.includes(allowed))) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else if (ALLOWED_ORIGINS.length > 0) {
    response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGINS[0]);
  }
  
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Max-Age", "3600");

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://api.stripe.com",
    "frame-ancestors 'none'",
  ].join('; ');
  
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    "/seller/login/:path*",
    "/factory/login/:path*", 
    "/login/:path*",
    "/api/:path*"
  ],
};
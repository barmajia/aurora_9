import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = parseInt(process.env.JWT_EXPIRY || "86400", 10); // 24 hours

if (!JWT_SECRET) {
  // In production this is a critical misconfiguration — tokens cannot be verified securely
  console.error(
    "🚨 CRITICAL: JWT_SECRET environment variable is not set. "
    + "All JWT tokens will use an insecure fallback. "
    + "Set JWT_SECRET in your environment variables immediately."
  );
}

const _JWT_SECRET = JWT_SECRET || "default-secret-key-change-in-production";

/**
 * Aurora Security Protocol
 * Provides ID obfuscation, SQL injection prevention, and authentication layers.
 */

// ============================================================================
// INPUT VALIDATION & SANITIZATION
// ============================================================================

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  type?: string;
  enum?: (string | number)[];
  allowEmpty?: boolean;
}

export function validateInput(
  body: Record<string, unknown>,
  schema: Record<string, ValidationRule>,
) {
  const errors: string[] = [];

  for (const key in schema) {
    const rule = schema[key];
    const value = body?.[key];

    // Check required
    if (
      rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      errors.push(`${key} is required`);
      continue;
    }

    // Skip further validation if not required and empty
    if (
      !rule.required &&
      (value === undefined || value === null || value === "")
    ) {
      if (!rule.allowEmpty && rule.required !== false) {
        continue;
      }
    }

    // Type validation
    if (rule.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (typeof value === "string" && !emailRegex.test(value)) {
        errors.push(`${key} must be a valid email`);
      }
    }

    if (rule.type === "url") {
      try {
        new URL(String(value));
      } catch {
        errors.push(`${key} must be a valid URL`);
      }
    }

    // Enum validation
    if (rule.enum && !rule.enum.includes(value as string | number)) {
      errors.push(`${key} must be one of: ${rule.enum.join(", ")}`);
    }

    if (typeof value === "string") {
      // Length validation
      if (rule.min && value.length < rule.min) {
        errors.push(`${key} must be at least ${rule.min} characters`);
      }
      if (rule.max && value.length > rule.max) {
        errors.push(`${key} must be at most ${rule.max} characters`);
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${key} is invalid`);
      }
    }

    if (typeof value === "number") {
      if (rule.min && value < rule.min) {
        errors.push(`${key} must be at least ${rule.min}`);
      }
      if (rule.max && value > rule.max) {
        errors.push(`${key} must be at most ${rule.max}`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// XSS PROTECTION - COMPREHENSIVE INPUT SANITIZATION
// ============================================================================

export function sanitizeInput(
  value: unknown,
  maxLength: number = 1000,
): string {
  const text = String(value ?? "")
    .slice(0, maxLength)
    .trim();

  // Remove/escape dangerous HTML entities
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

export function sanitizeHtml(html: string): string {
  // Remove script tags and event handlers
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
    .replace(/on\w+\s*=\s*[^\s>]*/gi, "");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// ============================================================================
// PASSWORD HASHING & SECURITY
// ============================================================================

export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err);
      resolve(salt.toString("hex") + ":" + derivedKey.toString("hex"));
    });
  });
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":");
    crypto.pbkdf2(
      password,
      Buffer.from(salt, "hex"),
      100000,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex") === key);
      },
    );
  });
}

// ============================================================================
// JWT TOKEN GENERATION & VERIFICATION
// ============================================================================

export interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

function createJwtSignature(
  header: string,
  payload: string,
  secret: string,
): string {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(header + "." + payload);
  return hmac.digest("base64url");
}

export function generateToken(
  payload: TokenPayload,
  expirySeconds: number = JWT_EXPIRY,
): string {
  try {
    const header = {
      alg: "HS256",
      typ: "JWT",
    };

    const now = Math.floor(Date.now() / 1000);
    const tokenPayload = {
      ...payload,
      iat: now,
      exp: now + expirySeconds,
    };

    const headerEncoded = Buffer.from(JSON.stringify(header)).toString(
      "base64url",
    );
    const payloadEncoded = Buffer.from(JSON.stringify(tokenPayload)).toString(
      "base64url",
    );
    const signature = createJwtSignature(
      headerEncoded,
      payloadEncoded,
      _JWT_SECRET,
    );

    return `${headerEncoded}.${payloadEncoded}.${signature}`;
  } catch {
    return "";
  }
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [headerEncoded, payloadEncoded, signatureProvided] = parts;

    // Verify signature
    const signatureCalculated = createJwtSignature(
      headerEncoded,
      payloadEncoded,
      _JWT_SECRET,
    );

    if (signatureProvided !== signatureCalculated) {
      return null;
    }

    // Decode and verify payload
    const payload = JSON.parse(
      Buffer.from(payloadEncoded, "base64url").toString("utf8"),
    ) as TokenPayload & { exp?: number; iat?: number };

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return null;
    }

    // Remove internal fields
    delete payload.iat;
    delete payload.exp;

    return payload;
  } catch {
    return null;
  }
}

// ============================================================================
// AUTHORIZATION
// ============================================================================

export function requireAuth(request: NextRequest): TokenPayload | NextResponse {
  const authHeader =
    request.headers.get("authorization") ||
    request.headers.get("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  const payload = verifyToken(token);

  if (!payload) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }

  return payload;
}

export function requireAdmin(request: NextRequest): true | NextResponse {
  const auth = requireAuth(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  if (auth.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );
  }

  return true;
}

export function requireRole(
  request: NextRequest,
  requiredRole: string,
): true | NextResponse {
  const auth = requireAuth(request);

  if (auth instanceof NextResponse) {
    return auth;
  }

  if (auth.role !== requiredRole) {
    return NextResponse.json(
      { error: `${requiredRole} access required` },
      { status: 403 },
    );
  }

  return true;
}

// ============================================================================
// CSRF PROTECTION
// ============================================================================

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function verifyCsrfToken(token: string, sessionToken: string): boolean {
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken));
}

// ============================================================================
// RATE LIMITING HELPERS
// ============================================================================

export interface RateLimitStore {
  attempts: Map<string, { count: number; resetTime: number }>;
}

const rateLimitStores = new Map<string, RateLimitStore>();

export function createRateLimiter(
  windowMs: number = 15 * 60 * 1000,
  maxAttempts: number = 5,
) {
  const store: RateLimitStore = {
    attempts: new Map(),
  };

  return {
    check: (key: string): boolean => {
      const now = Date.now();
      const record = store.attempts.get(key);

      if (!record || now > record.resetTime) {
        store.attempts.set(key, { count: 1, resetTime: now + windowMs });
        return true;
      }

      if (record.count >= maxAttempts) {
        return false;
      }

      record.count++;
      return true;
    },
    reset: (key: string) => {
      store.attempts.delete(key);
    },
    store,
  };
}

// ============================================================================
// SQL INJECTION PREVENTION - PARAMETER VALIDATION
// ============================================================================

export function validateSqlIdentifier(identifier: string): boolean {
  // Only allow alphanumeric, underscore, and hyphen
  return /^[a-zA-Z0-9_-]+$/.test(identifier);
}

export function validateUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

export function validateNumericId(id: string | number): boolean {
  const num = Number(id);
  return Number.isInteger(num) && num > 0;
}

// ============================================================================
// OBFUSCATION LAYER (For URLs)
// ============================================================================

export function obfuscateId(id: string): string {
  if (!id) return "";
  try {
    const b64 = typeof Buffer !== "undefined" 
      ? Buffer.from(id).toString("base64")
      : btoa(id);
    // Use a deterministic hash for the suffix to avoid React hydration mismatches
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i);
      hash |= 0;
    }
    const suffix = Math.abs(hash).toString(16).padStart(8, '0');
    return `node_${b64.replace(/=/g, "")}_${suffix}`;
  } catch (e) {
    return id;
  }
}

export function deobfuscateId(key: string): string {
  if (!key) return "";
  try {
    // Extract the base64 part
    const parts = key.split("_");
    if (parts.length < 2) return key;
    const b64 = parts[1];
    // Add back padding if needed
    const padded = b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "=");
    return Buffer.from(padded, "base64").toString("utf-8");
  } catch (e) {
    return key;
  }
}

// NOTE: getCspHeaders and getSecurityHeaders are defined in src/lib/headers.ts
// which is the single source of truth for all security headers.
// Do not duplicate those definitions here.

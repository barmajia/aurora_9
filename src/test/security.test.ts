/**
 * Aurora Security Test Suite
 * Tests: Input validation, sanitization, JWT, rate limiting, obfuscation, CSRF
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  validateInput,
  sanitizeInput,
  sanitizeHtml,
  validateEmail,
  validateUrl,
  generateToken,
  verifyToken,
  createRateLimiter,
  validateUUID,
  validateNumericId,
  validateSqlIdentifier,
  generateCsrfToken,
  verifyCsrfToken,
} from "@/lib/security";
import { obfuscateId, deobfuscateId } from "@/lib/id-utils";

// ---------------------------------------------------------------------------
// 1. INPUT VALIDATION
// ---------------------------------------------------------------------------
describe("validateInput", () => {
  it("passes a valid schema", () => {
    const result = validateInput(
      { email: "test@example.com", name: "Alice" },
      { email: { required: true, type: "email" }, name: { required: true, min: 2 } }
    );
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("catches missing required fields", () => {
    const result = validateInput(
      {},
      { email: { required: true }, password: { required: true } }
    );
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("email is required");
    expect(result.errors).toContain("password is required");
  });

  it("catches invalid email format", () => {
    const result = validateInput(
      { email: "not-an-email" },
      { email: { required: true, type: "email" } }
    );
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatch(/email/i);
  });

  it("enforces min/max string length", () => {
    const result = validateInput(
      { name: "A", bio: "x".repeat(201) },
      { name: { required: true, min: 2 }, bio: { max: 200 } }
    );
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("at least 2"))).toBe(true);
    expect(result.errors.some((e) => e.includes("at most 200"))).toBe(true);
  });

  it("enforces enum values", () => {
    const result = validateInput(
      { role: "hacker" },
      { role: { required: true, enum: ["admin", "seller", "buyer"] } }
    );
    expect(result.valid).toBe(false);
  });

  it("validates URL type", () => {
    const bad = validateInput({ url: "not a url" }, { url: { type: "url" } });
    const good = validateInput(
      { url: "https://aurora.com" },
      { url: { type: "url" } }
    );
    expect(bad.valid).toBe(false);
    expect(good.valid).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 2. SANITIZATION / XSS PREVENTION
// ---------------------------------------------------------------------------
describe("sanitizeInput", () => {
  it("escapes HTML special characters", () => {
    const result = sanitizeInput('<script>alert("xss")</script>');
    expect(result).not.toContain("<script>");
    expect(result).toContain("&lt;script&gt;");
  });

  it("escapes ampersands", () => {
    expect(sanitizeInput("foo & bar")).toContain("&amp;");
  });

  it("truncates to maxLength", () => {
    const long = "a".repeat(500);
    expect(sanitizeInput(long, 100).length).toBeLessThanOrEqual(100);
  });

  it("handles null/undefined safely", () => {
    expect(() => sanitizeInput(null as unknown as string)).not.toThrow();
    expect(() => sanitizeInput(undefined as unknown as string)).not.toThrow();
  });
});

describe("sanitizeHtml", () => {
  it("strips <script> tags", () => {
    const result = sanitizeHtml('<p>Hello</p><script>alert(1)</script>');
    expect(result).not.toContain("<script>");
    expect(result).toContain("<p>Hello</p>");
  });

  it("strips inline event handlers", () => {
    const result = sanitizeHtml('<img src="x" onerror="alert(1)">');
    expect(result).not.toContain("onerror");
  });
});

// ---------------------------------------------------------------------------
// 3. EMAIL & URL VALIDATION
// ---------------------------------------------------------------------------
describe("validateEmail", () => {
  it("accepts valid emails", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("user+tag@sub.domain.com")).toBe(true);
  });

  it("rejects invalid emails", () => {
    expect(validateEmail("not-email")).toBe(false);
    expect(validateEmail("@missing-local.com")).toBe(false);
    expect(validateEmail("missing@tld")).toBe(false);
    expect(validateEmail("a".repeat(255) + "@too-long.com")).toBe(false);
  });
});

describe("validateUrl", () => {
  it("accepts valid URLs", () => {
    expect(validateUrl("https://example.com")).toBe(true);
    expect(validateUrl("http://localhost:3000/path?q=1")).toBe(true);
  });

  it("rejects invalid URLs", () => {
    expect(validateUrl("not a url")).toBe(false);
    expect(validateUrl("ftp://")).toBe(false);
    expect(validateUrl("")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 4. SQL IDENTIFIER & UUID VALIDATION (SQL Injection prevention)
// ---------------------------------------------------------------------------
describe("validateSqlIdentifier", () => {
  it("allows safe identifiers", () => {
    expect(validateSqlIdentifier("products")).toBe(true);
    expect(validateSqlIdentifier("user_profiles")).toBe(true);
    expect(validateSqlIdentifier("table-name")).toBe(true);
  });

  it("blocks SQL injection attempts", () => {
    expect(validateSqlIdentifier("products; DROP TABLE users--")).toBe(false);
    expect(validateSqlIdentifier("' OR '1'='1")).toBe(false);
    expect(validateSqlIdentifier("users WHERE 1=1")).toBe(false);
  });
});

describe("validateUUID", () => {
  it("validates correct UUIDs", () => {
    expect(validateUUID("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
  });

  it("rejects malformed UUIDs", () => {
    expect(validateUUID("not-a-uuid")).toBe(false);
    expect(validateUUID("123e4567-e89b-12d3-a456")).toBe(false);
    expect(validateUUID("")).toBe(false);
  });
});

describe("validateNumericId", () => {
  it("accepts positive integers", () => {
    expect(validateNumericId(1)).toBe(true);
    expect(validateNumericId("42")).toBe(true);
  });

  it("rejects zero, negative, and non-integers", () => {
    expect(validateNumericId(0)).toBe(false);
    expect(validateNumericId(-5)).toBe(false);
    expect(validateNumericId(3.14)).toBe(false);
    expect(validateNumericId("abc")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 5. JWT TOKEN GENERATION & VERIFICATION
// ---------------------------------------------------------------------------
describe("JWT tokens", () => {
  const payload = { id: "user-123", email: "test@example.com", role: "seller" };

  it("generates a valid 3-part JWT string", () => {
    const token = generateToken(payload);
    expect(token.split(".")).toHaveLength(3);
  });

  it("verifies a freshly generated token", () => {
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.id).toBe("user-123");
    expect(decoded?.role).toBe("seller");
  });

  it("rejects a tampered token", () => {
    const token = generateToken(payload);
    const parts = token.split(".");
    parts[1] = Buffer.from(JSON.stringify({ id: "hacker", role: "admin" })).toString("base64url");
    const tampered = parts.join(".");
    expect(verifyToken(tampered)).toBeNull();
  });

  it("rejects a completely invalid token", () => {
    expect(verifyToken("not.a.token")).toBeNull();
    expect(verifyToken("")).toBeNull();
    expect(verifyToken("aaa")).toBeNull();
  });

  it("rejects an expired token", () => {
    const token = generateToken(payload, -1); // already expired
    expect(verifyToken(token)).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 6. RATE LIMITING
// ---------------------------------------------------------------------------
describe("createRateLimiter", () => {
  it("allows requests under the limit", () => {
    const limiter = createRateLimiter(60000, 3);
    expect(limiter.check("ip-1")).toBe(true);
    expect(limiter.check("ip-1")).toBe(true);
    expect(limiter.check("ip-1")).toBe(true);
  });

  it("blocks requests over the limit", () => {
    const limiter = createRateLimiter(60000, 2);
    limiter.check("ip-2");
    limiter.check("ip-2");
    expect(limiter.check("ip-2")).toBe(false);
  });

  it("isolates different keys", () => {
    const limiter = createRateLimiter(60000, 2);
    limiter.check("ip-3");
    limiter.check("ip-3");
    // Different key should still pass
    expect(limiter.check("ip-4")).toBe(true);
  });

  it("resets after calling reset()", () => {
    const limiter = createRateLimiter(60000, 1);
    limiter.check("ip-5");
    expect(limiter.check("ip-5")).toBe(false);
    limiter.reset("ip-5");
    expect(limiter.check("ip-5")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 7. CSRF TOKEN
// ---------------------------------------------------------------------------
describe("CSRF tokens", () => {
  it("generates a 64-char hex token", () => {
    const token = generateCsrfToken();
    expect(token).toHaveLength(64);
    expect(/^[a-f0-9]+$/.test(token)).toBe(true);
  });

  it("verifies matching tokens", () => {
    const token = generateCsrfToken();
    expect(verifyCsrfToken(token, token)).toBe(true);
  });

  it("rejects non-matching tokens", () => {
    const a = generateCsrfToken();
    const b = generateCsrfToken();
    // They must be different
    if (a !== b) {
      expect(verifyCsrfToken(a, b)).toBe(false);
    }
  });
});

// ---------------------------------------------------------------------------
// 8. ID OBFUSCATION (client-safe, deterministic)
// ---------------------------------------------------------------------------
describe("ID obfuscation", () => {
  const sampleId = "b08a5fd9-e83f-42c8-9952-139b40233dc0";

  it("obfuscates an ID into a node_XXX_YYY format", () => {
    const result = obfuscateId(sampleId);
    expect(result).toMatch(/^node_[A-Za-z0-9+/=]+_[a-f0-9]{8}$/);
  });

  it("is deterministic (same input → same output)", () => {
    expect(obfuscateId(sampleId)).toBe(obfuscateId(sampleId));
  });

  it("different IDs produce different results", () => {
    const other = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
    expect(obfuscateId(sampleId)).not.toBe(obfuscateId(other));
  });

  it("round-trips correctly", () => {
    const obfuscated = obfuscateId(sampleId);
    const recovered = deobfuscateId(obfuscated);
    expect(recovered).toBe(sampleId);
  });

  it("handles empty string gracefully", () => {
    expect(obfuscateId("")).toBe("");
    expect(deobfuscateId("")).toBe("");
  });

  it("does not expose the raw UUID in the obfuscated URL", () => {
    const result = obfuscateId(sampleId);
    expect(result).not.toContain(sampleId);
  });
});

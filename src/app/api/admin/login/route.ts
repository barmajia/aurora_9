import { NextRequest, NextResponse } from "next/server";
import {
  generateToken,
  validateInput,
  sanitizeInput,
  hashPassword,
  verifyPassword,
  validateEmail,
  ValidationRule,
} from "@/lib/security";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH; // Should be pre-hashed

const loginSchema: Record<string, ValidationRule> = {
  email: {
    type: "email",
    required: true,
    min: 3,
    max: 254,
  },
  password: {
    type: "string",
    required: true,
    min: 8,
    max: 128,
  },
};

/**
 * SECURITY: Admin Login Endpoint
 *
 * Protections:
 * - Input validation and sanitization
 * - Email format validation
 * - Password verification with hashing (PBKDF2)
 * - JWT token generation with expiration
 * - Rate limiting (via middleware)
 * - No sensitive data in error messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // ====================================================================
    // INPUT VALIDATION
    // ====================================================================
    const validation = validateInput(body, loginSchema);
    if (!validation.valid) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { email, password } = body;

    // ====================================================================
    // SANITIZATION
    // ====================================================================
    const sanitizedEmail = sanitizeInput(email).toLowerCase();

    // ====================================================================
    // ENVIRONMENT VALIDATION
    // ====================================================================
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD_HASH) {
      console.error("Admin credentials not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    // ====================================================================
    // EMAIL CHECK (prevent user enumeration)
    // ====================================================================
    if (!validateEmail(sanitizedEmail)) {
      // Use generic error to prevent enumeration attacks
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // ====================================================================
    // EMAIL MATCH
    // ====================================================================
    if (sanitizedEmail !== ADMIN_EMAIL.toLowerCase()) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // ====================================================================
    // PASSWORD VERIFICATION
    // ====================================================================
    let isPasswordValid = false;
    try {
      isPasswordValid = await verifyPassword(password, ADMIN_PASSWORD_HASH);
    } catch (error) {
      console.error("Password verification error:", error);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // ====================================================================
    // JWT TOKEN GENERATION
    // ====================================================================
    const token = generateToken(
      {
        id: "admin",
        email: sanitizedEmail,
        role: "admin",
      },
      86400,
    ); // 24 hours

    if (!token) {
      return NextResponse.json(
        { error: "Token generation failed" },
        { status: 500 },
      );
    }

    // ====================================================================
    // SUCCESS RESPONSE
    // ====================================================================
    // SECURITY: Token is set as httpOnly cookie ONLY — it is NOT returned in
    // the response body to prevent XSS-based token theft from localStorage.
    const response = NextResponse.json({
      success: true,
      user: {
        id: "admin",
        email: sanitizedEmail,
        role: "admin",
      },
    });

    // Set secure HTTP-only cookie for token (optional but recommended)
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
}

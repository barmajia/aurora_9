/**
 * SECURITY CONFIGURATION GUIDE
 *
 * This file contains important security setup instructions.
 * Configure these environment variables in your .env.local file.
 */

/**
 * ============================================================================
 * REQUIRED ENVIRONMENT VARIABLES
 * ============================================================================
 */

/**
 * JWT_SECRET
 *
 * Used for signing JWT tokens. Must be:
 * - A strong random string (at least 32 characters)
 * - Different for each environment (dev, staging, production)
 * - Never committed to version control
 * - Rotated regularly
 *
 * Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
 *
 * Example:
 * JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
 */
export const JWT_SECRET_REQUIREMENTS = {
  minLength: 32,
  recommended: 64,
  type: "hexadecimal string",
  rotation: "every 90 days",
};

/**
 * JWT_EXPIRY
 *
 * Token expiration time in seconds.
 * Default: 86400 (24 hours)
 *
 * Example:
 * JWT_EXPIRY=86400
 */
export const JWT_EXPIRY_REQUIREMENTS = {
  shortLived: 3600, // 1 hour - for sensitive operations
  standard: 86400, // 24 hours - for regular sessions
  longLived: 604800, // 7 days - avoid this
  maximum: 2592000, // 30 days - absolute maximum
};

/**
 * ADMIN_EMAIL
 *
 * Admin account email address.
 *
 * Example:
 * ADMIN_EMAIL=admin@yoursite.com
 */

/**
 * ADMIN_PASSWORD_HASH
 *
 * IMPORTANT: This should be a pre-hashed password using PBKDF2.
 *
 * NEVER store plain text passwords!
 *
 * To generate a hash:
 * 1. Run the setup script in scripts/generate-admin-hash.ts
 * 2. Or use: node scripts/hash-password.js "your-password"
 *
 * Example:
 * ADMIN_PASSWORD_HASH=salt:hashedvalue
 */

/**
 * ALLOWED_ORIGINS
 *
 * Comma-separated list of allowed origins for CORS.
 * Restricts which domains can make cross-origin requests.
 *
 * Example:
 * ALLOWED_ORIGINS=http://localhost:3000,https://yoursite.com,https://www.yoursite.com
 */
export const ALLOWED_ORIGINS_EXAMPLE = [
  "http://localhost:3000", // Development
  "https://yoursite.com", // Production
  "https://www.yoursite.com", // www variant
];

/**
 * SUPABASE CREDENTIALS
 *
 * From Supabase project settings.
 *
 * Example:
 * NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 * NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */

/**
 * NODE_ENV
 *
 * Environment mode (development | staging | production).
 * Used for security features (HTTPS enforcement, cookie settings, etc.)
 *
 * Example:
 * NODE_ENV=production
 */

/**
 * ============================================================================
 * SECURITY BEST PRACTICES CHECKLIST
 * ============================================================================
 */

export const SECURITY_CHECKLIST = {
  authentication: [
    "✓ Use JWT_SECRET with 32+ character random string",
    "✓ Rotate JWT_SECRET every 90 days",
    "✓ Use PBKDF2 for password hashing (pre-hash admin password)",
    "✓ Never store plain text passwords",
    "✓ Set appropriate JWT_EXPIRY (24 hours standard)",
  ],

  authorization: [
    "✓ Check requireAdmin() on all sensitive endpoints",
    "✓ Check requireAuth() on all authenticated endpoints",
    "✓ Verify token expiration before processing",
    "✓ Use role-based access control (RBAC)",
  ],

  inputValidation: [
    "✓ Validate all input against schema",
    "✓ Check email format",
    "✓ Validate UUID and numeric IDs",
    "✓ Sanitize strings to prevent XSS",
    "✓ Enforce max length on all inputs",
    "✓ Use enum validation for status/role fields",
  ],

  sqlInjectionPrevention: [
    "✓ Use safeSelect(), safeUpdate(), safeDelete() for queries",
    "✓ Validate table and column names",
    "✓ Never concatenate user input into SQL",
    "✓ Use parameterized queries (Supabase handles this)",
    "✓ Validate UUID and numeric ID formats",
  ],

  rateLimiting: [
    "✓ Rate limit login attempts (5 per 15 minutes)",
    "✓ Rate limit API endpoints (20 per minute)",
    "✓ Get client IP from X-Forwarded-For header",
    "✓ Block or CAPTCHA after multiple failures",
  ],

  securityHeaders: [
    "✓ X-Content-Type-Options: nosniff",
    "✓ X-Frame-Options: DENY",
    "✓ X-XSS-Protection: 1; mode=block",
    "✓ Content-Security-Policy with strict rules",
    "✓ Strict-Transport-Security for HTTPS",
    "✓ Remove server identification headers",
  ],

  cors: [
    "✓ Only allow trusted origins",
    "✓ Validate origin header on every request",
    "✓ Set Access-Control-Allow-Credentials: true for sessions",
    "✓ Limit methods to required ones (GET, POST, etc.)",
  ],

  https: [
    "✓ Use HTTPS only in production",
    "✓ Set secure flag on cookies",
    "✓ Set SameSite=Strict on session cookies",
    "✓ Use HSTS header",
  ],

  errorHandling: [
    "✓ Never expose database errors to users",
    "✓ Log errors server-side only",
    '✓ Use generic error messages ("Invalid credentials")',
    "✓ Avoid leaking user enumeration info",
  ],

  dataProtection: [
    "✓ Hash sensitive data (passwords, API keys)",
    "✓ Encrypt data at rest (database level)",
    "✓ Encrypt data in transit (HTTPS)",
    "✓ Use HTTP-only cookies for tokens",
    "✓ Implement token refresh mechanism",
  ],

  monitoring: [
    "✓ Log authentication attempts",
    "✓ Log failed authorization",
    "✓ Monitor rate limit violations",
    "✓ Alert on multiple login failures",
    "✓ Review security logs regularly",
  ],
};

/**
 * ============================================================================
 * INITIALIZATION STEPS
 * ============================================================================
 */

export const INIT_STEPS = [
  {
    step: 1,
    title: "Generate JWT Secret",
    command:
      "node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\"",
    env: "JWT_SECRET=<generated value>",
  },
  {
    step: 2,
    title: "Hash Admin Password",
    command: 'node scripts/hash-password.js "YourAdminPassword123!"',
    env: "ADMIN_PASSWORD_HASH=<hashed value>",
  },
  {
    step: 3,
    title: "Configure CORS Origins",
    env: "ALLOWED_ORIGINS=http://localhost:3000,https://yoursite.com",
  },
  {
    step: 4,
    title: "Verify Supabase Setup",
    instruction:
      "Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
  },
  {
    step: 5,
    title: "Set Node Environment",
    env: "NODE_ENV=development (dev) or production (prod)",
  },
];

/**
 * ============================================================================
 * EXAMPLE .env.local FILE
 * ============================================================================
 */

export const EXAMPLE_ENV = `
# JWT Configuration
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRY=86400

# Admin Account (IMPORTANT: Use hashed password!)
ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD_HASH=salt:hashedvalue

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yoursite.com,https://www.yoursite.com

# Environment
NODE_ENV=development
`;

export default {
  JWT_SECRET_REQUIREMENTS,
  JWT_EXPIRY_REQUIREMENTS,
  ALLOWED_ORIGINS_EXAMPLE,
  SECURITY_CHECKLIST,
  INIT_STEPS,
  EXAMPLE_ENV,
};

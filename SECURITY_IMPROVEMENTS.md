# 🔒 Security Enhancement Guide - Aurora E-Commerce Platform

## Table of Contents

1. [Vulnerability Fixes](#vulnerability-fixes)
2. [New Security Layers](#new-security-layers)
3. [API Security](#api-security)
4. [Database Security](#database-security)
5. [Configuration](#configuration)
6. [Testing Security](#testing-security)

---

## Vulnerability Fixes

### 1. **SQL Injection Prevention** ✓

**Problem:** Unvalidated user input could be injected into SQL queries

**Solutions Implemented:**

- Created `/src/lib/database.ts` with safe query builders
- All queries validated through `safeSelect()`, `safeUpdate()`, `safeDelete()`
- Table and column names validated with `validateTableName()` and `validateColumnName()`
- UUID and numeric IDs validated with `validateUUID()` and `validateNumericId()`
- Search terms limited to 100 characters and escaped

**Example - Before:**

```typescript
// ❌ VULNERABLE
const { data } = await supabase
  .from(userInputTableName) // Could be SQL injection
  .select("*")
  .eq("id", userInputId);
```

**Example - After:**

```typescript
// ✓ SAFE
const data = await safeSelectById("orders", userId);
// Internally validates table name and ID format
```

---

### 2. **Weak Token Generation** ✓

**Problem:** Simple Base64 encoding instead of cryptographic signing

**Solutions Implemented:**

- Replaced Base64 tokens with **JWT (JSON Web Tokens)**
- Tokens now **HMAC-SHA256 signed** with secret key
- Token expiration enforced (default 24 hours)
- Signature verification on every request
- Added `generateToken()` and `verifyToken()` in security.ts

**Example - Before:**

```typescript
// ❌ WEAK - Just Base64 encoding
const token = Buffer.from(JSON.stringify(payload)).toString("base64");
// Anyone can decode and forge tokens
```

**Example - After:**

```typescript
// ✓ SECURE - Cryptographic JWT
const token = generateToken({ id: "admin", role: "admin" }, 86400);
// Returns: header.payload.signature
// Signature verified with secret on every request
```

---

### 3. **Missing Password Hashing** ✓

**Problem:** Admin password stored in plain text in environment

**Solutions Implemented:**

- Implemented **PBKDF2** password hashing (100,000 iterations)
- Random salt generation for each password
- Password verification with timing-safe comparison
- Added `hashPassword()` and `verifyPassword()` functions

**Setup:**

```bash
# Generate hashed password
node -e "const crypto = require('crypto'); const password = 'AdminPassword123!'; const salt = crypto.randomBytes(16); crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => { console.log(salt.toString('hex') + ':' + key.toString('hex')); });"

# Set in .env.local
ADMIN_PASSWORD_HASH=<generated_hash>
```

---

### 4. **XSS (Cross-Site Scripting) Vulnerabilities** ✓

**Problem:** Insufficient sanitization allowing HTML injection

**Solutions Implemented:**

- Enhanced `sanitizeInput()` now escapes all dangerous characters:
  - `&` → `&amp;`
  - `<` → `&lt;`
  - `>` → `&gt;`
  - `"` → `&quot;`
  - `'` → `&#x27;`
  - `/` → `&#x2F;`
- Added `sanitizeHtml()` for removing script tags
- Content-Security-Policy header implemented

**Example - Before:**

```typescript
// ❌ VULNERABLE
const name = userInput; // <script>alert('xss')</script>
return `<h1>${name}</h1>`; // Script executes!
```

**Example - After:**

```typescript
// ✓ SAFE
const name = sanitizeInput(userInput); // &lt;script&gt;alert('xss')&lt;/script&gt;
return `<h1>${name}</h1>`; // Renders as text, not executed
```

---

### 5. **Missing Authorization Checks** ✓

**Problem:** Admin endpoints accessible without authentication

**Solutions Implemented:**

- All sensitive endpoints now require `requireAdmin()` or `requireAuth()`
- Token verification with expiration check
- Role-based access control (RBAC)
- Proper HTTP status codes (401, 403)

**Example - Before:**

```typescript
// ❌ NO PROTECTION
export async function DELETE(request: NextRequest) {
  const id = searchParams.get("id");
  sellers = sellers.filter((s) => s.id !== id); // Anyone can delete!
}
```

**Example - After:**

```typescript
// ✓ PROTECTED
export async function DELETE(request: NextRequest) {
  const authCheck = requireAdmin(request);
  if (authCheck instanceof NextResponse) return authCheck;

  // Now only admins can delete
  sellers = sellers.filter((s) => s.id !== id);
}
```

---

### 6. **Rate Limiting Bypass** ✓

**Problem:** Login endpoints vulnerable to brute force attacks

**Solutions Implemented:**

- Rate limiting in middleware (5 attempts per 15 minutes)
- IP-based tracking with configurable windows
- API endpoint rate limiting (20 requests per minute)
- Proper cleanup of expired records

---

### 7. **Weak Input Validation** ✓

**Problem:** Insufficient validation on user inputs

**Solutions Implemented:**

- Comprehensive validation schema system
- Email format validation
- UUID and numeric ID format checking
- Enum validation for status/role fields
- Min/max length enforcement
- Pattern regex matching

**Example:**

```typescript
const schema = {
  email: { type: "email", required: true, max: 254 },
  status: { type: "enum", enum: ["active", "inactive"] },
  price: { type: "number", min: 0.01, max: 999999.99 },
};

const validation = validateInput(body, schema);
if (!validation.valid) {
  return NextResponse.json({ error: "Invalid data" }, { status: 400 });
}
```

---

### 8. **Missing Security Headers** ✓

**Problem:** No protection against MIME-type sniffing, clickjacking, XSS

**Solutions Implemented:**

- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Strict-Transport-Security (HSTS)
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (disable camera, microphone, etc.)
- Content-Security-Policy with strict rules

---

## New Security Layers

### 1. **JWT Authentication Layer**

- Located in: `src/lib/security.ts`
- Functions: `generateToken()`, `verifyToken()`, `requireAuth()`, `requireAdmin()`
- Uses: HMAC-SHA256 signature with configurable expiry

### 2. **SQL Injection Prevention Layer**

- Located in: `src/lib/database.ts`
- Functions: `safeSelect()`, `safeUpdate()`, `safeDelete()`, `safeSearch()`
- Validates: Table names, column names, ID formats

### 3. **Input Validation Layer**

- Located in: `src/lib/security.ts`
- Functions: `validateInput()`, `sanitizeInput()`, `sanitizeHtml()`
- Checks: Type, length, format, enum, pattern

### 4. **Rate Limiting Layer**

- Located in: `src/middleware.ts`
- Login attempts: 5 per 15 minutes
- API requests: 20 per minute

### 5. **Security Headers Middleware**

- Located in: `src/middleware.ts`
- Applies CORS, CSP, HSTS, and other security headers
- Validates HTTP methods and request size

---

## API Security

### Protected Endpoints

#### Admin Login

```
POST /api/admin/login
Headers: Content-Type: application/json

Body:
{
  "email": "admin@site.com",
  "password": "SecurePassword123!"
}

Response:
{
  "success": true,
  "token": "eyJhbGc...",
  "user": { "id": "admin", "email": "...", "role": "admin" }
}
```

**Security Features:**

- Email validation
- Password hashing verification (PBKDF2)
- JWT token generation (24 hour expiry)
- Rate limiting (5 attempts/15 min)
- Secure HTTP-only cookie

---

#### Get Orders

```
GET /api/orders?userId=user123&status=pending&limit=50&offset=0
Headers: Authorization: Bearer <token>

Response:
{
  "orders": [...]
}
```

**Security Features:**

- JWT authentication required
- Input validation on all parameters
- UUID/ID format validation
- Safe database queries
- Pagination limits

---

#### Admin Create Product

```
POST /api/admin/products
Headers:
  - Authorization: Bearer <token>
  - Content-Type: application/json

Body:
{
  "title": "Product Name",
  "price": 99.99,
  "stock": 50,
  "status": "active"
}
```

**Security Features:**

- Admin authentication required
- Input sanitization (XSS prevention)
- Type validation
- Price/stock validation
- Enum validation for status

---

## Database Security

### Safe Query Examples

**Safe SELECT:**

```typescript
import { safeSelect } from "@/lib/database";

const filters = [
  { column: "status", operator: "eq", value: "active" },
  { column: "price", operator: "gte", value: 100 },
];

const query = await safeSelect("products", {
  filters,
  orderBy: [{ column: "created_at", ascending: false }],
  limit: 50,
});
```

**Safe UPDATE:**

```typescript
import { safeUpdate } from "@/lib/database";

const updatedOrder = await safeUpdate("orders", orderId, {
  status: "shipped",
  notes: sanitizeInput(userNotes),
});
```

**Safe DELETE:**

```typescript
import { safeDelete } from "@/lib/database";

await safeDelete("orders", orderId);
```

**Safe SEARCH:**

```typescript
import { safeSearch } from "@/lib/database";

const results = await safeSearch(
  "products",
  ["title", "description"],
  searchTerm,
);
```

---

## Configuration

### Environment Variables Required

```env
# JWT
JWT_SECRET=<32+ char random string>
JWT_EXPIRY=86400

# Admin
ADMIN_EMAIL=admin@yoursite.com
ADMIN_PASSWORD_HASH=<hashed_password>

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yoursite.com

# Environment
NODE_ENV=production
```

### Generate Admin Password Hash

```bash
node -e "
const crypto = require('crypto');
const password = 'YourPassword123!';
const salt = crypto.randomBytes(16);
crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
  console.log(salt.toString('hex') + ':' + key.toString('hex'));
});
"
```

---

## Testing Security

### 1. Test SQL Injection Prevention

```bash
# This should return error, not execute SQL
curl -X GET 'http://localhost:3000/api/orders?userId=1; DROP TABLE orders;'
```

### 2. Test XSS Prevention

```bash
# This should be sanitized, not execute
curl -X POST 'http://localhost:3000/api/admin/sellers' \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"storeName": "<script>alert(\"xss\")</script>", "email": "test@test.com"}'
```

### 3. Test Rate Limiting

```bash
# Try login 6 times in quick succession
for i in {1..6}; do
  curl -X POST 'http://localhost:3000/api/admin/login' \
    -H "Content-Type: application/json" \
    -d '{"email": "admin@site.com", "password": "wrong"}'
done
# 6th request should return 429 (Too Many Requests)
```

### 4. Test Token Expiration

```bash
# Generate token, wait 25 hours, try to use it
# Should fail with "Invalid or expired token"
```

### 5. Test Authorization

```bash
# Try to access admin endpoint without token
curl -X GET 'http://localhost:3000/api/admin/sellers'
# Should return 401 Unauthorized
```

---

## Maintenance & Updates

### Monthly Security Tasks

- [ ] Rotate JWT_SECRET
- [ ] Review authentication logs
- [ ] Update dependencies
- [ ] Check for new vulnerabilities

### Quarterly Tasks

- [ ] Penetration testing
- [ ] Security audit
- [ ] Update security policies
- [ ] Review rate limiting thresholds

### Annual Tasks

- [ ] Full security audit
- [ ] Compliance review
- [ ] Update security training
- [ ] Disaster recovery drill

---

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SQL Injection Prevention](https://owasp.org/www-community/attacks/SQL_Injection)
- [XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8949)
- [PBKDF2](https://tools.ietf.org/html/rfc8018)

---

## Support

For security issues or vulnerabilities, please report privately to: security@yoursite.com

**DO NOT** open public GitHub issues for security vulnerabilities.

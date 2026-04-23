# Aurora Auth System - Usage Guide

## Overview

The enhanced auth store now handles:

- ✅ Session persistence in localStorage
- ✅ UUID + Account name + Account type storage
- ✅ Multi-language support (en, es, fr, ar)
- ✅ Session validation & expiration
- ✅ Authorization headers for API requests

---

## Using the `useAuth()` Hook

### Basic Setup in Components

```typescript
"use client"; // Client component required

import { useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";

export function ProfilePage() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    isMounted,
    logout,
    updateLanguage,
  } = useAuth();

  // Always check if mounted before rendering auth-dependent UI
  if (!isMounted) return null;

  if (!isAuthenticated) {
    return <redirect to="/login" />;
  }

  return (
    <div>
      <h1>Welcome, {user?.displayName}!</h1>
      <p>UUID: {user?.uuid}</p>
      <p>Account Type: {user?.accountType}</p>
      <p>Role: {user?.role}</p>
      {user?.storeName && <p>Store: {user.storeName}</p>}
      {user?.factoryName && <p>Factory: {user.factoryName}</p>}

      <button onClick={logout}>Logout</button>
      <select onChange={(e) => updateLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </div>
  );
}
```

---

## Login Example

```typescript
import { useAuth } from "@/lib/hooks/useAuth";

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await login({ email, password });

    if (result.success) {
      // Session automatically stored in localStorage
      window.location.href = "/dashboard";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Loading..." : "Login"}
      </button>
    </form>
  );
}
```

---

## Signup Example (Account Type Detection)

```typescript
import { useAuth } from "@/lib/hooks/useAuth";

export function SignupForm() {
  const { signup, isLoading, error } = useAuth();
  const [role, setRole] = useState("customer");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const credentials = {
      email: "user@example.com",
      password: "password123",
      name: "John Doe",
      role: role as "customer" | "seller" | "factory",
      ...(role === "seller" && { storeName: "My Store" }),
      ...(role === "factory" && { factoryName: "My Factory" }),
    };

    const result = await signup(credentials);

    if (result.success) {
      // Account type is automatically detected:
      // - If role === "factory" → accountType = "factory"
      // - If role === "seller" → accountType = "seller"
      // - Otherwise → accountType = "customer"
      window.location.href = "/dashboard";
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="customer">Customer</option>
        <option value="seller">Seller</option>
        <option value="factory">Factory</option>
      </select>
      {/* Other form fields */}
      <button type="submit" disabled={isLoading}>
        Sign Up
      </button>
    </form>
  );
}
```

---

## API Requests with Auth Headers

```typescript
import { useAuth } from "@/lib/hooks/useAuth";

export function MyComponent() {
  const { getAuthHeaders, isSessionValid } = useAuth();

  const fetchUserData = async () => {
    if (!isSessionValid()) {
      // Session expired, user needs to login again
      console.log("Session expired");
      return;
    }

    const response = await fetch("/api/user/profile", {
      method: "GET",
      headers: getAuthHeaders(),
    });

    const data = await response.json();
    return data;
  };

  return <button onClick={fetchUserData}>Load Profile</button>;
}
```

---

## Session Data Structure (localStorage)

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "refresh_token_here",
  "expiresAt": 1713607200000,
  "storedAt": 1713520800000
}
```

---

## User Object Structure

```typescript
{
  // UUID from database
  "id": "uuid-string-here",
  "uuid": "uuid-string-here",

  // Account info
  "email": "user@example.com",
  "name": "John Doe",
  "displayName": "My Store", // or "My Factory" or user name

  // Account type detection
  "role": "seller",
  "accountType": "seller",

  // Optional based on role
  "storeName": "My Store",
  "factoryName": null,

  // Verification status
  "isVerified": true,

  // Avatar URL
  "avatar_url": "https://...",

  // Language preference
  "language": "en"
}
```

---

## Multi-Language Support

```typescript
// Automatically set on login based on user preferences or browser language
// Available translations: en, es, fr, ar

// Auth-related translations:
-"Login successful" -
  "Signup successful" -
  "Invalid credentials" -
  "Session expired" -
  "Session restored" -
  "Account type" -
  "Customer" / "Seller" / "Factory" / "Admin" -
  "Store Name" / "Factory Name" -
  "Verified Account" / "Unverified Account" -
  "Language" -
  "User ID" -
  "Account Name";
```

---

## Important Notes

1. **Always check `isMounted`**: Components using auth must check if mounted before rendering to avoid hydration mismatches

   ```typescript
   if (!isMounted) return null;
   ```

2. **Session Expiration**: Sessions are automatically validated. If expired, `isSessionValid()` returns `false`

3. **Account Type Detection**:
   - Determined by `role` and presence of `storeName`/`factoryName`
   - `factories` table → account type = `"factory"`
   - `sellers` table → account type = `"seller"`
   - Otherwise → account type = `"customer"`

4. **Language Switching**: Calling `updateLanguage()` updates both user preference and i18n globally

5. **localStorage Safety**: The store automatically handles localStorage errors gracefully

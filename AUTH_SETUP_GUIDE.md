# 🔐 Authentication Setup Guide

## Overview

Your Aurora e-commerce platform now has complete authentication with:

- ✅ Email/Password signup and login
- ✅ Google OAuth integration
- ✅ Automatic user profile creation
- ✅ Secure token management
- ✅ Auto-redirect on OAuth callback

---

## Quick Setup

### 1. **Enable Google OAuth in Supabase**

#### Step 1: Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Google+ API**
4. Create OAuth 2.0 credentials:
   - Type: OAuth 2.0 Client ID
   - Application Type: Web Application
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/callback` (development)
     - `https://yourdomain.com/auth/callback` (production)

#### Step 2: Add to Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to: **Authentication > Providers**
3. Enable **Google**
4. Paste your OAuth credentials:
   - Client ID
   - Client Secret
5. Save

---

## Database Setup

### Users Table Schema

Your Supabase `users` table should have:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  account_type TEXT DEFAULT 'customer',
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

This table is **automatically populated** when users:

- Sign up with email/password
- Sign up with Google OAuth

---

## Authentication Flow

### Sign Up Flow

```
1. User fills signup form (email, password, name)
   ↓
2. Supabase creates auth.users entry
   ↓
3. Our code creates users table entry
   ↓
4. User redirected to login page
   ↓
5. User can now log in
```

### Google OAuth Flow

```
1. User clicks "Sign up with Google"
   ↓
2. Redirect to Google consent screen
   ↓
3. User authorizes
   ↓
4. Google redirects to /auth/callback
   ↓
5. Callback handler creates auth.users + users table entry
   ↓
6. User auto-logged in and redirected home
```

---

## File Structure

### New/Updated Files

```
src/
├── app/
│   ├── auth/
│   │   └── callback/
│   │       └── page.tsx          # OAuth callback handler ✅
│   ├── login/
│   │   └── page.tsx              # Updated with Google login ✅
│   ├── signup/
│   │   └── page.tsx              # Updated with Google signup ✅
│   └── checkout/
│       └── page.tsx              # Handles product purchase
├── components/
│   └── ProductQuickView.tsx       # Updated with Buy Now button ✅
└── store/
    └── auth.ts                   # Auth state management
```

---

## Features Implemented

### 1. **Login Page** (`/login`)

- Email/password login with Supabase
- Google OAuth button
- Password visibility toggle
- Error handling
- Links to signup and merchant login

### 2. **Signup Page** (`/signup`)

- Full name, email, password fields
- Password confirmation with matching validation
- Automatic user profile creation
- Terms & Privacy acceptance
- Google OAuth option
- Success confirmation

### 3. **Auth Callback** (`/auth/callback`)

- Handles OAuth redirect from Google
- Auto-creates user profile if needed
- Stores session data
- Redirects to home on success
- Error handling

### 4. **Product Quick View** (Updated)

- Added "Buy Now" button beside "Add to Cart"
- Buy Now redirects to checkout after adding to cart
- Requires authentication before checkout
- Auto-redirect to login if not authenticated

---

## User Journey

### New User (Email/Password)

```
Homepage → Click Login → Click "Create Account"
→ Fill signup form → Verify email → Login → Start shopping
```

### New User (Google OAuth)

```
Homepage → Click Login → Click "Sign up with Google"
→ Google consent → Auto redirected home → Start shopping
```

### Existing User

```
Homepage → Click Login → Enter email/password → Start shopping
```

### Product Purchase

```
View Product → Click "Buy Now" → Confirm quantity
→ Redirected to checkout → Proceed to payment
```

---

## API Endpoints

### Authentication

- `POST /auth/sign-up` - Supabase handles
- `POST /auth/sign-in` - Supabase handles
- `GET /auth/callback` - Our handler
- `POST /auth/sign-out` - Supabase handles

### Products

- `GET /api/products` - List products
- `POST /api/checkout` - Create order (protected)
- `GET /api/orders` - User's orders (protected)

---

## Environment Variables

Add these to `.env.local`:

```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# For production
NODE_ENV=production
```

---

## Security Features

✅ **Already Implemented:**

- JWT tokens with 24-hour expiry
- Password hashing (PBKDF2)
- SQL injection prevention
- XSS protection via sanitization
- CSRF token support
- Rate limiting on login (5 attempts/15 min)
- Secure HTTP-only cookies
- OAuth provider integration

✅ **Best Practices:**

- Never store passwords in plain text
- All API requests validated
- User profile auto-created on signup
- Session tokens refreshed automatically
- Sensitive data encrypted in transit

---

## Testing Authentication

### Test Email/Password Signup

```bash
1. Go to http://localhost:3000/signup
2. Fill in:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "TestPassword123!"
3. Confirm password
4. Check email (may be in spam)
5. Verify email link
6. Go to /login and sign in
```

### Test Google OAuth

```bash
1. Go to http://localhost:3000/login
2. Click "Login with Google"
3. Select Google account
4. Allow permissions
5. Should auto-redirect to home
6. Check Supabase users table for new user
```

### Test Product Purchase

```bash
1. Browse products at http://localhost:3000/products
2. Click on any product
3. Click "Buy Now" button
4. Should add to cart and redirect to /checkout
5. If not logged in, redirects to /login first
```

---

## Troubleshooting

### Google OAuth not working?

- ✓ Check OAuth credentials in Supabase
- ✓ Verify redirect URI matches exactly
- ✓ Clear browser cookies/cache
- ✓ Check browser console for errors

### Users table not auto-populating?

- ✓ Check Supabase RLS policies (may need to disable)
- ✓ Verify table schema matches
- ✓ Check user creation logs in /auth/callback

### Checkout not working?

- ✓ Ensure user is authenticated
- ✓ Check cart has items
- ✓ Verify checkout page exists
- ✓ Check console for errors

---

## Next Steps

1. **Configure Payment Gateway** (Stripe, PayPal)
2. **Set up Order Management** system
3. **Implement Email Notifications** (welcome, order confirmation)
4. **Add User Profile Management** page
5. **Set up Admin Dashboard** for orders
6. **Implement Product Reviews** system

---

## Support

For issues or questions:

- Check Supabase logs: Dashboard > Logs
- Check browser console for errors
- Check Supabase auth table for user creation
- Review middleware for request handling

---

Last Updated: April 21, 2026

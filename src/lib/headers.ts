// Edge-safe header generation for middleware
// This file has no Node.js dependencies to work in Edge Runtime

export function getCspHeaders() {
  return {
    "Content-Security-Policy":
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://vercel.live; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "img-src 'self' data: https: https://images.unsplash.com; " +
      "font-src 'self' data: https://fonts.gstatic.com; " +
      "connect-src 'self' https://api.stripe.com https://*.supabase.co https://*.supabase.in https://vercel.live; " +
      "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://vercel.live; " +
      "frame-ancestors 'self' https://vercel.live; " +
      "form-action 'self'; " +
      "upgrade-insecure-requests; " +
      "base-uri 'self';",
  };
}

export function getSecurityHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "SAMEORIGIN",
    // X-XSS-Protection is deprecated — modern browsers ignore it, CSP is the replacement
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=(self), usb=(), screen-wake-lock=(self)",
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    // Expect-CT is deprecated since 2021 and removed from Chrome — omitted intentionally
  };
}

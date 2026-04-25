import { NextRequest, NextResponse } from 'next/server';
import type { RateLimitConfig } from './security';

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Default configuration
const DEFAULT_CONFIG: RateLimitConfig = {
  interval: 60 * 1000, // 1 minute
  maxRequests: 100,
};

/**
 * Rate limiting middleware
 * Prevents brute force attacks and DDoS
 */
export function rateLimit(
  request: NextRequest,
  config: Partial<RateLimitConfig> = {}
): boolean {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const identifier = getIdentifier(request);
  const now = Date.now();
  
  const record = rateLimitStore.get(identifier);
  
  if (!record || now > record.resetTime) {
    // New window
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + finalConfig.interval,
    });
    return true;
  }
  
  if (record.count >= finalConfig.maxRequests) {
    return false; // Rate limit exceeded
  }
  
  record.count++;
  return true;
}

/**
 * Get unique identifier for rate limiting
 * Uses IP address, with fallback to user agent
 */
function getIdentifier(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  return `${ip}:${userAgent.slice(0, 32)}`;
}

/**
 * Clean up old entries periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Clean every minute

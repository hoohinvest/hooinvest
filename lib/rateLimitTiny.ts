/**
 * Tiny in-memory rate limiter
 * 
 * Simple rate limiting for public API endpoints.
 * Uses in-memory Map - suitable for single-instance deployments.
 * For multi-instance/serverless, consider Redis or similar.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Configuration
const WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS = 10; // 10 requests per window

/**
 * Check if identifier (e.g., IP hash) is rate limited
 * Returns true if allowed, false if rate limited
 */
export function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  // No existing record or window expired
  if (!record || now > record.resetAt) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return true;
  }

  // Within window - check count
  if (record.count >= MAX_REQUESTS) {
    return false; // Rate limited
  }

  // Increment count
  record.count++;
  return true;
}

/**
 * Clean up expired entries periodically
 * Call this occasionally to prevent memory growth
 */
export function cleanupExpiredEntries(): void {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, record] of entries) {
    if (now > record.resetAt) {
      rateLimitStore.delete(key);
    }
  }
}

// Auto-cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupExpiredEntries, 5 * 60 * 1000);
}



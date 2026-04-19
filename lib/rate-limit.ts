/**
 * Simple in-memory rate limiter using a module-level Map.
 * Per-instance only — multiple serverless instances each have their own counter,
 * which is fine for burst protection but not a hard global cap.
 * Pair with a DB-backed daily cap if you need global enforcement.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
let lastCleanupAt = 0;

export type RateLimitResult =
  | { ok: true; remaining: number }
  | { ok: false; retryAfter: number };

/**
 * Increments the counter for `key`. Returns `ok: false` with `retryAfter` (seconds)
 * once the counter exceeds `max` within `windowMs`.
 */
export function rateLimit(key: string, max: number, windowMs: number): RateLimitResult {
  if (!key) return { ok: true, remaining: max };

  const now = Date.now();

  // Lazy cleanup once per window to keep the Map bounded.
  if (now - lastCleanupAt > windowMs) {
    lastCleanupAt = now;
    buckets.forEach((v, k) => {
      if (v.resetAt < now) buckets.delete(k);
    });
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1 };
  }

  if (bucket.count >= max) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count++;
  return { ok: true, remaining: max - bucket.count };
}

/** Manually clears a key's counter. Use on successful operations to avoid penalizing valid users. */
export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// rate-limit has module-level state (the `buckets` Map). We reset modules
// before each test and re-import so every test starts from a clean slate.
describe('rateLimit', () => {
  let rateLimit: typeof import('./rate-limit').rateLimit;
  let resetRateLimit: typeof import('./rate-limit').resetRateLimit;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('./rate-limit');
    rateLimit = mod.rateLimit;
    resetRateLimit = mod.resetRateLimit;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('below the limit', () => {
    it('allows the first request and reports remaining', () => {
      const result = rateLimit('ip-a', 3, 60_000);
      expect(result).toEqual({ ok: true, remaining: 2 });
    });

    it('decrements remaining on each subsequent request', () => {
      rateLimit('ip-a', 3, 60_000);
      const r2 = rateLimit('ip-a', 3, 60_000);
      const r3 = rateLimit('ip-a', 3, 60_000);
      expect(r2).toEqual({ ok: true, remaining: 1 });
      expect(r3).toEqual({ ok: true, remaining: 0 });
    });
  });

  describe('at / over the limit', () => {
    it('rejects the (max+1)th request with retryAfter in seconds', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-19T12:00:00Z'));

      rateLimit('ip-a', 2, 60_000);
      rateLimit('ip-a', 2, 60_000);
      const blocked = rateLimit('ip-a', 2, 60_000);

      expect(blocked.ok).toBe(false);
      if (!blocked.ok) {
        // 60s window → retryAfter should be 60 or close
        expect(blocked.retryAfter).toBeGreaterThan(0);
        expect(blocked.retryAfter).toBeLessThanOrEqual(60);
      }
    });

    it('keeps rejecting while inside the window', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-19T12:00:00Z'));

      rateLimit('ip-a', 1, 60_000);
      const first = rateLimit('ip-a', 1, 60_000);
      vi.advanceTimersByTime(30_000);
      const second = rateLimit('ip-a', 1, 60_000);

      expect(first.ok).toBe(false);
      expect(second.ok).toBe(false);
    });
  });

  describe('window expiry', () => {
    it('resets the counter once the window passes', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-19T12:00:00Z'));

      rateLimit('ip-a', 1, 60_000);
      const blocked = rateLimit('ip-a', 1, 60_000);
      expect(blocked.ok).toBe(false);

      vi.advanceTimersByTime(60_001);

      const fresh = rateLimit('ip-a', 1, 60_000);
      expect(fresh).toEqual({ ok: true, remaining: 0 });
    });
  });

  describe('key isolation', () => {
    it('tracks different keys independently', () => {
      rateLimit('ip-a', 1, 60_000);
      const blockedA = rateLimit('ip-a', 1, 60_000);
      const freshB = rateLimit('ip-b', 1, 60_000);

      expect(blockedA.ok).toBe(false);
      expect(freshB).toEqual({ ok: true, remaining: 0 });
    });
  });

  describe('resetRateLimit', () => {
    it('clears a specific key so it counts fresh again', () => {
      rateLimit('ip-a', 1, 60_000);
      expect(rateLimit('ip-a', 1, 60_000).ok).toBe(false);

      resetRateLimit('ip-a');

      const afterReset = rateLimit('ip-a', 1, 60_000);
      expect(afterReset).toEqual({ ok: true, remaining: 0 });
    });

    it('does not affect other keys', () => {
      rateLimit('ip-a', 1, 60_000);
      rateLimit('ip-b', 1, 60_000);

      resetRateLimit('ip-a');

      // ip-a is fresh, ip-b is still over limit
      expect(rateLimit('ip-a', 1, 60_000).ok).toBe(true);
      expect(rateLimit('ip-b', 1, 60_000).ok).toBe(false);
    });
  });

  describe('empty key', () => {
    it('always allows with no tracking', () => {
      const r1 = rateLimit('', 1, 60_000);
      const r2 = rateLimit('', 1, 60_000);
      // Both pass because empty key short-circuits.
      expect(r1).toEqual({ ok: true, remaining: 1 });
      expect(r2).toEqual({ ok: true, remaining: 1 });
    });
  });

  describe('internal cleanup', () => {
    it('preserves non-expired buckets during a cleanup pass', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-19T12:00:00Z'));

      // Long-lived bucket — will still be valid when cleanup fires.
      rateLimit('long-lived', 1, 10_000_000);

      // Short-lived bucket — will be expired by the time cleanup fires.
      rateLimit('short-lived', 1, 60_000);

      // Advance past short-lived window but well inside long-lived window.
      vi.advanceTimersByTime(60_001);

      // Call with a new key, windowMs triggers cleanup (now - lastCleanupAt > 60_000).
      // Cleanup iterates both: keeps long-lived, deletes short-lived.
      rateLimit('trigger', 1, 60_000);

      // long-lived is still at its limit from before (count=1, max=1) → blocked.
      expect(rateLimit('long-lived', 1, 10_000_000).ok).toBe(false);

      // short-lived was cleaned up — starts fresh.
      expect(rateLimit('short-lived', 1, 60_000)).toEqual({ ok: true, remaining: 0 });
    });
  });
});

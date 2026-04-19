import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// `lib/auth.ts` captures `process.env.ADMIN_PASSWORD` at module load time.
// We stub the env and reset modules before each test so every test
// starts with a known signing secret.
describe('auth (JWT)', () => {
  beforeEach(() => {
    vi.stubEnv('ADMIN_PASSWORD', 'test-secret-for-jwt-signing-long-enough');
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  describe('createToken', () => {
    it('returns a well-formed JWT (three base64url segments)', async () => {
      const { createToken } = await import('./auth');
      const token = await createToken();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });

    it('produces a different token each call (fresh iat)', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-19T00:00:00Z'));

      const { createToken } = await import('./auth');
      const t1 = await createToken();

      // Advance past the 1-second resolution of the `iat` claim.
      vi.setSystemTime(new Date('2026-04-19T00:00:02Z'));
      const t2 = await createToken();

      expect(t1).not.toBe(t2);
    });
  });

  describe('verifyToken (roundtrip)', () => {
    it('accepts a token it just created', async () => {
      const { createToken, verifyToken } = await import('./auth');
      const token = await createToken();
      expect(await verifyToken(token)).toBe(true);
    });
  });

  describe('verifyToken (rejections)', () => {
    it('rejects an empty string', async () => {
      const { verifyToken } = await import('./auth');
      expect(await verifyToken('')).toBe(false);
    });

    it('rejects a non-JWT string', async () => {
      const { verifyToken } = await import('./auth');
      expect(await verifyToken('not-a-jwt')).toBe(false);
    });

    it('rejects a structurally invalid JWT', async () => {
      const { verifyToken } = await import('./auth');
      expect(await verifyToken('a.b.c')).toBe(false);
    });

    it('rejects a token whose signature is tampered', async () => {
      const { createToken, verifyToken } = await import('./auth');
      const token = await createToken();
      const [header, payload] = token.split('.');
      // Replace signature with a same-length garbage blob.
      const tampered = `${header}.${payload}.${'x'.repeat(43)}`;
      expect(await verifyToken(tampered)).toBe(false);
    });

    it('rejects a token signed with a different secret', async () => {
      // Mint a token under secret A.
      const { createToken } = await import('./auth');
      const tokenFromA = await createToken();

      // Swap secret, re-import the module so it captures the new secret.
      vi.stubEnv('ADMIN_PASSWORD', 'some-completely-different-secret');
      vi.resetModules();
      const { verifyToken } = await import('./auth');

      expect(await verifyToken(tokenFromA)).toBe(false);
    });

    it('rejects an expired token', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-19T00:00:00Z'));

      const { createToken, verifyToken } = await import('./auth');
      const token = await createToken();

      // Token expires after 24h. Advance 25h.
      vi.advanceTimersByTime(25 * 60 * 60 * 1000);

      expect(await verifyToken(token)).toBe(false);
    });

    it('accepts a token that is still within its 24h validity', async () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2026-04-19T00:00:00Z'));

      const { createToken, verifyToken } = await import('./auth');
      const token = await createToken();

      // Still 23h in, well inside expiry window.
      vi.advanceTimersByTime(23 * 60 * 60 * 1000);

      expect(await verifyToken(token)).toBe(true);
    });
  });
});

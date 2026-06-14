# Security Fix Tracker

Audit date: 2026-04-19. Tracks known issues in `chnspart-main` and the fix approach for each. Check items off as they land.

---

## 🔴 Critical — fix first

### 1. Admin API routes have no auth verification

- [X] **Status**: fixed 2026-04-19 — `lib/auth-guard.ts` added with `requireAdmin()`; called at the top of every admin route (GET /api/contacts, PUT/DELETE /api/contacts/[id], GET /api/clients, GET/PUT /api/clients/[id], POST/DELETE /api/clients/[id]/tags, PUT /api/clients/[id]/category). Public endpoints (POST /api/contacts, POST /api/track, auth routes) remain open by design.

- **Impact**: anyone on the internet can `GET /api/contacts` or `GET /api/clients` and receive all client/contact data (names, emails, messages, budgets). Full PII exposure.
- **Files**:
  - `app/api/contacts/route.ts` — GET, POST
  - `app/api/contacts/[id]/route.ts` — PUT, DELETE
  - `app/api/clients/route.ts` — GET
  - `app/api/clients/[id]/route.ts` — GET, PUT
  - `app/api/clients/[id]/tags/route.ts` — POST, DELETE
  - `app/api/clients/[id]/category/route.ts` — PUT
- **Root cause**: middleware only runs on `/mmm/:path*` (see `middleware.ts:24`). API routes are outside the matcher and do not re-check auth.
- **Fix**: create `lib/auth-guard.ts` with a `requireAdmin()` helper that reads the `admin-token` cookie, calls `verifyToken()`, and throws a 401 `NextResponse` on failure. Call it at the top of every admin route handler. Keep the public contact-form POST (`/api/contacts` POST) and `/api/track` POST unprotected — those are intentionally public.

### 2. Middleware only checks cookie existence, not JWT validity

- [X] **Status**: fixed 2026-04-19 — `middleware.ts` now calls `await verifyToken(token)` and redirects to `/mmm` on missing or invalid token. Forged cookies no longer pass the gate.

- **Impact**: anyone can set `admin-token=garbage` in DevTools and pass the middleware gate. Currently harmless *only because* the API routes don't check auth either — but once we fix #1, this becomes the single bypass to close.
- **File**: `middleware.ts:12-17`
- **Current**:
  ```ts
  const authToken = request.cookies.get('admin-token');
  if (!authToken) { /* redirect */ }
  ```
- **Fix**: call `await verifyToken(authToken.value)` from `lib/auth.ts`. If it throws or returns null, redirect to `/mmm`. Note: middleware runs in the Edge runtime — `jose` is already edge-compatible, so this works.

### 3. Login has no rate limiting

- [X] **Status**: fixed 2026-04-19 — `lib/rate-limit.ts` (new, reusable) + `app/api/auth/login/route.ts` uses it with 5 attempts per 15 min per IP. Successful login resets the counter so valid users aren't penalized. Failed attempts keep the counter → returns `429` with `Retry-After` header once over limit.

- **Impact**: `/api/auth/login` compares `ADMIN_PASSWORD` in a simple string check on every request. No rate limit means an attacker can brute-force at ~100 req/sec.
- **File**: `app/api/auth/login/route.ts`
- **Fix**: reuse the in-memory per-IP rate-limit pattern from `app/api/track/route.ts`, but much tighter:
  - 5 attempts per IP per 15 minutes
  - On exceeded: return 429 with `Retry-After` header
  - Optional: exponentially back off after sustained failures

---

## 🟡 High — fix this week

### 4. `ADMIN_PASSWORD` is dual-use (login credential + JWT HMAC secret)

- [ ] **Status**: unfixed

- **Impact**: if the password leaks (screen-share, logs, phishing), the attacker can forge valid admin JWTs *forever*. Rotating the password to revoke login access does *not* invalidate already-minted tokens — and rotating invalidates your own active session too.
- **File**: `lib/auth.ts`
- **Fix**:
  - Add a new env var `JWT_SECRET` (long random string, e.g. `openssl rand -base64 48`).
  - Change `createToken()` and `verifyToken()` to use `JWT_SECRET` instead of `ADMIN_PASSWORD`.
  - Add `JWT_SECRET` to Vercel env vars.
  - Now password and signing secret can be rotated independently.

### 5. Public contact form has no rate limit

- [X] **Status**: fixed 2026-04-19 — `app/api/contacts/route.ts` POST now uses `rateLimit()` from `lib/rate-limit.ts` at 5 submissions per IP per hour, returns `429` with `Retry-After`. Added payload size caps (message ≤ 5000, requirements ≤ 10000, other fields ≤ 500 chars) returning `413` on oversize, to keep hostile bodies from filling the DB.

- **Impact**: anyone can spam `POST /api/contacts` → creates a Contact row + calls Resend twice per request. Exhausts Resend quota, fills DB, floods you with notification emails.
- **File**: `app/api/contacts/route.ts`
- **Fix**: same module-level rate-limit pattern used in `/api/track`:
  - 5 submissions per IP per hour
  - Also validate payload sizes (e.g. `message.length <= 5000`, `requirements.length <= 10000`) before touching the DB

### 6. No `jti` claim in JWT — can't revoke individual sessions

- [ ] **Status**: unfixed (low priority for a solo admin)

- **Impact**: `createToken()` signs an empty payload. Logout clears the cookie client-side, but the token itself stays valid until natural 24h expiry. If malware grabs a cookie, you have no way to revoke just that session.
- **File**: `lib/auth.ts`, logout route
- **Fix (optional)**: add a `jti` (session ID) claim, store active session IDs in DB or a small in-memory allowlist, revoke on logout.
- **Workaround if skipped**: shorten `maxAge` on the cookie (e.g. 4 hours instead of 24) to bound the damage window.

---

## 🟢 Medium — fix this month

### 7. No CSRF tokens on admin mutations

- [ ] **Status**: unfixed

- **Impact**: `SameSite=lax` on the admin cookie provides most of the protection (a third-party POST won't carry the cookie in modern browsers), but it's not complete for all browsers/methods.
- **Fix options**:
  - **Simpler**: change cookie `sameSite: 'lax'` → `sameSite: 'strict'` in `app/api/auth/login/route.ts`. Only tradeoff: clicking an admin link from an external site logs you out; fine for your use case.
  - **More robust**: add a double-submit CSRF token header on state-changing admin requests.

### 8. Next.js 15.5.2 CVE in transitive dep tree

- [ ] **Status**: unfixed

- **Source**: build log warning about `CVE-2025-66478`.
- **Impact**: unclear — you're on Next 14.2.33 directly, but a transitive dep resolves 15.5.2. Could be actual risk or false positive depending on which path pulls it.
- **Fix**:
  - Run `npm ls next` — find the offender (likely `react-email` or `@react-email/preview-server`).
  - If it's a dev-only path: ignore or pin dev dep.
  - If runtime: upgrade to a patched version.

### 9. Privacy compliance for visitor tracking

- [ ] **Status**: unfixed

- **Impact**: you now store hashed IPs + UA for analytics. GDPR (EU visitors), PIPEDA (Canadian residents) may apply. Risk is low for a personal portfolio but non-zero.
- **Fix**:
  - Add a short `/privacy` page: what you collect, why, retention period.
  - Consider a simple cookie-consent banner if you want to be strict.
  - Already mitigated: no raw IP stored (hashed), bot traffic flagged, no identifying user-agent storage.

---

## 🔵 Low — hardening

### 10. Add a Content-Security-Policy header

- [ ] **Status**: unfixed

- **File**: `vercel.json`
- **Fix**: add a loose CSP header — even `default-src 'self' https:; img-src 'self' https: data:; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline';` prevents inline XSS if a vulnerable dep ever lands.

### 11. Error responses may leak stack traces

- [ ] **Status**: partially fixed

- **Audited**: `/api/clients` gates `error.message` on `NODE_ENV === 'development'` — good.
- **Need to audit**: `/api/contacts`, `/api/clients/[id]`, auth routes. Confirm no route returns `error.stack` or full `error.message` in production.

### 12. `robots.txt` should disallow admin and API paths

- [ ] **Status**: unfixed

- **Fix**: add `public/robots.txt` with:
  ```
  User-agent: *
  Disallow: /mmm/
  Disallow: /api/
  ```

  Doesn't stop determined crawlers, but keeps admin surface out of search index.

### 13. Logout doesn't rotate session

- [ ] **Status**: unfixed

- **Impact**: linked to #6 — without a `jti`, logout is purely cosmetic (clears cookie). Cookie's value is still a valid token.
- **Fix**: same as #6, skip if accepting the 24h window.

---

## Recommended fix order

1. ~~**#1 + #2** (admin API auth + middleware JWT verification)~~ — **done 2026-04-19**
2. ~~**#3** (login rate limit)~~ — **done 2026-04-19**
3. ~~**#5** (contact form rate limit)~~ — **done 2026-04-19**
4. **#4** (`JWT_SECRET` split) — 10 min; requires Vercel env var update.
5. **#8** (Next CVE investigation) — time-boxed 15 min; may or may not need action.
6. Everything else on a rolling basis.

All four critical + high-priority data-exposure / brute-force / spam issues are now closed. Remaining items are hardening and compliance.

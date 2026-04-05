# Security Threat Model & Remediation Plan — DataPlatformUI

**Date:** 2026-04-05
**Scope:** Frontend (Vue 3 SPA) + Backend (Node.js Express) + NGINX reverse proxy
**Architecture:** Vue 3 SPA → NGINX (Reclaim Cloud) → Express → MongoDB + Clowder + Email Server
**Domains:** `engageddatatest.us.reclaim.cloud`, `eds.uh.edu`

---

## Legend

| Tag | Meaning |
|-----|---------|
| **FRONTEND ONLY** | No backend or NGINX changes needed |
| **BACKEND REQUIRED** | Backend code changes needed to support the frontend fix |
| **NGINX REQUIRED** | NGINX config changes needed |

---

## Phase 1: Quick Wins — Frontend Only

### C1: Re-enable JWT Signature Verification `FRONTEND ONLY`
- **Severity:** CRITICAL
- **File:** `src/auth/jwtVerifier.js` (lines 42-58)
- **What:** `verifyJWT()` only base64-decodes the JWT payload — RS256 signature verification is commented out. Anyone can forge a token with any role.
- **Fix:** Replace the temporary decode-only function (lines 42-58) with the commented-out real verification (lines 29-38) that uses `jose.jwtVerify()` + the RSA public key.
- **Verify:** Create a JWT with a modified `userRole` claim but invalid signature → confirm the app rejects it.

### H2: Sanitize v-html in Email Previews `FRONTEND ONLY`
- **Severity:** HIGH
- **Files:**
  - `src/components/dev/instructorMailer/DevManualMailerEntryForms.vue` (lines 361, 383, 403)
  - `src/components/dev/instructorMailer/DevManualMailerExitForms.vue` (lines 392, 414, 434)
  - `src/components/dev/instructorMailer/DevManualMailerGoalForms.vue` (lines 392, 414, 434)
- **Fix:** `npm install dompurify`. Create a utility function or composable:
  ```js
  import DOMPurify from 'dompurify';
  const sanitize = (html) => DOMPurify.sanitize(html);
  ```
  Replace all `v-html="previewBody"` with `v-html="sanitize(previewBody)"` (or use a computed property).
- **Verify:** Insert `<img src=x onerror=alert(1)>` into an email template field → confirm it's stripped.

### H3: Whitelist Route Parameter for Toast Type `FRONTEND ONLY`
- **Severity:** HIGH
- **File:** `src/components/studentSide/exitFormsAvailable.vue` (lines 58-61)
- **Fix:** Add whitelist before the dynamic call:
  ```js
  const allowed = ['success', 'error', 'warning', 'info'];
  if (allowed.includes(this.$route.params.toastType)) {
    toast[this.$route.params.toastType](...);
  }
  ```

### H4: Validate Redirect URL `FRONTEND ONLY`
- **Severity:** HIGH
- **File:** `src/components/defaultPages/intakeForm.vue` (lines 195-196)
- **Fix:** Ensure redirect is a relative path:
  ```js
  if (response.data.redirectTo && response.data.redirectTo.startsWith('/')) {
    this.$router.push(response.data.redirectTo);
  }
  ```

### M5: Disable Source Maps in Production Build `FRONTEND ONLY`
- **Severity:** MEDIUM
- **File:** `vite.config.js`
- **What:** Source maps are files that map minified production JS back to your original source code. If served publicly, anyone can read your entire codebase — variable names, comments, logic, file structure.
- **Fix:** Add to the build config:
  ```js
  build: {
    outDir: "build",
    sourcemap: false
  }
  ```

### M6: Remove Google CDN, Use Local @mdi/font `FRONTEND ONLY`
- **Severity:** MEDIUM
- **File:** `index.html` (line 8)
- **Fix:** Remove: `<link rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons">`
- `@mdi/font` is already in package.json. Verify icons still work after removal.

---

## Phase 2: Coordinated Changes — Backend Required

### C2: Remove OpenAI API Key from Frontend Bundle `BACKEND REQUIRED`
- **Severity:** CRITICAL
- **File:** `src/components/dev/speechToText/speechToTextService.js` (line 19)
- **Why it's vulnerable:** `VITE_*` environment variables are inlined into the JS bundle at build time by Vite — both locally and on Reclaim Cloud. The key ends up in the shipped JavaScript regardless of how the env var is set on the server. Anyone can open DevTools and extract it.
- **Frontend fix:** Change `speechToTextService.js` to call a backend proxy:
  ```js
  const response = await axios.post(`${apiURL}/ai/transcribe`, formData);
  ```
  Remove `VITE_OPENAI_API_KEY` from `.env`.
- **Backend fix needed:** Create `POST /backend/ai/transcribe` route that:
  1. Requires auth (`basicAuth` middleware)
  2. Reads `OPENAI_API_KEY` from server-side env var (no `VITE_` prefix)
  3. Forwards the audio FormData to `https://api.openai.com/v1/audio/transcriptions`
  4. Returns the transcription text
- **Cleanup:** Rotate the current OpenAI key since it's been in client bundles.
- **Verify:** Build the app, search output JS files for `sk-proj-` → confirm absent.

### C3: Remove SSE, Replace with Polling `BACKEND REQUIRED`
- **Severity:** CRITICAL
- **Decision:** Remove all 3 EventSource connections. Replace student notifications with a simple polling endpoint.

**Frontend — Remove SSE files/code:**
- Delete `src/composables/useSSENotifications.js` entirely
- Remove the import and usage of `useSSENotifications` from wherever it's called (likely App.vue or a layout component)
- Delete the SSE code from `src/components/instructorSide/instructorMailer/instructorMailerOverview.vue` (lines 48-67) — email progress will not have real-time updates this release
- Delete `src/components/dev/instructorMailer/DevMailerOverview.vue` entirely (old dev file)

**Frontend — Add polling replacement for notifications:**
- Create a new composable `useNotificationPolling.js` that:
  1. Calls `GET /backend/studentSideData/notifications/pending` every 60 seconds via `setInterval`
  2. Compares response to previous state to detect new invitations
  3. Shows the same toast notifications that the SSE handler showed
  4. Clears interval on logout / component unmount
  5. Uses standard axios (token sent via header or cookie — no URL exposure)

**Backend fix needed:**
- Create `GET /backend/studentSideData/notifications/pending` endpoint that returns pending invitation notifications for the authenticated user. This likely already exists or is trivial to create from the existing notification query logic that the SSE endpoint uses.
- The existing SSE endpoints can be kept on the backend for now (no harm) or removed in a cleanup pass.

**NGINX cleanup (optional, not blocking):**
- The SSE-specific location blocks in `nginx-jelastic.conf` (`/backend/sse/` and `/backend/studentSideData/notifications/stream`) can be removed since nothing will connect to them. Not urgent — they're harmless if left.

### M7: File Upload Validation Hardening `BACKEND REQUIRED`
- **Severity:** MEDIUM

**Frontend fix:**
- `src/components/reusable/projectDocuments.vue` — Add client-side file size validation before upload (match backend limits per endpoint). Add magic-number validation for images (check first 4 bytes match expected file type signatures).

**Backend fixes needed (from backend review):**
- **SharePoint endpoint (`uploads.js:8-9`)** — Biggest gap: zero file type validation, zero size limit, potentially no auth middleware. Add multer file filter + size limit + auth.
- **All upload endpoints** — Add magic-number/file-signature validation using a library like `file-type` (check actual bytes, not user-supplied MIME type).
- **Clowder endpoint** — Consider blocking `.doc`/`.docx` if macro-containing documents aren't needed, or add virus scanning.
- Align `client_max_body_size` in NGINX (currently 100MB globally) with actual per-endpoint needs.

---

## Phase 3: Architecture Change — Backend + NGINX Required

### H1 + M2: Migrate Token Storage to HttpOnly Cookies (includes CSRF protection) `BACKEND REQUIRED` `NGINX REQUIRED`
- **Severity:** HIGH (H1) + MEDIUM (M2)
- This is the biggest change. It touches frontend, backend, and NGINX.

**Current state (from backend review):**
- Login (`userData.js:391-495`) returns JWT in JSON body, no cookies
- `cookie-parser` not installed, `express-session` unused
- `basicAuth.js:40-41` reads token from `req.headers.token || req.query.token`
- CORS already has `credentials: true`

**Frontend changes:**
- `src/main.js` (lines 18-20) — Remove `axios.defaults.headers['token']` setup from localStorage. Add `axios.defaults.withCredentials = true` so cookies are sent automatically.
- `src/stored/loggedInUser.js` — Remove all `localStorage.setItem('token')` / `localStorage.getItem('token')` calls (lines 85, 156-166, 270-271). Remove `token` from Pinia `persist.paths` (line 546). Remove `setTokenHeader()`/`removeTokenHeader()` methods.
- `src/router/index.js` — Route guards currently read `localStorage.getItem('token')`. After migration, the HttpOnly cookie is not accessible to JS. Two options:
  - **Option A:** Backend sets a second non-HttpOnly cookie containing just the JWT payload (no signature) for UI purposes (role, name display). Route guards read this cookie.
  - **Option B:** Route guards call a lightweight `GET /backend/auth/me` endpoint that returns the user payload. Slower but simpler.
- All components that manually set `headers: { token: ... }` on individual axios calls — remove those headers (cookie goes automatically with `withCredentials`).

**Backend changes needed:**
1. `npm install cookie-parser`
2. Add `app.use(cookieParser())` in `app.js`
3. Modify all token-issuing routes to set cookie:
   - `userData.js:391-495` (login, 200min)
   - `userData.js:154-165` (register, 30min)
   - `userData.js:276-288` (verify, 200min)
   - `userData.js:653-665` (password-reset, 30min)
   ```js
   res.cookie('token', jwt, {
     httpOnly: true,
     secure: true,
     sameSite: 'strict',   // ← This IS the CSRF protection (M2)
     maxAge: 200 * 60 * 1000,
     path: '/'
   });
   ```
4. Modify `basicAuth.js` to read from cookie:
   ```js
   const token = req.cookies.token || req.headers.token; // backwards compat during migration
   ```
5. Logout route should clear the cookie: `res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' })`

**NGINX change required:**
The `$filtered_cookie` map in `nginx-jelastic.conf` currently strips ALL cookies:
```nginx
map $http_cookie $filtered_cookie {
    default "";
}
```
Must be updated to pass the auth cookie through to Express:
```nginx
map $http_cookie $filtered_cookie {
    default "";
    "~*token=(?<token_value>[^;]+)" "token=$token_value";
}
```
This applies to both the `engageddatatest` and `eds.uh.edu` server blocks since both use `proxy_set_header Cookie $filtered_cookie`.

**M2 (CSRF) is free:** `sameSite: 'strict'` prevents cross-origin requests from including the cookie, blocking CSRF. No additional token mechanism needed.

---

## Phase 4: NGINX Only

### M3: Add Security Headers `NGINX REQUIRED`
- **Severity:** MEDIUM

Add inside both HTTPS `server` blocks (engageddatatest + eds.uh.edu), at the server level (not inside a location):
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Permissions-Policy "camera=(), microphone=(self), geolocation=()" always;
# CSP - start permissive, tighten over time:
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self';" always;
```
Note: CSP starts permissive (`unsafe-inline`, `unsafe-eval`) because Vue/Vuetify may need them. After M6 (remove Google CDN), remove the `fonts.googleapis.com` and `fonts.gstatic.com` allowances from CSP. Tighten iteratively after testing.

---

## Implementation Order

| Step | Item | Scope | Effort | Dependencies |
|------|------|-------|--------|--------------|
| 1 | C1: JWT verification | FRONTEND ONLY | Small | None |
| 2 | H2: DOMPurify v-html | FRONTEND ONLY | Small | None |
| 3 | H3: Toast whitelist | FRONTEND ONLY | Tiny | None |
| 4 | H4: Redirect validation | FRONTEND ONLY | Tiny | None |
| 5 | M5: Source maps off | FRONTEND ONLY | Tiny | None |
| 6 | M6: Remove CDN | FRONTEND ONLY | Tiny | None |
| 7 | C2: OpenAI proxy | BACKEND REQUIRED | Medium | Backend route must exist first |
| 8 | C3: Remove SSE + add polling | BACKEND REQUIRED | Medium | Backend endpoint must exist first |
| 9 | M7: Upload validation | BACKEND REQUIRED | Medium | Backend validation must be in place |
| 10 | M3: Security headers | NGINX REQUIRED | Small | None |
| 11 | H1+M2: Cookie migration | BACKEND + NGINX REQUIRED | Large | Backend cookie support + NGINX cookie map |

**Steps 1-6 can be implemented immediately with no external dependencies.**

---

## Verification Checklist

- [ ] C1: Forged JWT with wrong signature → rejected by app
- [ ] C2: Production JS bundle contains no `sk-proj-` API key
- [ ] C3: No EventSource connections in browser DevTools Network tab
- [ ] H2: `<script>alert(1)</script>` in email preview → rendered as text, not executed
- [ ] H3: URL with `toastType=constructor` → no effect
- [ ] H4: `redirectTo` with external URL → blocked
- [ ] M5: Browser DevTools Sources → no source maps served
- [ ] M6: No Google Fonts network request after CDN removal
- [ ] M7: Upload a renamed `.exe` as `.pdf` → rejected
- [ ] M3: Response headers include X-Frame-Options, HSTS, CSP
- [ ] H1: `document.cookie` in console → no `token` visible (HttpOnly)
- [ ] Run `npm audit` → address remaining dependency vulnerabilities

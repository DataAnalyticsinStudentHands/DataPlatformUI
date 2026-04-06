
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

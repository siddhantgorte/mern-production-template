# Google Auth Failure: Local + Vercel/Render

## Status

Google OAuth worked locally at commit `b16ff81`. Production never completed the return to the Vercel dashboard. Cookie and proxy changes after that commit broke **local and production**.

This is not primarily an “env is wrong” issue. The code and the split-domain cookie model are the main problems. Still confirm Google redirect URIs and exact `CLIENT_URL` / `BETTER_AUTH_URL`.

**Recommendation:** do **not** roll back. Keep the useful commits (`callbackURL`, `trust proxy`, database OAuth state) and fix cookie attributes on the current `main` branch. See [Should you roll back?](#should-you-roll-back).

---

## Timeline

| Commit | What changed | Effect |
| --- | --- | --- |
| `b16ff81` | Frontend + Google login | Local OK (localhost is same-site across ports). Production `callbackURL` hardcoded to localhost. |
| `e1f3266` | `callbackURL: window.location.origin + "/dashboard"` | Production can redirect to the Vercel **URL**; still no usable cross-site session cookie. |
| `1638034` | `app.set("trust proxy", 1)` | Correct for Render HTTPS / `Secure` cookies. Keep this. |
| `92779dc` | Production `SameSite=None; Secure` and **`partitioned: true` always** | Local cookies rejected. Production CHIPS partition mismatch. |
| `969fa2d` | `storeStateStrategy: "database"`, `skipStateCookieCheck: true` | Helps OAuth **state**, not the session cookie on Vercel. |

---

## Problem 1 — Production redirect after Google (original)

**File:** `client/src/pages/LoginPage.jsx` at `b16ff81`

```js
callbackURL: "http://localhost:5173/dashboard"
```

After Google Continue, Better Auth redirected to localhost, not Vercel.

**Already fixed in current code.** Keep:

```js
callbackURL: `${window.location.origin}/dashboard`
```

**Also required in Google Cloud Console** (not listed in the project README):

- Authorized JavaScript origins:
  - `http://localhost:5173`
  - `http://localhost:5000`
  - `https://<vercel-app>.vercel.app`
  - `https://<render-service>.onrender.com`
- Authorized redirect URIs:
  - `http://localhost:5000/api/auth/callback/google`
  - `https://<render-service>.onrender.com/api/auth/callback/google`

If the Render callback URI is missing, Google shows `redirect_uri_mismatch` and never returns to the app.

`BETTER_AUTH_URL` on Render must be `https://<render-service>.onrender.com` (https, no trailing slash). That value is the `redirect_uri` Better Auth sends to Google.

---

## Problem 2 — Cross-site cookies (Vercel ≠ Render)

`https://*.vercel.app` and `https://*.onrender.com` are different sites.

- The session cookie is set on the **Render** host during `/api/auth/callback/google`.
- The SPA on **Vercel** calls Render with `credentials: "include"`.
- `SameSite=Lax` cookies are not sent on that cross-site fetch.
- `ProtectedRoute` / `useSession()` see no session → the user never stays on `/dashboard`.

`trust proxy` is required so Express treats Render’s HTTPS correctly when setting `Secure` cookies.

---

## Problem 3 — `partitioned: true` breaks both environments

**File:** `server/src/common/config/auth.js`

```js
defaultCookieAttributes: {
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  secure: process.env.NODE_ENV === "production",
  partitioned: true, // always on
}
```

### Local

CHIPS (`Partitioned`) requires `Secure` + `SameSite=None`. Development uses `Lax` + non-secure + `Partitioned` → the browser **discards** the cookie. Local Google login fails after `92779dc`.

### Production

The session cookie is set on a **top-level** navigation to Render (Google → Render). With `Partitioned`, the partition key is the Render site. The dashboard then runs on Vercel; fetches to Render use a **different** partition. The cookie is not sent.

Better Auth’s `partitioned: true` example applies when the cookie is **set** from the frontend site’s cross-origin request. The OAuth callback does not work that way here.

---

## Problem 4 — Env traps (even if values “look right”)

1. **`CORS_ORIGIN` is unused.** CORS and Better Auth `trustedOrigins` use `CLIENT_URL` only (`server/src/app.js`, `server/src/common/config/auth.js`).
2. **`CLIENT_URL` must be the exact origin**, e.g. `https://my-app.vercel.app`, **no trailing slash**. `window.location.origin` has no slash; a trailing slash can fail `trustedOrigins` / CORS.
3. **`VITE_API_URL` is compile-time on Vercel.** Change env, then rebuild/redeploy.
4. **`server.js` calls `dotenv.config()` after importing `app.js`.** Locally, `CLIENT_URL` is missing when CORS is created. Local still works because `http://localhost:5173` is hardcoded. Render injects env before process start, so this is mainly a local footgun.
5. Do not set `NODE_ENV=production` on local HTTP. `Secure` cookies will not stick on `http://localhost`.

---

## Required code changes

### `server/src/common/config/auth.js`

Use partitioned cookies **only** if you later adopt a first-party proxy model. For current Vercel + Render OAuth:

```js
const isProd = process.env.NODE_ENV === "production"

advanced: {
  useSecureCookies: isProd,
  defaultCookieAttributes: {
    sameSite: isProd ? "none" : "lax",
    secure: isProd,
    // do not set partitioned: true
  },
},
```

Keep:

- `trustedOrigins`: localhost + `CLIENT_URL`
- `account.storeStateStrategy: "database"`
- `account.skipStateCookieCheck: true`

Keep `app.set("trust proxy", 1)` in `server/src/app.js`.

Keep `callbackURL: \`${window.location.origin}/dashboard\`` in `LoginPage.jsx`.

### Optional hardening

- Trim `CLIENT_URL` / `BETTER_AUTH_URL` when building `trustedOrigins` and CORS.
- Load `dotenv` before importing `app` (e.g. `import "dotenv/config"` first in `server.js`).
- Document production Google URIs in README.
- Remove or actually use `CORS_ORIGIN`.

---

## Should you roll back?

**No. Implement the cookie fix on the current repo.**

Rolling back to `b16ff81` would restore local login and **undo** production fixes you still need:

| Keep on current `main` | Why |
| --- | --- |
| Dynamic `callbackURL` | Production must return to Vercel, not localhost |
| `trust proxy` | Render HTTPS `Secure` cookies |
| `sameSite: "none"` in production | Cross-site Vercel → Render session fetch |
| Database OAuth state + `skipStateCookieCheck` | OAuth state cookie often missing on split domains |

Rolling back would make production redirect to localhost again. Forward-fix one line of cookie config (`remove partitioned: true`) plus Google Console / env checks.

---

## After the fixes: will everything work?

**Local: yes**, if `NODE_ENV=development` and you remove `partitioned: true`. Localhost frontend and backend are same-site (different ports), so `SameSite=Lax` session cookies work as they did at `b16ff81`.

**Production: yes in typical browsers today**, if all of the following are true:

1. `partitioned` is removed.
2. Production cookies are `SameSite=None; Secure`.
3. `trust proxy` stays enabled.
4. Google Console has the Render callback URI and both production origins.
5. Render: `BETTER_AUTH_URL` = Render origin, `CLIENT_URL` = Vercel origin (no trailing slashes).
6. Vercel: `VITE_API_URL` = Render origin, then a **fresh build**.

**Caveat:** Chrome is tightening third-party cookies. `SameSite=None` without a shared parent domain can break again later. That is a platform limit, not a rollback issue.

Stable long-term options:

- Custom domain: `app.example.com` (Vercel) + `api.example.com` (Render), cookie `Domain=.example.com`, `SameSite=Lax`.
- Vercel rewrite `/api/*` → Render so the browser only talks to the frontend origin (first-party cookies).

---

## Recommended architecture (so this does not regress)

**Best:** custom domain, e.g. `app.example.com` (Vercel) + `api.example.com` (Render), cookie `Domain=.example.com`, `SameSite=Lax`. No third-party cookies.

**Good without buying a domain:** Vercel rewrite `/api/*` → Render. Browser origin is only Vercel. Set `VITE_API_URL` to the Vercel origin (or relative). Set `BETTER_AUTH_URL` to the **public URL the browser and Google use**. Then `SameSite=Lax` can work.

`SameSite=None; Secure` without `Partitioned` can work while Chrome still allows third-party cookies; it is not a stable long-term bet.

---

## Verification checklist

Local (`NODE_ENV=development`):

- [ ] Session cookie on `localhost:5000` is `SameSite=Lax`, not `Partitioned`, not `Secure`.
- [ ] Google Continue → `http://localhost:5173/dashboard` and session persists.

Production:

- [ ] Google Continue → `https://<vercel>/dashboard` (not localhost).
- [ ] DevTools: request to Render `/api/auth/get-session` includes the session cookie.
- [ ] Cookie: `SameSite=None; Secure`; not `Partitioned`.
- [ ] Refresh dashboard stays signed in; Navbar shows the user; `/api/users/me` is 200.

If redirect never leaves Google: fix Google redirect URI / `BETTER_AUTH_URL`.  
If you hit Vercel `/dashboard` then login: cookies / `CLIENT_URL` / `VITE_API_URL`.
